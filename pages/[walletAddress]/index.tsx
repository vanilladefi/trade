import { getBasicWalletDetails, getVnlHolders } from 'lib/vanilla/users'
import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next'
import IndexPage from 'pages'
import { PrerenderProps } from 'types/content'
import { parseWalletAddressFromQuery } from 'utils/api'

export default IndexPage

export const getStaticProps: GetStaticProps = async ({
  params,
}): Promise<GetStaticPropsResult<PrerenderProps>> => {
  const walletAddress = parseWalletAddressFromQuery(params)

  const { vnlBalance, ethBalance } = await getBasicWalletDetails(
    walletAddress || '',
  )

  return {
    props: {
      walletAddress: walletAddress,
      vnlBalance: vnlBalance,
      ethBalance: ethBalance,
    },
    revalidate: 300,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const vnlHolders = await getVnlHolders()
  return {
    paths: vnlHolders.map((address) => `/${address}`),
    fallback: true,
  }
}
