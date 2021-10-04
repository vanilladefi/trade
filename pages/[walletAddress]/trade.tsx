import { getAverageBlockCountPerHour, getCurrentBlockNumber } from 'lib/block'
import {
  addGraphInfo,
  addLogoColor,
  addObservationCardinality,
  addUSDPrice,
  addVnlEligibility,
  getAllTokens,
  getETHPrice,
} from 'lib/tokens'
import { getUserPositions } from 'lib/vanilla'
import { getBasicWalletDetails, getUsers } from 'lib/vanilla/users'
import type { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next'
import { PrerenderProps } from 'types/content'
import { UniswapVersion, VanillaVersion } from 'types/general'
import { Eligibility, Token } from 'types/trade'
import { parseWalletAddressFromQuery } from 'utils/api'
import TradePage from '../trade'

export default TradePage

export const getStaticProps: GetStaticProps = async ({
  params,
}): Promise<GetStaticPropsResult<PrerenderProps>> => {
  const walletAddress: string | false = parseWalletAddressFromQuery(params)
  const { vnlBalance, ethBalance } =
    (walletAddress &&
      (await getBasicWalletDetails(VanillaVersion.V1_1, walletAddress))) ||
    undefined

  let block24hAgo: number

  const currentBlockNumber = await getCurrentBlockNumber(UniswapVersion.v3)

  // Fetch Uniswap V2 token info
  let tokensV2 = getAllTokens(VanillaVersion.V1_0)
  tokensV2 = await addLogoColor(tokensV2)

  // Fetch these simultaneously
  const [blocksPerHourV2, ethPriceV2] = await Promise.all([
    getAverageBlockCountPerHour(),
    getETHPrice(UniswapVersion.v2),
  ])

  if (ethPriceV2 === 0 || currentBlockNumber === 0 || blocksPerHourV2 === 0) {
    throw Error('Query failed')
  }

  block24hAgo = currentBlockNumber - 24 * blocksPerHourV2

  tokensV2 = await addGraphInfo(UniswapVersion.v2, tokensV2, 0, ethPriceV2)
  tokensV2 = addUSDPrice(tokensV2, ethPriceV2)
  tokensV2 = await addVnlEligibility(tokensV2, VanillaVersion.V1_0)

  // Add historical data (price change)
  if (block24hAgo > 0) {
    tokensV2 = await addGraphInfo(
      UniswapVersion.v2,
      tokensV2,
      block24hAgo,
      ethPriceV2,
    )
  }

  let userPositionsV2: Token[] | null
  try {
    userPositionsV2 = await getUserPositions(
      VanillaVersion.V1_0,
      walletAddress || '',
      tokensV2,
    )
  } catch (e) {
    console.error(e)
    userPositionsV2 = null
  }

  // Fetch Uniswap V3 token info
  let tokensV3 = getAllTokens(VanillaVersion.V1_1)
  tokensV3 = await addLogoColor(tokensV3)

  // Fetch these simultaneously
  const [blocksPerHourV3, ethPriceV3] = await Promise.all([
    getAverageBlockCountPerHour(),
    getETHPrice(UniswapVersion.v3),
  ])

  if (ethPriceV3 === 0 || currentBlockNumber === 0 || blocksPerHourV3 === 0) {
    throw Error('Query failed')
  }

  tokensV3 = await addGraphInfo(UniswapVersion.v3, tokensV3, 0, ethPriceV3)
  tokensV3 = addUSDPrice(tokensV3, ethPriceV3)
  tokensV3 = tokensV3.map((token) => {
    token.eligible = Eligibility.Eligible
    return token
  })
  tokensV3 = await addObservationCardinality(tokensV3)

  block24hAgo = currentBlockNumber - 24 * blocksPerHourV3

  // Add historical data (price change)
  if (block24hAgo > 0) {
    tokensV3 = await addGraphInfo(
      UniswapVersion.v3,
      tokensV3,
      block24hAgo,
      ethPriceV3,
    )
  }

  let userPositionsV3: Token[] | null
  try {
    userPositionsV3 = await getUserPositions(
      VanillaVersion.V1_1,
      walletAddress || '',
      tokensV3,
    )
  } catch (e) {
    console.error(e)
    userPositionsV3 = null
  }

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
      ethPrice: ethPriceV3 || ethPriceV2 || 0,
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
