import { providers } from 'ethers'

export const chainId: number =
  (process.env.NEXT_PUBLIC_CHAIN_ID &&
    parseInt(process.env.NEXT_PUBLIC_CHAIN_ID)) ||
  1

export const vanillaRouterAddress: string =
  process.env.NEXT_PUBLIC_VANILLA_ROUTER_ADDRESS ||
  '0x5FbDB2315678afecb367f032d93F642f64180aa3'

export const rpcUrl: string =
  process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545'

export const defaultProvider = new providers.JsonRpcProvider(rpcUrl, chainId)
