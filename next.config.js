/* eslint-disable @typescript-eslint/no-var-requires */

const slug = require('remark-slug')
const headings = require('remark-autolink-headings')
const remarkMath = require('remark-math')
const rehypeKatex = require('rehype-katex')

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [slug, headings, remarkMath],
    rehypePlugins: [() => rehypeKatex({ output: 'html' })],
  },
})

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(
  withMDX({
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
    i18n: {
      locales: ['en-US'],
      defaultLocale: 'en-US',
      localeDetection: false,
    },
    images: {
      domains: [
        'raw.githubusercontent.com',
        'ipfs.io',
        'assets.coingecko.com',
        'etherscan.io',
      ],
    },
    experimental: {
      staticPageGenerationTimeout: 120,
    },
    webpackDevMiddleware: (config) => {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
      return config
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
            /*  {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; img-src 'self' data: https://assets.coingecko.com https://ipfs.io https://raw.githubusercontent.com https://render.githubusercontent.com https://media.giphy.com; media-src 'self' https://media.giphy.com; script-src 'self' 'unsafe-inline' https://plausible.io; font-src 'self'; style-src 'self' 'unsafe-inline'; prefetch-src https://vanilladefi.com *equilibriumco.vercel.app; connect-src 'self' wss://bridge.walletconnect.org https://api.thegraph.com wss://api.thegraph.com https://eth-mainnet.alchemyapi.io wss://eth-mainnet.alchemyapi.io https://plausible.io; frame-ancestors 'none'; base-uri 'none'; form-action 'none'; manifest-src 'self';",
          }, */
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
  }),
)
