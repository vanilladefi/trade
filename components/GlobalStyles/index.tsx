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
      span,
      tbody {
        font-family: var(--bodyfont);
        font-weight: var(--bodyweight);
      }
      .tokenComingSoon {
        filter: grayscale(100%);
      }
    `}</style>
  </>
)

export default GlobalStyles
