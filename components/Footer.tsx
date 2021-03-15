import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Logo } from './Brand'
import { DesktopNavigation } from './Navigation'
import Wrapper from './Wrapper'
import { BreakPoint } from './GlobalStyles/Breakpoints'

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
      @media (max-width: ${BreakPoint.xs}px) {
        li {
          text-align: left;
        }
      }
    `}</style>
  </ul>
)

const SoMeLinks = (): JSX.Element => (
  <ul>
    <li>
      <a
        href='https://t.me/vanilladefi'
        target='_blank'
        rel='noopener noreferrer'
      >
        <div>
          <Image
            src='/images/telegram.svg'
            layout='fixed'
            width='30px'
            height='30px'
          />
        </div>
        Telegram
      </a>
    </li>
    <li>
      <a
        href='https://www.twitter.com/vanilladefi'
        target='_blank'
        rel='noopener noreferrer'
      >
        <div>
          <Image
            src='/images/twitter.svg'
            layout='fixed'
            width='30px'
            height='30px'
          />
        </div>
        Twitter
      </a>
    </li>
    <li>
      <a
        href='https://www.github.com/vanilladefi'
        target='_blank'
        rel='noopener noreferrer'
      >
        <div>
          <Image
            src='/images/github.svg'
            layout='fixed'
            width='30px'
            height='30px'
          />
        </div>
        GitHub
      </a>
    </li>
    <style jsx>{`
      ul,
      li {
        list-style: none;
        margin: 0;
        text-indent: 0;
        padding: 0;
      }
      li a {
        font-family: var(--bodyfont);
        font-size: var(--minisize);
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 18px;
        color: var(--white);
        text-decoration: none;
      }
      li a > div {
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
            <a className='logo'>
              <Logo white />
            </a>
          </Link>
          <div className='desktopNav'>
            <DesktopNavigation />
          </div>
        </div>
        <div className='extra'>
          <div className='social'>
            <SoMeLinks />
          </div>
          <div className='law'>
            <LawLinks />
            <span className='copyright'>
              Copyright © {new Date().getFullYear()} Vanilla
            </span>
          </div>
        </div>
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
        padding: 2.3rem 1rem 4rem;
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
      .logo {
        margin-right: 2rem;
      }
      div.desktopNav {
        display: none;
      }
      .extra {
        flex-direction: row;
        justify-content: space-between;
      }
      .law {
        flex-direction: column;
        justify-content: space-between;
      }
      .copyright {
        margin-top: 3rem;
      }
      @media (min-width: ${BreakPoint.mobileNav}px) {
        div.desktopNav {
          display: block;
        }
        footer {
          padding: 2.3rem 2.8rem 4rem;
        }
      }
      @media (max-width: ${BreakPoint.xs}px) {
        .extra {
          flex-direction: column;
          justify-content: flex-start;
        }
        .law {
          margin-top: 2rem;
        }
        .copyright {
          text-align: center;
        }
      }
    `}</style>
  </>
)

export default Footer
