import { getVanillaTokenContract } from '@vanilladefi/sdk'
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  parseVanillaVersionFromQuery,
  parseWalletAddressFromQuery,
} from 'utils/api'
import { defaultProvider } from 'utils/config'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const vnlVersion = parseVanillaVersionFromQuery(req.query)
  const walletAddress = parseWalletAddressFromQuery(req.query)

  if (walletAddress) {
    const contract = getVanillaTokenContract(vnlVersion, defaultProvider)

    const balance = contract.balanceOf(walletAddress)

    res.status(200).json(balance)
  } else {
    res.status(404).json('No wallet found with given address.')
  }
}
