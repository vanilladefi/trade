/* eslint-disable @typescript-eslint/no-var-requires */

const slug = require('remark-slug')
const headings = require('remark-autolink-headings')

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [slug, headings],
  },
})

module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US',
    localeDetection: false,
  },
  images: {
    domains: ['raw.githubusercontent.com', 'ipfs.io', 'assets.coingecko.com'],
  },
  async headers() {
    return [
      {
        source: '/:path*{/}?',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; img-src 'self' *raw.githubusercontent.com https://ipfs.io https://assets.coingecko.com https://vanilladefi.com *equilibriumco.vercel.app; script-src 'self' 'unsafe-inline' https://vanilladefi.com https://plausible.io *equilibriumco.vercel.app; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.thegraph.com wss://api.thegraph.com https://eth-mainnet.alchemyapi.io wss://eth-mainnet.alchemyapi.io",
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: "camera('none'); microphone('none'); geolocation('none')",
          },
        ],
      },
    ]
  },
})
