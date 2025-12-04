/** @type {import('next').NextConfig} */
const nextConfig = {
  // NEXT.JS IMAGE OPTIMIZATION AYARLARI BURAYA EKLENDİ
  images: {
    remotePatterns: [
      // 1. Google profil resimlerinin geldiği adres
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      // 2. GitHub profil resimlerinin geldiği adres
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;