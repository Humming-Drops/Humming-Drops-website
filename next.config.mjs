/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for lean production Docker containerization on Railway
  output: 'standalone',

  // Externalize database drivers for Node.js runtime
  serverExternalPackages: ['postgres'],

  // React Strict Mode for detecting side effects and lifecycle bugs
  reactStrictMode: true,

  // Disable 'x-powered-by: Next.js' header for fingerprint obfuscation
  poweredByHeader: false,

  // Compress responses with gzip/brotli
  compress: true,

  // HTTP Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
