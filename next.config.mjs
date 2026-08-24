/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/LOVE-FOR-BARSANA' : '',
  transpilePackages: ['three'],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
