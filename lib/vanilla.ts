import { Percent as V2Percent, Trade as TradeV2 } from '@uniswap/sdk'
import {
  Percent,
  Token as UniswapToken,
  TokenAmount,
  TradeType,
} from '@uniswap/sdk-core'
import { FeeAmount } from '@uniswap/v3-sdk'
import {
  BigNumber,
  constants,
  ethers,
  Event,
  providers,
  Signer,
  utils,
} from 'ethers'
import { formatUnits, getAddress } from 'ethers/lib/utils'
import { getVanillaRouter } from 'hooks/useVanillaRouter'
import keccak256 from 'keccak256'
import {
  constructTrade as constructV2Trade,
  tryParseAmount,
} from 'lib/uniswap/v2/trade'
import { constructTrade as constructV3Trade } from 'lib/uniswap/v3/trade'
import { MerkleTree } from 'merkletreejs'
import vanillaRouter from 'types/abis/vanillaRouter.json'
import { VanillaVersion } from 'types/general'
import {
  Operation,
  RewardEstimate,
  RewardResponse,
  Token,
  TokenPriceResponse,
  V3Trade,
} from 'types/trade'
import {
  VanillaV1MigrationState__factory,
  VanillaV1Router02__factory,
  VanillaV1Token01,
  VanillaV1Token02,
} from 'types/typechain/vanilla_v1.1'
import {
  blockDeadlineThreshold,
  defaultProvider,
  getVanillaRouterAddress,
  getVnlTokenAddress,
  vnlDecimals,
} from 'utils/config'
import { UniswapVersion } from './graphql'
import {
  getAllTokens,
  getETHPrice,
  isAddress,
  tokenListChainId,
  weth,
} from './tokens'

export const estimateReward = async (
  version: VanillaVersion,
  owner: string,
  signerOrProvider: Signer | providers.Provider,
  tokenSold: Token,
  tokenReceived: Token,
  amountSold: string,
  amountReceived: string,
): Promise<RewardResponse | null> => {
  const [parsedAmountSold, parsedAmountReceived] = [
    tryParseAmount(amountSold, tokenSold),
    tryParseAmount(amountReceived, tokenReceived),
  ]
  let reward: RewardResponse | null = null
  if (
    parsedAmountReceived &&
    parsedAmountSold &&
    parsedAmountReceived.greaterThan('0') &&
    parsedAmountSold.greaterThan('0') &&
    isAddress(owner)
  ) {
    const router =
      version === VanillaVersion.V1_0
        ? new ethers.Contract(
            getVanillaRouterAddress(VanillaVersion.V1_0),
            JSON.stringify(vanillaRouter.abi),
            signerOrProvider,
          )
        : VanillaV1Router02__factory.connect(
            getVanillaRouterAddress(VanillaVersion.V1_1),
            signerOrProvider,
          )

    try {
      reward = await router.estimateReward(
        owner,
        tokenSold.address,
        parsedAmountReceived?.raw.toString(),
        parsedAmountSold?.raw.toString(),
      )
    } catch (e) {
      console.error('estimateReward', e)
      reward = null
    }
  }
  return reward
}

export const getPriceData = async (
  version: VanillaVersion,
  owner: string,
  signerOrProvider: Signer | providers.Provider,
  tokenAddress: string,
): Promise<TokenPriceResponse | null> => {
  const router =
    version === VanillaVersion.V1_0
      ? new ethers.Contract(
          getVanillaRouterAddress(VanillaVersion.V1_0),
          JSON.stringify(vanillaRouter.abi),
          signerOrProvider,
        )
      : VanillaV1Router02__factory.connect(
          getVanillaRouterAddress(VanillaVersion.V1_1),
          signerOrProvider,
        )
  let priceData: TokenPriceResponse | null

  try {
    priceData = await router.tokenPriceData(owner, tokenAddress)
  } catch (e) {
    priceData = null
  }

  return priceData
}

export const getEpoch = async (
  version: VanillaVersion,
  signerOrProvider: Signer | providers.Provider,
): Promise<BigNumber | null> => {
  let epoch: BigNumber | null
  const router =
    version === VanillaVersion.V1_0
      ? new ethers.Contract(
          getVanillaRouterAddress(VanillaVersion.V1_0),
          JSON.stringify(vanillaRouter.abi),
          signerOrProvider,
        )
      : VanillaV1Router02__factory.connect(
          getVanillaRouterAddress(VanillaVersion.V1_1),
          signerOrProvider,
        )

  try {
    epoch = await router.epoch()
  } catch (e) {
    epoch = null
  }

  return epoch
}

