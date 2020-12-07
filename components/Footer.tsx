import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Logo } from './Brand'
import { Alignment, Column, Justification, Row } from './grid/Flex'
import Navigation from './Navigation'
import Wrapper from './Wrapper'

const LawLinks = (): JSX.Element => (
  <ul>
    <li>
      <Link href='/terms'>
        <a>Terms of Use</a>
      </Link>
    </li>
    <li>
      <Link href='/privacy'>
        <a>Privacy Policy</a>
      </Link>
    </li>
    <li>
      <Link href='/cookies'>
        <a>Cookie Policy</a>
      </Link>
    </li>
    <style jsx>{`
      ul,
      li {
        list-style: none;
        margin: 0;
        padding: 0;
        text-indent: 0;
      }
      li {
        font-family: var(--bodyfont);
        font-size: var(--minisize);
        line-height: 40px;
        text-align: right;
      }
      a {
        text-decoration: none;
        color: var(--white);
      }
    `}</style>
  </ul>
)

const SoMeLinks = (): JSX.Element => (
  <ul>
    <li>
      <div>
        <Image
          src='/images/telegram.svg'
          layout='fixed'
          width='30px'
          height='30px'
        />
      </div>
      Telegram
    </li>
    <li>
      <div>
        <Image
          src='/images/twitter.svg'
          layout='fixed'
          width='30px'
          height='30px'
        />
      </div>
      Twitter
    </li>
    <li>
      <div>
        <Image
          src='/images/github.svg'
          layout='fixed'
          width='30px'
          height='30px'
        />
      </div>
      GitHub
    </li>
    <li>
      <div>
        <Image
          src='/images/discord.svg'
          layout='fixed'
          width='30px'
          height='30px'
        />
      </div>
      Discord
    </li>
    <style jsx>{`
      ul,
      li {
        list-style: none;
        margin: 0;
        text-indent: 0;
        padding: 0;
      }
      li {
        font-family: var(--bodyfont);
        font-size: var(--minisize);
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 18px;
      }
      li > div {
        margin-right: 18px;
      }
    `}</style>
  </ul>
)

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
        <Row
          justifyContent={Justification.SPACE_BETWEEN}
          alignItems={Alignment.STRETCH}
        >
          <Column className='social'>
            <SoMeLinks />
          </Column>
          <Column
            className='law'
            justifyContent={Justification.SPACE_BETWEEN}
            alignItems={Alignment.END}
          >
            <LawLinks />
            <span>Copyright © 2020 Vanilla</span>
          </Column>
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
        font-size: var(--minisize);
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
        margin-bottom: 38px;
        color: var(--white);
        --inactivelink: var(--white);
        --activelink: var(--white);
      }
    `}</style>
  </>
)

export default Footer
