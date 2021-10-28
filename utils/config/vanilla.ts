import { VanillaVersion } from 'types/general'

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

export const vnlDecimals = 12
