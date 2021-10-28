import fs from 'fs'
import matter from 'gray-matter'
import { GetStaticPaths, GetStaticProps } from 'next'
import BugBounty from 'pages/bug-bounty'
import { parseWalletAddressFromQuery } from 'utils/api'
import { getCachedWalletBalances } from 'utils/cache/meta'
import { getCachedVnlHolders } from 'utils/cache/users'

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const walletAddress = parseWalletAddressFromQuery(params)

  const rawFileSource = fs.readFileSync('data/content/bug-bounty.mdx')
  const { content } = matter(rawFileSource)

  const walletBalances = await getCachedWalletBalances(walletAddress)

  return {
    props: {
      mdx: content,
      pageTitle: 'Bug Bounty Program',
      SEOTitle: 'Bug Bounty',
      walletAddress: walletAddress,
      ...walletBalances,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const vnlHolders = await getCachedVnlHolders()
  return {
    paths: vnlHolders.map((address) => `/${address}/bug-bounty`),
    fallback: true,
  }
}

export default BugBounty
