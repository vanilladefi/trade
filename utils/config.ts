import { providers } from 'ethers'

export const useWebsocketRpc: boolean =
  process.env.NEXT_PUBLIC_USE_WEBSOCKETS === 'true'

export const chainId: number =
  (process.env.NEXT_PUBLIC_CHAIN_ID &&
    parseInt(process.env.NEXT_PUBLIC_CHAIN_ID)) ||
  1

export const vanillaRouterAddress: string =
  process.env.NEXT_PUBLIC_VANILLA_ROUTER_ADDRESS ||
  '0x5FbDB2315678afecb367f032d93F642f64180aa3'

export const apiKey: string | boolean =
  process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || false

export const ssrApiKey: string | boolean = process.env.SSR_API_KEY || false

export const rpcUrl: string =
  (ssrApiKey && `https://eth-mainnet.alchemyapi.io/v2/${ssrApiKey}`) ||
  (apiKey && `https://eth-mainnet.alchemyapi.io/v2/${apiKey}`) ||
  'http://localhost:8545'

export const defaultProvider =
  useWebsocketRpc && apiKey
    ? new providers.AlchemyWebSocketProvider(1, apiKey)
    : useWebsocketRpc
    ? new providers.WebSocketProvider('ws://localhost:8545', 1)
    : new providers.JsonRpcProvider(rpcUrl, 1)

export const blockDeadlineThreshold = 600 // 600 seconds added to the latest block timestamp (10 minutes)

export const ethersOverrides = { gasLimit: 400000 }

export const epoch = Number(process.env.NEXT_PUBLIC_EPOCH) || 0
