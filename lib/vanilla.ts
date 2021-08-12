import { Percent as V2Percent, Trade as TradeV2 } from '@uniswap/sdk'
import { Percent } from '@uniswap/sdk-core'
import {
  BigNumber,
  constants,
  ethers,
  Event,
  providers,
  Signer,
  utils,
} from 'ethers'
import keccak256 from 'keccak256'
import { tryParseAmount } from 'lib/uniswap/v2/trade'
import { MerkleTree } from 'merkletreejs'
import vanillaRouter from 'types/abis/vanillaRouter.json'
import { VanillaVersion } from 'types/general'
import { Operation, UniSwapToken, V3Trade } from 'types/trade'
import {
  VanillaV1MigrationState__factory,
  VanillaV1Router02__factory,
  VanillaV1Token01,
  VanillaV1Token02,
} from 'types/typechain/vanilla_v1.1'
import { blockDeadlineThreshold, getVanillaRouterAddress } from 'utils/config'

export interface TokenPriceResponse {
  ethSum: BigNumber
  latestBlock: BigNumber
  tokenSum: BigNumber
  weightedBlockSum: BigNumber
}

export interface RewardResponse {
  profitablePrice: BigNumber
  avgBlock: BigNumber
  htrs: BigNumber
  vpc: BigNumber
  reward: BigNumber
}

export const estimateReward = async (
  version: VanillaVersion,
  signer: Signer,
  tokenSold: UniSwapToken,
  tokenReceived: UniSwapToken,
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
    parsedAmountSold.greaterThan('0')
  ) {
    const owner = await signer.getAddress()
    const routerV1_0 = new ethers.Contract(
      getVanillaRouterAddress(VanillaVersion.V1_0),
      JSON.stringify(vanillaRouter.abi),
      signer,
    )
    const routerV1_1 = VanillaV1Router02__factory.connect(
      getVanillaRouterAddress(VanillaVersion.V1_1),
      signer,
    )

    try {
      reward =
        version === VanillaVersion.V1_0
          ? await routerV1_0.estimateReward(
              owner,
              tokenSold.address,
              parsedAmountReceived?.raw.toString(),
              parsedAmountSold?.raw.toString(),
            )
          : await routerV1_1.estimateReward(
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
  signer: Signer,
  tokenAddress: string,
): Promise<TokenPriceResponse | null> => {
  const owner = await signer.getAddress()
  const router = new ethers.Contract(
    getVanillaRouterAddress(version),
    JSON.stringify(vanillaRouter.abi),
    signer,
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
  signer: Signer,
): Promise<BigNumber | null> => {
  const router = new ethers.Contract(
    getVanillaRouterAddress(version),
    JSON.stringify(vanillaRouter.abi),
    signer,
  )
  let epoch: BigNumber | null

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
  token0: UniSwapToken,
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
