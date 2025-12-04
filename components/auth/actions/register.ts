"use server";

import { registerSchema } from "@/lib/zod";
// Adım 1: Firebase Auth modüllerini içe aktar
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from "@/lib/firebase"; 

const auth = getAuth(app); // Firebase Auth servisini başlat

export async function registerUser(formData: FormData): Promise<
  | { success: true }
  | { error: string }
> {
  try {
    const username = formData.get("username")?.toString() ?? "";
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    const acceptTerms = formData.get("acceptTerms") === "on";

    const result = registerSchema.safeParse({
      username,
      email,
      password,
      acceptTerms,
    });

    if (!result.success) {
      const errorMessages = result.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join(", ");
      return { error: `Doğrulama hatası: ${errorMessages}` };
    }
    
    // --- KRİTİK EKLENTİ: KULLANICIYI FIREBASE'E KAYDETME ---

    // 1. Firebase kullanıcı oluşturma komutunu çalıştır
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );

    // Başarılı kayıttan sonra kullanıcı adını da eklemek isterseniz:
    // await updateProfile(userCredential.user, { displayName: username });

    // 2. Başarılı olduğunu döndür
    return { success: true };

  } catch (error: any) {
    // Firebase hatası yakalama (örn: 'auth/email-already-in-use')
    console.error("Firebase Kayıt Hatası:", error);

    // Kullanıcıya anlaşılır bir hata mesajı döndürme
    let errorMessage = "Kayıt sırasında bir hata oluştu.";
    if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Bu e-posta adresi zaten kullanılıyor.";
    } else if (error.code === 'auth/weak-password') {
        errorMessage = "Şifre en az 6 karakter olmalıdır.";
    }
    
    return { error: errorMessage };
  }
}