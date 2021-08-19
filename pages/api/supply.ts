import { ethers } from 'ethers'
import type { NextApiRequest, NextApiResponse } from 'next'
import { VanillaVersion } from 'types/general'
import { ERC20 } from 'types/typechain/vanilla_v1.1/ERC20'
import { ERC20__factory } from 'types/typechain/vanilla_v1.1/factories/ERC20__factory'
import { getVnlTokenAddress } from 'utils/config'

export default async (
  _req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const provider = ethers.getDefaultProvider()
  const vnl: ERC20 = ERC20__factory.connect(
    getVnlTokenAddress(VanillaVersion.V1_1),
    provider,
  )
  const totalSupply = await vnl.totalSupply()
  res.status(200).json(totalSupply)
}
