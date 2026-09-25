/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/data/**', '**/node_modules/**'],
    };
    return config;
  },
};

export default nextConfig;

