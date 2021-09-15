import type { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next'
import { PrerenderProps } from 'types/content'
import { parseWalletAddressFromQuery } from 'utils/api'
import {
  getCachedBlockNumber,
  getCachedEthPrice,
  getCachedWalletBalances,
} from 'utils/cache/meta'
import {
  getCachedUserPositionsV2,
  getCachedUserPositionsV3,
} from 'utils/cache/positions'
import { getCachedV2Tokens, getCachedV3Tokens } from 'utils/cache/tokens'
import { getCachedUsersWithPositions } from 'utils/cache/users'
import TradePage from '../trade'

export default TradePage

export const getStaticProps: GetStaticProps = async ({
  params,
}): Promise<GetStaticPropsResult<PrerenderProps>> => {
  const walletAddress: string | false = parseWalletAddressFromQuery(params)

  const { vnlBalance, ethBalance } = await getCachedWalletBalances(
    walletAddress,
  )

  const currentBlockNumber = await getCachedBlockNumber()
  const ethPrice = await getCachedEthPrice()

  const tokensV2 = await getCachedV2Tokens(currentBlockNumber, ethPrice)
  const userPositionsV2 = await getCachedUserPositionsV2(
    tokensV2,
    walletAddress,
  )

  const tokensV3 = await getCachedV3Tokens(currentBlockNumber, ethPrice)
  const userPositionsV3 = await getCachedUserPositionsV3(
    tokensV3,
    walletAddress,
  )

  return {
    props: {
      walletAddress: walletAddress,
      vnlBalance: vnlBalance,
      ethBalance: ethBalance,
      initialTokens: {
        v2: tokensV2,
        v3: tokensV3,
        userPositionsV2: userPositionsV2,
        userPositionsV3: userPositionsV3,
      },
      ethPrice: ethPrice || 0,
      currentBlockNumber: currentBlockNumber,
    },
    revalidate: 300,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const usersWithPositions = await getCachedUsersWithPositions()
  return {
    paths: usersWithPositions.map((user) => `/${user}/trade`),
    fallback: true,
  }
}
