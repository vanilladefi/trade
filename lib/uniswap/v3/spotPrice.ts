import { Fraction, Token } from '@uniswap/sdk-core'
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { Pool } from '@uniswap/v3-sdk'
import { Contract, ethers, providers } from 'ethers'

interface State {
  liquidity: ethers.BigNumber
  sqrtPriceX96: ethers.BigNumber
  tick: number
  observationIndex: number
  observationCardinality: number
  observationCardinalityNext: number
  feeProtocol: number
  unlocked: boolean
}

type PriceGetter = (
  poolAddress: string,
  token0: Token,
  token1: Token,
  provider?: providers.Provider,
) => Promise<[Fraction, Fraction]>

/**
 * $VNL pools on Uniswap with the most liquidity
 */
export const vnlPools = {
  ETH: '0xff6949065aebb4be59d30c970694a7495da0c0ff',
  USDC: '0x0aa719a08957bdf43d9c9f0b755edd1ca2b386f3',
}

/**
 * Fetches the Uniswap v3 pool state for given pool contract
 *
 * @param poolContract - A Uniswap v3 liquidity pool instance
 * @returns pool state with lots of info about pricing and the oracle
 */
const getPoolState = async (poolContract: Contract) => {
  const slot = await poolContract.slot0()
  const PoolState: State = {
    liquidity: await poolContract.liquidity(),
    sqrtPriceX96: slot[0],
    tick: slot[1],
    observationIndex: slot[2],
    observationCardinality: slot[3],
    observationCardinalityNext: slot[4],
    feeProtocol: slot[5],
    unlocked: slot[6],
  }
  return PoolState
}

/**
 * Gets the on-chain price for given token pair
 * from a Uniswap v3 liquidity pool
 *
 * @param poolAddress - the Uniswap v3 liquidity pool address
 * @param token0 - the first token of the token pair in Uniswap's Token format
 * @param token1 - the second token of the pair in Uniswap's token format
 * @param provider - an ethersjs provider (readonly)
 * @returns a list with both prices of the pair (token0/token1 & token1/token0)
 */
export const getSpotPrice: PriceGetter = async (
  poolAddress: string,
  token0: Token,
  token1: Token,
  provider?: providers.Provider,
) => {
  const poolContract = new ethers.Contract(
    poolAddress,
    IUniswapV3PoolABI,
    provider || providers.getDefaultProvider(),
  )
  const state = await getPoolState(poolContract)
  const fee = await poolContract.fee()

  const pool = new Pool(
    token0 as any,
    token1 as any,
    fee,
    state.sqrtPriceX96.toString(),
    state.liquidity.toString(),
    state.tick,
  )

  return [pool.token0Price, pool.token1Price]
}
