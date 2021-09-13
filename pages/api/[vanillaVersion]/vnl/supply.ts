import { formatUnits } from 'ethers/lib/utils'
import type { NextApiRequest, NextApiResponse } from 'next'
import { VanillaVersion } from 'types/general'
import { ERC20 } from 'types/typechain/vanilla_v1.1/ERC20'
import { ERC20__factory } from 'types/typechain/vanilla_v1.1/factories/ERC20__factory'
import { defaultProvider, getVnlTokenAddress, vnlDecimals } from 'utils/config'

export default async (
  _req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const vnl: ERC20 = ERC20__factory.connect(
    getVnlTokenAddress(VanillaVersion.V1_1),
    defaultProvider,
  )
  const totalSupply = await vnl.totalSupply()
  const formattedSupply = formatUnits(totalSupply, vnlDecimals)
  res.status(200).json(formattedSupply)
}
