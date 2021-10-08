import { providers } from 'ethers'
import { UniswapVersion, VanillaVersion } from 'types/general'

export const useWebsocketRpc: boolean =
  process.env.NEXT_PUBLIC_USE_WEBSOCKETS === 'true'

export const chainId: number =
  (process.env.NEXT_PUBLIC_CHAIN_ID &&
    parseInt(process.env.NEXT_PUBLIC_CHAIN_ID)) ||
  1

export const network: providers.Networkish = providers.getNetwork(chainId)

export const apiKey: string | boolean =
  process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || false

export const ssrApiKey: string | boolean = process.env.SSR_API_KEY || false

export const protocolPrefix: string = useWebsocketRpc ? 'wss://' : 'https://'

export const rpcUrl: string =
  (ssrApiKey && `https://eth-mainnet.alchemyapi.io/v2/${ssrApiKey}`) ||
  (apiKey && `https://eth-mainnet.alchemyapi.io/v2/${apiKey}`) ||
  'http://hardhat:8545'

export const defaultProvider =
  useWebsocketRpc && apiKey && !ssrApiKey
    ? new providers.AlchemyWebSocketProvider(network, apiKey)
    : useWebsocketRpc && !ssrApiKey && !apiKey
    ? new providers.WebSocketProvider('ws://hardhat:8545', network)
    : !ssrApiKey && apiKey
    ? new providers.AlchemyProvider(network, apiKey)
    : new providers.JsonRpcProvider(rpcUrl, network)
// TODO: Check if this works in the future: new providers.JsonRpcBatchProvider(rpcUrl, network)

export const blockDeadlineThreshold = 60000 // 600 seconds added to the latest block timestamp (10 minutes)

export const conservativeGasLimit = 800_000
export const conservativeMigrationGasLimit = 120_000
export const ethersOverrides = { gasLimit: conservativeGasLimit }

export const epoch = Number(process.env.NEXT_PUBLIC_EPOCH) || 0

export const hiddenTokens = ['0xd46ba6d942050d489dbd938a2c909a5d5039a161']

export const getVanillaRouterAddress = (version: VanillaVersion): string =>
  version === VanillaVersion.V1_0
    ? process.env.NEXT_PUBLIC_VANILLA_ROUTER_V1_0_ADDRESS ||
      '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    : version === VanillaVersion.V1_1
    ? process.env.NEXT_PUBLIC_VANILLA_ROUTER_V1_1_ADDRESS ||
      '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    : '0x5FbDB2315678afecb367f032d93F642f64180aa3'

export const getVnlTokenAddress = (version: VanillaVersion): string =>
  version === VanillaVersion.V1_0
    ? process.env.NEXT_PUBLIC_VNL_TOKEN_V1_0_ADDRESS || ''
    : version === VanillaVersion.V1_1
    ? process.env.NEXT_PUBLIC_VNL_TOKEN_V1_1_ADDRESS || ''
    : ''

export const getUniswapRouterAddress = (version: UniswapVersion): string =>
  version === UniswapVersion.v2
    ? process.env.NEXT_PUBLIC_UNISWAP_V2_ROUTER_ADDRESS
    : process.env.NEXT_PUBLIC_UNISWAP_V3_ROUTER_ADDRESS

export const getUniswapQuoterAddress = (): string =>
  process.env.NEXT_PUBLIC_UNISWAP_V3_QUOTER_ADDRESS

export const vnlDecimals = 12
