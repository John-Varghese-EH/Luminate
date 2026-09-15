import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.svgrepo.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Cross-Origin-Opener-Policy",
          value: "unsafe-none",
        },
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload'
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
        },
        {
          key: 'X-Permitted-Cross-Domain-Policies',
          value: 'none'
        },
        {
          key: 'Origin-Agent-Cluster',
          value: '?1'
        },
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; frame-src 'self' https://*.firebaseapp.com https://luminate-j0x.firebaseapp.com; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://apis.google.com https://*.googleapis.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://db.onlinewebfonts.com; font-src 'self' data: https://cdnjs.cloudflare.com https://db.onlinewebfonts.com; img-src 'self' data: blob: https://lh3.googleusercontent.com https://www.svgrepo.com; media-src 'self' https://d8j0ntlcm91z4.cloudfront.net; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://disposable.debounce.io https://www.google-analytics.com; upgrade-insecure-requests"
        }
      ],
    },
  ],
};

export default nextConfig;
