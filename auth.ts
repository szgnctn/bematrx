import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { ZodError } from "zod"
import { loginSchema } from "./lib/zod"
// YENİ: Firebase giriş fonksiyonunu içe aktarıyoruz
import { signInFirebaseUser } from "./utils/auth-firebase" 
// ESKİ: import { getUserFromDb } from "./utils/db" satırını kaldırdık/değiştirdik

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await loginSchema.parseAsync(credentials)

          // KRİTİK GÜNCELLEME: Firebase ile şifre kontrolü yapılıyor
          const user = await signInFirebaseUser(email, password)

          if (!user) {
            // Firebase'den kullanıcı bulunamazsa veya şifre yanlışsa null döndürülür
            return null
          }
          // Firebase'den gelen kullanıcı nesnesi, Auth.js oturumu için döndürülür
          return user
        } 
        catch (error) {
          if (error instanceof ZodError) {
            // Veri doğrulama (email formatı vb.) hatası
            return null
          }
          // Bilinmeyen diğer hatalar
          return null
        }
      }
    }),
    
    // Diğer sağlayıcılar değişmedi
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
})