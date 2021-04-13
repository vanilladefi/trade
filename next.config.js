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
        ],
      },
    ]
  },
})
