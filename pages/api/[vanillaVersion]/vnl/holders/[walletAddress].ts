import { getVanillaTokenContract } from 'lib/vanilla/contracts'
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

  const contract = getVanillaTokenContract(vnlVersion, defaultProvider)

  const balance = contract.functions.balanceOf(walletAddress)

  res.status(200).json(balance)
}
