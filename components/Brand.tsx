import Image from 'next/image'
import React from 'react'

type Props = {
  white?: boolean
}

export const Logo = ({ white }: Props): JSX.Element => (
  <Image
    src={`${
      white ? '/images/logo-vanilla-white.svg' : '/images/logo-vanilla.svg'
    }`}
    alt='Vanilla logo'
    width='120px'
    height='28px'
    layout='fixed'
    priority
  />
)
