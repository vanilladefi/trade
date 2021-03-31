import React from 'react'
import Fonts from './Fonts'
import Variables from './Variables'

/* type Props = {
  children?: ReactNode
} */

const GlobalStyles = (): JSX.Element => (
  <>
    <Fonts />
    <Variables />
    <style jsx global>{`
      * {
        box-sizing: border-box;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      html {
        font-size: var(--rootfontsize);
      }
      body {
        background: var(--white);
        margin: 0;
        padding: 0;
        position: relative;
        overflow-x: hidden;
      }
      #__next {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        min-height: 100vh;
        overflow-x: hidden;
      }
      h1,
      h2,
      h3,
      h4,
      h5 {
        font-family: var(--titlefont);
        font-weight: var(--titleweight);
      }

      p,
      a,
      ul,
      li,
      span,
      tbody {
        font-family: var(--bodyfont);
        font-weight: var(--bodyweight);
      }
      .tokenComingSoon {
        filter: grayscale(100%);
      }

      a {
        color: var(--link-on-white);
      }

      .content > img {
        max-width: 100%;
      }
      .content h1 {
        font-size: 2.8rem;
        line-height: 1;
      }
      .content > h2 {
        font-size: 1.8rem;
        line-height: 1.1;
        padding-bottom: 1rem;
        border-bottom: 1px solid black;
      }
      .content h3 {
        font-size: 1.8rem;
      }
      .content h4,
      .content h5 {
        font-family: var(--bodyfont);
        text-transform: uppercase;
        font-size: 1.2rem;
      }
      .content a {
        color: var(--link-on-white);
      }

      .icon {
        width: 1rem;
        height: 1rem;
        display: inline-block;
        margin-right: 0.5rem;
      }
      .icon-link {
        background-image: url('/images/icon-link.svg');
        background-size: 24px 24px;
        background-position: center center;
        background-repeat: no-repeat;
        opacity: 0.5;
        transition: opacity 0.3s;
      }
      .icon-link:hover {
        opacity: 1;
      }
    `}</style>
  </>
)

export default GlobalStyles
