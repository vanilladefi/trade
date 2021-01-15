import { motion } from 'framer-motion'
import React from 'react'
import Button from './input/Button'
import NavLink from './NavLink'

const Navigation = (): JSX.Element => (
  <nav>
    <NavLink href='/'>Home</NavLink>
    <NavLink href='/trade'>Trade</NavLink>
    <NavLink href='/users'>Stake</NavLink>
    <div className='connectButton'>
      <Button>Connect Wallet</Button>
    </div>
    <style jsx>{`
      nav {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 6rem 2rem;
        justify-content: flex-start;
        align-items: left;
      }
      .connectButton {
        margin: 2rem 0;
      }
      @media (min-width: 680px) {
        nav {
          display: flex;
          padding: 0;
          flex-direction: row;
          height: 100%;
          justify-content: center;
          align-items: center;
        }
        .connectButton {
          margin: 0;
        }
      }
    `}</style>
  </nav>
)

export default Navigation
