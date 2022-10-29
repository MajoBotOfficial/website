/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/invite",
        permanent: true,
        destination:
          "https://discord.com/api/oauth2/authorize?client_id=734744742054854696&permissions=1644959362263&scope=bot%20applications.commands",
      },
    ];
  },
};

module.exports = nextConfig;
