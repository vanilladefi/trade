import { Percent } from '@uniswap/sdk-core'
import { Trade as TradeV2 } from '@uniswap/v2-sdk'
import { Trade as TradeV3 } from '@uniswap/v3-sdk'
import {
  BigNumber,
  constants,
  ethers,
  Event,
  providers,
  Signer,
  utils,
} from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import keccak256 from 'keccak256'
import { tryParseAmount } from 'lib/uniswap/v2/trade'
import { MerkleTree } from 'merkletreejs'
import vanillaRouter from 'types/abis/vanillaRouter.json'
import { VanillaV1Token01 } from 'types/abis/VanillaV1Token01'
import { VanillaVersion } from 'types/general'
import { Operation, UniSwapToken } from 'types/trade'
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

  const owner = await signer.getAddress()
  const router = new ethers.Contract(
    getVanillaRouterAddress(version),
    JSON.stringify(vanillaRouter.abi),
    signer,
  )
  let reward: RewardResponse | null

  try {
    reward = await router.estimateReward(
      owner,
      tokenSold.address,
      parsedAmountReceived?.raw.toString(),
      parsedAmountSold?.raw.toString(),
    )
  } catch (e) {
    reward = null
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
  trade: TradeV2 | TradeV3,
  provider: providers.Provider,
  operation: Operation,
  token0: UniSwapToken,
  slippageTolerance: Percent,
): Promise<string> => {
  const router = new ethers.Contract(
    getVanillaRouterAddress(version),
    JSON.stringify(vanillaRouter.abi),
    provider,
  )
  let gasEstimate = '0'
  try {
    if (provider && router && trade) {
      const block = await provider.getBlock('latest')
      const blockDeadline = block.timestamp + blockDeadlineThreshold
      if (operation === Operation.Buy) {
        gasEstimate = await router.estimateGas
          .depositAndBuy(
            token0.address,
            trade?.minimumAmountOut(slippageTolerance).raw.toString(),
            blockDeadline,
            {
              value: trade?.inputAmount.raw.toString(),
            },
          )
          .then(async (value) => {
            const price = await provider.getGasPrice()
            return formatUnits(value.mul(price))
          })
      } else {
        gasEstimate = await router.estimateGas
          .sellAndWithdraw(
            token0.address,
            trade?.inputAmount.raw.toString(),
            trade?.minimumAmountOut(slippageTolerance).raw.toString(),
            blockDeadline,
          )
          .then(async (value) => {
            const price = await provider.getGasPrice()
            return formatUnits(value.mul(price))
          })
      }
    }
  } catch (e) {
    console.error(e)
  }
  return gasEstimate
}

export type SnapshotState = {
  blockNumber: number
  timeStamp: number
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

export const toKeccak256Leaf = (balance: AddressBalance) =>
  utils.solidityKeccak256(
    ['address', 'string', 'uint256'],
    [balance.address, ':', balance.amount],
  )

export const snapshot = async (
  vanilla: VanillaV1Token01,
  signer: Signer,
  snapshotBlock?: number,
) => {
  vanilla.connect(signer)
  const tokenTransfers = snapshotBlock
    ? await vanilla.queryFilter(
        vanilla.filters.Transfer(null, null, null),
        0,
        snapshotBlock,
      )
    : await vanilla.queryFilter(vanilla.filters.Transfer(null, null, null))
  const byBlockIndexOrder = (a: Event, b: Event) =>
    a.blockNumber - b.blockNumber || a.logIndex - b.logIndex
  const transfers = tokenTransfers
    .sort(byBlockIndexOrder)
    .map(({ blockNumber, args }) => ({ blockNumber, ...args }))

  const snapshotState = transfers.reduce(toSnapshotState, {
    blockNumber: 0,
    accounts: {},
    timeStamp: 0,
  })

  // fetch the timestamp after event reduction since it's timestamps are not included in the event data
  snapshotState.timeStamp = (
    await vanilla.provider.getBlock(snapshotState.blockNumber)
  ).timestamp

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