export const estimateGas = async (
  version: VanillaVersion,
  trade: TradeV2 | V3Trade,
  signer: Signer,
  provider: providers.Provider,
  operation: Operation,
  token0: Token,
  slippageTolerance: Percent | V2Percent,
): Promise<BigNumber> => {
  const routerV1_0 = new ethers.Contract(
    getVanillaRouterAddress(VanillaVersion.V1_0),
    JSON.stringify(vanillaRouter.abi),
    signer,
  )
  const routerV1_1 = VanillaV1Router02__factory.connect(
    getVanillaRouterAddress(VanillaVersion.V1_1),
    signer,
  )

  let gasEstimate: BigNumber = BigNumber.from('0')
  try {
    if (signer && trade && provider) {
      const block = await provider.getBlock('latest')
      const blockDeadline = block.timestamp + blockDeadlineThreshold
      const gasPrice = await provider.getGasPrice()

      if (version === VanillaVersion.V1_0 && routerV1_0) {
        const normalizedSlippageTolerance = new V2Percent(
          slippageTolerance.numerator,
          slippageTolerance.denominator,
        )
        const normalizedTrade = trade as TradeV2
        if (operation === Operation.Buy) {
          gasEstimate = await routerV1_0.estimateGas.depositAndBuy(
            token0.address,
            normalizedTrade
              ?.minimumAmountOut(normalizedSlippageTolerance)
              .raw.toString(),
            blockDeadline,
            {
              value: normalizedTrade?.inputAmount.raw.toString(),
              gasPrice: gasPrice,
            },
          )
        } else {
          gasEstimate = await routerV1_0.estimateGas.sellAndWithdraw(
            token0.address,
            normalizedTrade?.inputAmount.raw.toString(),
            normalizedTrade
              ?.minimumAmountOut(normalizedSlippageTolerance)
              .raw.toString(),
            blockDeadline,
            {
              gasPrice: gasPrice,
            },
          )
        }
      } else if (version === VanillaVersion.V1_1 && routerV1_1) {
        const normalizedTrade = trade as V3Trade
        const normalizedSlippageTolerance = slippageTolerance as Percent
        if (operation === Operation.Buy) {
          const buyOrder = {
            token: token0.address,
            useWETH: false,
            numEth: normalizedTrade.inputAmount.raw.toString(),
            numToken: normalizedTrade
              .minimumAmountOut(normalizedSlippageTolerance)
              .raw.toString(),
            blockTimeDeadline: blockDeadline,
            fee: 3000,
          }
          gasEstimate = await routerV1_1.estimateGas.executePayable(
            [routerV1_1.interface.encodeFunctionData('buy', [buyOrder])],
            {
              value: normalizedTrade.inputAmount.raw.toString(),
              gasPrice: gasPrice,
            },
          )
        } else {
          const sellOrder = {
            token: token0.address,
            useWETH: false,
            numEth: normalizedTrade
              .minimumAmountOut(normalizedSlippageTolerance)
              .raw.toString(),
            numToken: normalizedTrade.inputAmount.raw.toString(),
            blockTimeDeadline: blockDeadline,
            fee: 3000,
          }
          gasEstimate = await routerV1_1.estimateGas.executePayable(
            [routerV1_1.interface.encodeFunctionData('sell', [sellOrder])],
            { gasPrice: gasPrice },
          )
        }
      }
    }
  } catch (e) {
    console.error('estimateGas', e)
  }
  return gasEstimate
}

export type SnapshotState = {
  blockNumber: number
  timeStamp: number
  conversionDeadline: number
  accounts: { [address: string]: BigNumber }
}

const toSnapshotState = (
  state: SnapshotState,
  event: { blockNumber: number; from: string; to: string; value: BigNumber },
) => {
  let prev = state.accounts[event.to] || BigNumber.from(0)
  state.accounts[event.to] = prev.add(event.value)

  if (event.from !== constants.AddressZero) {
    if (!state.accounts[event.from]) {
      if (event.value.gt(0)) {
        throw new Error(
          `something went wrong in ${event.blockNumber} from=${event.from} value=${event.value}`,
        )
      }
      state.accounts[event.from] = BigNumber.from(0)
    }
    prev = state.accounts[event.from]
    state.accounts[event.from] = prev.sub(event.value)
  }
  state.blockNumber = Math.max(event.blockNumber, state.blockNumber || 0)
  return state
}

export type AddressBalance = {
  address: string
  amount: BigNumber
}

export const toKeccak256Leaf = (balance: AddressBalance): string =>
  utils.solidityKeccak256(
    ['address', 'string', 'uint256'],
    [balance.address, ':', balance.amount],
  )

