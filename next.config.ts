/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tfaihyrnpuiludfzpmlg.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/product_images/**",
      },
    ],
  },
};

module.exports = nextConfig;
