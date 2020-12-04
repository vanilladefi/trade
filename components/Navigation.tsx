import React from 'react'
import Button from './input/Button'
import NavLink from './NavLink'

const Navigation = (): JSX.Element => (
  <nav>
    <NavLink href='/'>Home</NavLink>
    <NavLink href='/trade'>Trade</NavLink>
    <NavLink href='/users'>Stake</NavLink>
    <Button>Connect Wallet</Button>
    <style jsx>{`
      nav {
        display: flex;
        flex-direction: row;
        height: 100%;
        justify-content: center;
        align-items: center;
      }
    `}</style>
  </nav>
)

export default Navigation
