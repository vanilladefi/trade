import { atom } from 'recoil'

export const currentBlockNumberState = atom<number>({
  key: 'currentBlockNumberState',
  default: 0,
})
