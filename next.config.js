/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// }

require("dotenv").config();

module.exports = {
  reactStrictMode: true,
  env: {
    url: process.env.url,
  },
};
