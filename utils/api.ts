import { isAddress } from '@vanilladefi/sdk'
import { ParsedUrlQuery } from 'querystring'
import { VanillaVersion } from 'types/general'

export const parseVanillaVersionFromQuery = (
  params: ParsedUrlQuery,
): VanillaVersion => {
  let response: VanillaVersion
  switch (params.vanillaVersion) {
    case 'v1.0': {
      response = VanillaVersion.V1_0
      break
    }
    case 'v1.1': {
      response = VanillaVersion.V1_1
      break
    }
    default: {
      response = VanillaVersion.V1_1
    }
  }
  return response
}

export const parseWalletAddressFromQuery = (
  params: ParsedUrlQuery,
): string | false => {
  const walletAddress =
    typeof params?.walletAddress === 'string'
      ? isAddress(params?.walletAddress)
        ? isAddress(params?.walletAddress)
        : false
      : isAddress(params?.walletAddress[0])
      ? isAddress(params?.walletAddress[0])
      : false
  return walletAddress
}
