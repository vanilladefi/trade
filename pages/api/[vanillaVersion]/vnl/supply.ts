import { getVanillaTokenContract } from '@vanilladefi/sdk/contracts'
import { formatUnits } from 'ethers/lib/utils'
import type { NextApiRequest, NextApiResponse } from 'next'
import { parseVanillaVersionFromQuery } from 'utils/api'
import { defaultProvider } from 'utils/config'
import { vnlDecimals } from 'utils/config/vanilla'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const vnlVersion = parseVanillaVersionFromQuery(req.query)
  const contract = getVanillaTokenContract(vnlVersion, defaultProvider)
  const totalSupply = await contract.totalSupply()
  const formattedSupply = formatUnits(totalSupply, vnlDecimals)
  res.status(200).json(formattedSupply)
}
