import { atom } from 'recoil'

export const currentBlockNumberState = atom<number>({
  key: 'currentBlockNumberState',
  default: 0,
})

export const currentETHPrice = atom<number>({
  key: 'currentETHPrice',
  default: 0,
})
