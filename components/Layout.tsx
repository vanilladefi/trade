import React, { ReactNode } from 'react'
import Head from 'next/head'
import Navigation from './Navigation'

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'Vanilla' }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <Navigation />
    </header>
    {children}
    <footer>
      <hr />
      <span>I'm here to stay (Footer)</span>
    </footer>
    <style global>{`
      @font-face {
        font-family: 'Darker Grotesque';
        src: url('fonts/Darker_Grotesque/DarkerGrotesque-Bold.ttf') format('truetype');
        font-weight: 700;
        font-style: normal;
      }
      @font-face {
        font-family: 'Fira Code';
        src: url('fonts/Fira_Code/static/FiraCode-Regular.ttf') format('truetype');
        font-weight: 400;
        font-style: monospace;
      }
      @font-face {
        font-family: 'Inter';
        src: url('fonts/Inter/static/Inter-Regular-slnt=0.ttf') format('truetype');
        font-weight: 400;
        font-style: normal;
      }
      @font-face {
        font-family: 'Inter';
        src: url('fonts/Inter/static/Inter-Medium-slnt=0.ttf') format('truetype');
        font-weight: 500;
        font-style: normal;
      }
      @font-face {
        font-family: 'Inter';
        src: url('fonts/Inter/static/Inter-SemiBold-slnt=0.ttf') format('truetype');
        font-weight: 600;
        font-style: normal;
      }
      :root {
        /* Colors */
        --white: #FFFFFF;
        --dark: #2C1929;
        --yellow: #D5EBF4;
        --beige: #F3F1EA;
        
        /* Gradients */
        --topgradient: background: radial-gradient(78.72% 122.74% at 91.23% 0%, #FFEEC2 0%, #F4F4F0 100%);
        --midgradient: background: radial-gradient(107.22% 272.74% at 100% -2.86%, rgba(251, 241, 215, 0.96) 0%, #F8F7F3 100%);
        --bottomgradient: background: radial-gradient(107.22% 272.74% at 100% -2.86%, rgba(251, 241, 215, 0.96) 0%, #F8F7F3 100%);
        --buttongradient: background: linear-gradient(272.09deg, #FFD866 4.89%, #FFC684 95.55%);
        
        /* Spacing */
        --outermargin: 44px;
        --layoutmargin: 40px;

        /* Fonts */
        --titlefont: 'Darker Grotesque', sans-serif;
        --titleweight: 700;
        --monofont: 'Fira Code', monospace;
        --monoweight: 400;
        --bodyfont: 'Inter', sans-serif;
        --bodyweight: 400;
        --theadweight: 500;
        --buttonweight: 600;
      }
      body {
        background: var(--white);
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
    <style jsx>{`
      header {
        margin-top: var(--outermargin);
      }
    `}</style>
  </div>
)

export default Layout
