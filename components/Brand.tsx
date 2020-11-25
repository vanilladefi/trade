import React from 'react'
import Image from 'next/image'

export const Logo = (): JSX.Element => (
  <Image
    src='/images/logo-vanilla.svg'
    alt='Vanilla logo'
    width='120px'
    height='28px'
    layout='fixed'
    priority
  />
)