export const snapshot = async (
  token01: VanillaV1Token01,
  token02: VanillaV1Token02,
): Promise<{
  snapshotState: SnapshotState
  getProof: (balance: AddressBalance) => string[]
  verify: (balance: AddressBalance, root: string) => boolean
  root: string
  merkleTree: MerkleTree
}> => {
  const snapshotBlock = await token02
    .migrationState()
    .then((address) =>
      VanillaV1MigrationState__factory.connect(
        address,
        token02.provider,
      ).blockNumber(),
    )
  const tokenTransfers = snapshotBlock.eq(0)
    ? await token01.queryFilter(token01.filters.Transfer(null, null, null))
    : await token01.queryFilter(
        token01.filters.Transfer(null, null, null),
        0,
        snapshotBlock.toNumber(),
      )
  const byBlockIndexOrder = (a: Event, b: Event) =>
    a.blockNumber - b.blockNumber || a.logIndex - b.logIndex
  const transfers = tokenTransfers
    .sort(byBlockIndexOrder)
    .map(({ blockNumber, args }) => ({ blockNumber, ...args }))

  const snapshotState = transfers.reduce(toSnapshotState, {
    blockNumber: 0,
    accounts: {},
    timeStamp: 0,
    conversionDeadline: 0,
  })

  // fetch the timestamp after event reduction since it's timestamps are not included in the event data
  const blockAtSnapshot = await token01.provider.getBlock(
    snapshotState.blockNumber,
  )
  snapshotState.timeStamp = blockAtSnapshot.timestamp

  const leaves = Object.entries(snapshotState.accounts).map(
    ([address, amount]) => ({
      address,
      amount,
      hash: toKeccak256Leaf({ address, amount }),
    }),
  )
  const merkleTree = new MerkleTree(
    leaves.map((x) => x.hash),
    keccak256,
    { sortPairs: true, hashLeaves: false },
  )
  if (merkleTree.getHexRoot() === '0x' && leaves.length > 0) {
    console.table(leaves)
    throw new Error('Invalid root')
  }
  const root = utils.hexZeroPad(merkleTree.getHexRoot(), 32)
  return {
    snapshotState,
    getProof: (balance: AddressBalance) =>
      merkleTree
        .getHexProof(toKeccak256Leaf(balance))
        .map((hex) => utils.hexZeroPad(hex, 32)),
    verify: (balance: AddressBalance, root: string) => {
      const leaf = toKeccak256Leaf(balance)
      return merkleTree.verify(merkleTree.getHexProof(leaf), leaf, root)
    },
    root,
    merkleTree,
  }
}

export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000 + 2500)).div(BigNumber.from(10000))
}

