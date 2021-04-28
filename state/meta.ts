import { atom } from 'recoil'
import { epoch } from 'utils/config'

export const currentBlockNumberState = atom<number>({
  key: 'currentBlockNumberState',
  default: epoch,
})

export const currentETHPrice = atom<number>({
  key: 'currentETHPrice',
  default: 0,
})
