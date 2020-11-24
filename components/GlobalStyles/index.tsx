import React, { ReactNode } from 'react'
import Fonts from './Fonts'
import MediaQueries from './MediaQueries'
import Variables from './Variables'

type Props = {
  children?: ReactNode
}

const GlobalStyles = () => (
  <>
    <Fonts />
    <Variables />
    <MediaQueries />
    <style global>{`
      * {
        box-sizing: border-box;
      }
      body {
        background: var(--white);
        margin: 0;
        padding: 0;
      }
      #__next {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
      }
      h1, h2, h3, h4, h5 {
        font-family: var(--titlefont);
        font-weight: var(--titleweight);
      }
      p, a, span, tbody {
        font-family: var(--bodyfont);
        font-weight: var(--bodyweight);
      }
    `}</style>
  </>
)

export default GlobalStyles
