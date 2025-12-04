"use server";

import { registerSchema } from "@/lib/zod";
// DÜZELTME 1: updateProfile fonksiyonunu da içe aktardık
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import app from "@/lib/firebase"; 

const auth = getAuth(app); 

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

    // --- FIREBASE KAYIT İŞLEMİ ---

    // 1. Kullanıcıyı oluştur
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );

    // DÜZELTME 2: Kullanıcı adını (DisplayName) kaydetme satırını aktif ettik
    // Kullanıcı oluştuysa, hemen profilini güncelle ve ismini ekle
    if (userCredential.user) {
        await updateProfile(userCredential.user, { 
            displayName: username 
        });
    }

    return { success: true };

  } catch (error: any) {
    console.error("Firebase Kayıt Hatası DETAYLI:", error);

    let errorMessage = "Kayıt sırasında bir hata oluştu.";
    
    // Hataları daha net yakala
    if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Bu e-posta adresi zaten kullanılıyor.";
    } else if (error.code === 'auth/weak-password') {
        errorMessage = "Şifre en az 6 karakter olmalıdır.";
    } else if (error.code === 'auth/invalid-api-key') {
        errorMessage = "Sistem hatası: API Anahtarı geçersiz.";
    } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Ağ hatası: Firebase'e ulaşılamıyor.";
    }
    
    return { error: errorMessage };
  }
}