export async function getUserPositions(
  version: VanillaVersion,
  address: string,
): Promise<Token[]> {
  const checkSummedAddress = isAddress(address)
  const vanillaRouter = getVanillaRouter(version, defaultProvider)
  const million = 1000000
  const tokens = getAllTokens(version)
  const ETHPrice = await getETHPrice(
    version === VanillaVersion.V1_0 ? UniswapVersion.v2 : UniswapVersion.v3,
  )
  let positions: Token[] = []
  if (checkSummedAddress && vanillaRouter) {
    try {
      positions = await Promise.all(
        tokens.map(async (token) => {
          // Fetch price data from Vanilla router
          let tokenSum: BigNumber
          try {
            const priceResponse: TokenPriceResponse =
              await vanillaRouter.tokenPriceData(address, token.address)
            tokenSum = priceResponse.tokenSum
          } catch (e) {
            tokenSum = BigNumber.from('0')
          }

          if (!tokenSum.isZero()) {
            // VNL governance token
            const vnlToken = new UniswapToken(
              tokenListChainId,
              getAddress(getVnlTokenAddress(version)),
              vnlDecimals,
            )

            // Construct helpers for upcoming calculations
            const parsedUniToken = new UniswapToken(
              Number(token.chainId),
              getAddress(token.address),
              Number(token.decimals),
            )

            // Construct token amount from Vanilla router reported amounts
            const tokenAmount = new TokenAmount(
              parsedUniToken,
              tokenSum.toString(),
            )

            // Owned amount. By default, use the total owned amount.
            // If zero, exclude from user's owned tokens
            const parsedOwnedAmount = tokenAmount.greaterThan('0')
              ? tokenAmount.toSignificant()
              : undefined

            // Parse value of owned token in USD
            const parsedValue =
              tokenAmount.greaterThan('0') && token.price
                ? parseFloat(tokenAmount.toSignificant()) *
                  token.price *
                  ETHPrice
                : 0

            // Get current best trade from Uniswap to calculate available rewards
            let trade: TradeV2 | V3Trade | null
            try {
              if (version === VanillaVersion.V1_0) {
                trade = await constructV2Trade(
                  defaultProvider,
                  tokenAmount.toSignificant(),
                  weth,
                  token,
                  TradeType.EXACT_INPUT,
                )
              } else if (version === VanillaVersion.V1_1) {
                trade = await constructV3Trade(
                  defaultProvider,
                  tokenAmount.toSignificant(),
                  weth,
                  token,
                  TradeType.EXACT_INPUT,
                )
              }
            } catch (e) {
              trade = null
            }

            // Amount out from the trade as a Bignumber gwei string and an ether float
            const amountOut = trade?.outputAmount.raw ?? undefined
            const parsedAmountOut =
              amountOut &&
              parseFloat(formatUnits(amountOut.toString(), weth.decimals))

            let reward: RewardResponse | null
            try {
              // Get reward estimate from Vanilla router
              reward = amountOut
                ? await estimateReward(
                    version,
                    address,
                    defaultProvider,
                    token,
                    weth,
                    tokenAmount.toSignificant(),
                    parsedAmountOut?.toString() || '0',
                  )
                : null
            } catch (e) {
              // Catch error from reward estimation. This probably means that the Vanilla router hasn't been deployed on the used network.
              reward = null
            }

            let vpc: string | undefined
            if (reward?.vpc) {
              // Parse VPC
              const vpcNum = reward?.vpc.toNumber() ?? 0
              vpc = (vpcNum / million).toString()
            }

            // Calculate HTRS
            let priceData,
              blockNumber,
              epoch: BigNumber | null = BigNumber.from('0')
            let htrs: string
            try {
              priceData = await getPriceData(
                version,
                address,
                defaultProvider,
                token.address,
              )
              blockNumber = await defaultProvider.getBlockNumber()
              epoch = await getEpoch(version, defaultProvider)
              const avgBlock =
                priceData?.weightedBlockSum.div(priceData?.tokenSum) ??
                BigNumber.from('0')
              const bhold = BigNumber.from(blockNumber.toString()).sub(avgBlock)
              const btrade = epoch
                ? BigNumber.from(blockNumber.toString()).sub(epoch)
                : BigNumber.from('0')
              htrs = (
                bhold
                  .mul(bhold)
                  .mul(million)
                  .div(btrade.mul(btrade))
                  .toNumber() / million
              ).toString()
            } catch (e) {
              htrs = '0'
            }

            // Parse the minimum profitable price from the reward estimate
            let profitablePrice: number | undefined
            let usedEstimate: keyof RewardEstimate
            if (version === VanillaVersion.V1_0 && reward?.profitablePrice) {
              profitablePrice = parseFloat(formatUnits(reward.profitablePrice))
            } else if (version === VanillaVersion.V1_1 && reward?.estimate) {
              switch (Number(token.fee)) {
                case FeeAmount.LOW:
                  usedEstimate = 'low'
                  break
                case FeeAmount.MEDIUM:
                  usedEstimate = 'medium'
                  break
                case FeeAmount.HIGH:
                  usedEstimate = 'high'
                  break
                default:
                  usedEstimate = 'medium'
              }
              profitablePrice = parseFloat(
                formatUnits(reward?.estimate[usedEstimate].profitablePrice),
              )
            }

            // Calculate profit percentage
            const profitPercentage =
              reward && profitablePrice && parsedAmountOut
                ? -(profitablePrice - parsedAmountOut) / profitablePrice
                : 0

            // Parse the available VNL reward
            let parsedVnl = 0
            if (version === VanillaVersion.V1_0 && reward?.reward) {
              parsedVnl = parseFloat(
                new TokenAmount(
                  vnlToken,
                  reward.reward.toString(),
                ).toSignificant(),
              )
            } else if (version === VanillaVersion.V1_1 && reward?.estimate) {
              parsedVnl = parseFloat(
                new TokenAmount(
                  vnlToken,
                  reward.estimate[usedEstimate].reward.toString(),
                ).toSignificant(),
              )
            }

            return {
              ...token,
              owned: parsedOwnedAmount,
              ownedRaw: tokenAmount.raw.toString(),
              value: parsedValue,
              htrs: htrs,
              vpc: vpc,
              profit: profitPercentage,
              vnl: parsedVnl,
            }
          } else {
            return token
          }
        }),
      )
      positions = positions.filter((token) => token.owned)
    } catch (e) {
      console.error(e)
      positions = []
    }
  }
  return positions
}
