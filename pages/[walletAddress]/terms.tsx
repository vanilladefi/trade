import fs from 'fs'
import matter from 'gray-matter'
import { GetStaticPaths, GetStaticProps } from 'next'
import Terms from 'pages/terms'
import { parseWalletAddressFromQuery } from 'utils/api'
import { getCachedWalletBalances } from 'utils/cache/meta'
import { getCachedVnlHolders } from 'utils/cache/users'

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const walletAddress = parseWalletAddressFromQuery(params)

  const rawFileSource = fs.readFileSync('data/content/terms.mdx')
  const { content } = matter(rawFileSource)

  const walletBalances = await getCachedWalletBalances(walletAddress)

  return {
    props: {
      mdx: content,
      pageTitle: 'Terms of Use',
      SEOTitle: 'Terms of Use',
      walletAddress: walletAddress,
      ...walletBalances,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const vnlHolders = await getCachedVnlHolders()
  return {
    paths: vnlHolders.map((address) => `/${address}/terms`),
    fallback: true,
  }
}

export default Terms
