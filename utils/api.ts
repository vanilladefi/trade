import { NextApiRequest } from 'next'
import { VanillaVersion } from 'types/general'

export const parseVanillaVersionFromRequest = (
  req: NextApiRequest,
): VanillaVersion => {
  const { vanillaVersion } = req.query
  let response: VanillaVersion
  switch (vanillaVersion) {
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
