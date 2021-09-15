import { getUserPositions } from 'lib/vanilla'
import { getUsers } from 'lib/vanilla/users'
import type { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next'
import { PrerenderProps } from 'types/content'
import { VanillaVersion } from 'types/general'
import { parseWalletAddressFromQuery } from 'utils/api'
import {
  getBlockNumber,
  getEthPrice,
  getWalletBalances,
} from 'utils/cache/meta'
import { getUserPositionsV2, getUserPositionsV3 } from 'utils/cache/positions'
import { getV2Tokens, getV3Tokens } from 'utils/cache/tokens'
import TradePage from '../trade'

export default TradePage

export const getStaticProps: GetStaticProps = async ({
  params,
}): Promise<GetStaticPropsResult<PrerenderProps>> => {
  const walletAddress: string | false = parseWalletAddressFromQuery(params)

  const { vnlBalance, ethBalance } = await getWalletBalances(walletAddress)

  const currentBlockNumber = await getBlockNumber()
  const ethPrice = await getEthPrice()

  const tokensV2 = await getV2Tokens(currentBlockNumber, ethPrice)
  const userPositionsV2 = await getUserPositionsV2(tokensV2, walletAddress)

  const tokensV3 = await getV3Tokens(currentBlockNumber, ethPrice)
  const userPositionsV3 = await getUserPositionsV3(tokensV3, walletAddress)

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
  const users = await getUsers()
  const usersWithPositions = users.filter(async (user) => {
    const positionsV1_0 = await getUserPositions(VanillaVersion.V1_0, user)
    const positionsV1_1 = await getUserPositions(VanillaVersion.V1_1, user)
    return positionsV1_0.length + positionsV1_1.length > 0
  })
  return {
    paths: usersWithPositions.map((user) => `/${user}/trade`),
    fallback: true,
  }
}
