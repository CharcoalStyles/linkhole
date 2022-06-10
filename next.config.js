/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pwa: {
    dest: 'public'
  }
}

const withPWA = require('next-pwa')
module.exports = withPWA(nextConfig)
