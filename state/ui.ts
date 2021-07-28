import { atom } from 'recoil'

export const modalCloseEnabledState = atom<boolean>({
  key: 'modalCloseEnabledState',
  default: true,
})
