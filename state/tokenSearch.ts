import { atom } from 'recoil'

export const tokenSearchQuery = atom({
  key: 'tokenSearchQuery', // unique ID (with respect to other atoms/selectors)
  default: '', // default value (aka initial value)
})
