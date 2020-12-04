import Link from 'next/link'
import React from 'react'
import { Logo } from './Brand'
import { Column, Row } from './grid/Flex'
import Navigation from './Navigation'
import Wrapper from './Wrapper'

const Footer = (): JSX.Element => (
  <>
    <footer>
      <Wrapper>
        <div className='navBar'>
          <Link href='/'>
            <a>
              <Logo white />
            </a>
          </Link>
          <Navigation />
        </div>
        <Row>
          <Column className='social'></Column>
        </Row>
      </Wrapper>
    </footer>
    <div className='bottomFill' />
    <style jsx>{`
      footer {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: var(--dark);
        color: var(--white);
        width: 100%;
        font-size: 14px;
        padding: var(--boxpadding);
        background-image: url('/images/footer_flower.svg');
        background-repeat: no-repeat;
        background-blend-mode: screen;
        background-position: bottom center;
      }
      div {
        display: flex;
      }
      div.bottomFill {
        width: 100%;
        flex-grow: 1;
        background: var(--dark);
      }
      .navBar {
        width: 100%;
        justify-content: space-between;
        align-items: center;
        color: var(--white);
        --inactivelink: var(--white);
        --activelink: var(--white);
      }
    `}</style>
  </>
)

export default Footer
