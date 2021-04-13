import React from 'react'
import Fonts from './Fonts'
import Variables from './Variables'
import Katex from './Katex'

/* type Props = {
  children?: ReactNode
} */

const GlobalStyles = (): JSX.Element => (
  <>
    <Fonts />
    <Variables />
    <Katex />
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
        margin: 2.5rem 0 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.25);
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
        width: 1.1rem;
        height: 1.1rem;
        min-width: 16px;
        min-height: 16px;
        display: inline-block;
        margin-right: 0.5rem;
      }
      .icon-link {
        background-image: url('/images/icon-link.svg');
        background-size: 100%;
        background-position: center center;
        background-repeat: no-repeat;
        opacity: 0.5;
        transition: opacity 0.3s;
      }
      .icon-link:hover,
      .icon-link:active {
        opacity: 1;
      }

      .animate-flower-svg path {
        stroke-dasharray: 400;
        stroke-dashoffset: 400;
        animation: dash 2s cubic-bezier(0.85, 0, 0.15, 1) forwards;
      }

      .animated-profitcurve-flower path {
        stroke-dasharray: 400;
        stroke-dashoffset: 400;
        animation: dash 2s cubic-bezier(0.85, 0, 0.15, 1) forwards;
      }

      @keyframes dash {
        to {
          stroke-dashoffset: 0;
        }
      }
    `}</style>
  </>
)

export default GlobalStyles
