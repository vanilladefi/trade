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
              'default-src https://vanilladefi.com http://vanilladefi.com https://plausible.io; img-src https://raw.githubusercontent.com https://ipfs.io https://assets.coingecko.com https://vanilladefi.com; connect-src ',
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
        ],
      },
    ]
  },
})
