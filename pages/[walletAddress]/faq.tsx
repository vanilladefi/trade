import fs from 'fs'
import matter from 'gray-matter'
import { GetStaticPaths, GetStaticProps } from 'next'
import FAQ from 'pages/faq'
import { parseWalletAddressFromQuery } from 'utils/api'
import { getCachedWalletBalances } from 'utils/cache/meta'
import { getCachedVnlHolders } from 'utils/cache/users'

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const walletAddress = parseWalletAddressFromQuery(params)

  const rawFileSource = fs.readFileSync('data/content/faq.mdx')
  const { content } = matter(rawFileSource)

  const walletBalances = await getCachedWalletBalances(walletAddress)

  return {
    props: {
      mdx: content,
      pageTitle: 'Frequently Asked Questions',
      SEOTitle: 'FAQ',
      walletAddress: walletAddress,
      ...walletBalances,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const vnlHolders = await getCachedVnlHolders()
  return {
    paths: vnlHolders.map((address) => `/${address}/faq`),
    fallback: true,
  }
}

export default FAQ
