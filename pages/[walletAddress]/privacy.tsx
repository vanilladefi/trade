import fs from 'fs'
import matter from 'gray-matter'
import { GetStaticPaths, GetStaticProps } from 'next'
import Privacy from 'pages/privacy'
import { parseWalletAddressFromQuery } from 'utils/api'
import { getCachedWalletBalances } from 'utils/cache/meta'
import { getCachedVnlHolders } from 'utils/cache/users'

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const walletAddress = parseWalletAddressFromQuery(params)

  const rawFileSource = fs.readFileSync('data/content/privacy.mdx')
  const { content } = matter(rawFileSource)

  const walletBalances = await getCachedWalletBalances(walletAddress)

  return {
    props: {
      mdx: content,
      pageTitle: 'Privacy Notice',
      SEOTitle: 'Privacy Policy',
      walletAddress: walletAddress,
      ...walletBalances,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const vnlHolders = await getCachedVnlHolders()
  return {
    paths: vnlHolders.map((address) => `/${address}/privacy`),
    fallback: true,
  }
}

export default Privacy
