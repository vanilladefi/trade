import React from 'react'
import NavLink from './NavLink'

const Navigation = () => <nav>
  <NavLink href="/" >
    Home
  </NavLink>
  <NavLink href="/about">
    Trade
  </NavLink>
  <NavLink href="/users">
    Stake
  </NavLink>
  <style jsx>{`
    nav {
      display: flex;
      flex-direction: row;
      height: 100%;
      justify-content: center;
    }
  `}</style>
</nav>


export default Navigation
