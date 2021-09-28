import { UniswapVersion } from 'types/general'

export const getUniswapRouterAddress = (version: UniswapVersion): string =>
  version === UniswapVersion.v2
    ? process.env.NEXT_PUBLIC_UNISWAP_V2_ROUTER_ADDRESS
    : process.env.NEXT_PUBLIC_UNISWAP_V3_ROUTER_ADDRESS

export const getUniswapQuoterAddress = (): string =>
  process.env.NEXT_PUBLIC_UNISWAP_V3_QUOTER_ADDRESS
