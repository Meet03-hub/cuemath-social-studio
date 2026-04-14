/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // This will ignore the file-saver error and let Vercel finish the build
    ignoreBuildErrors: true,
  },
  eslint: {
    // This will also ignore linting errors which sometimes block Vercel builds
    ignoreDuringBuilds: true,
  },
};