/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
      }, {
        protocol: 'https',
        hostname: 'hrm.ltsgroup.tech',
        port: '',
      },
    ],
  },
};

module.exports = nextConfig;
