import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "@/lib/firebase"; // Firebase uygulamasının başlatıldığı varsayılan dosya

const auth = getAuth(app); // Firebase Auth servisini başlat

interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

// Bu fonksiyon, e-posta ve şifreyi Firebase'e gönderir.
export async function signInFirebaseUser(email: string, password: string): Promise<AuthUser | null> {
  try {
    // Firebase'in yerleşik giriş komutunu kullan
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user) {
      // Giriş başarılıysa, Auth.js'in beklediği formatta bir kullanıcı nesnesi döndür
      return {
        id: user.uid, // Firebase kullanıcı ID'si
        email: user.email!, // Firebase e-postası
        name: user.displayName || 'Kullanıcı', // Firebase Adı
        // Diğer gerekli alanlar buraya eklenebilir
      };
    }
    return null;

  } catch (error) {
    // Hata olduğunda (örn: Şifre yanlış, kullanıcı bulunamadı)
    console.error("FIREBASE GİRİŞ HATASI:", error);
    return null; // Auth.js'e hata olduğunu bildirir
  }
}