import { atom } from 'recoil'
import { ConversionState } from 'types/migration'

export const tokenConversionState = atom<ConversionState>({
  key: 'tokenConversionState',
  default: ConversionState.HIDDEN,
})
