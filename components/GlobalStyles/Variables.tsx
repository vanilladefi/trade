import React from 'react'
import { BreakPoint } from './Breakpoints'

const Variables = (): JSX.Element => (
  <style jsx global>{`
    :root {
      /* Colors */
      --white: #ffffff;
      --dark: #2c1929;
      --yellow: #fbf3db;
      --beige: #f3f1ea;
      --inactivelink: #62555f;
      --activelink: var(--dark);
      --curtain-background: rgba(44, 21, 45, 0.83);
      --curtain-backdropfilter: blur(40px);
      --roadmapcolor: #ffd866;
      --link-on-white: #be6700;
      --bordercolor: var(--dark);

      /* Gradients */
      --topgradient: radial-gradient(
        78.72% 122.74% at 91.23% 0%,
        #ffeec2 0%,
        #f4f4f0 100%
      );
      --boxgradient: radial-gradient(
        107.22% 272.74% at 100% -2.86%,
        rgba(251, 241, 215, 0.96) 0%,
        #f8f7f3 100%
      );
      --buttongradient: linear-gradient(
        272.09deg,
        #ffd866 4.89%,
        #ffc684 95.55%
      );
      --tradeflowergradient: linear-gradient(
        326deg,
        #ffedab 8.09%,
        #ededed 89.18%
      );
      --toggleWrapperGradient: radial-gradient(
        59.84% 223.83% at 50% 50%,
        #ffedab 0%,
        #ededed 100%
      );

      /* Dimensions */
      --maxlayoutwidth: 1280px;
      --iconsize: 1rem;

      /* Border radiuses */
      --tradeflowerborderradius: 9px;

      /* Spacing */
      --outermargin: 1rem;
      --layoutmargin: 1rem;
      --boxpadding: 2rem;
      --boxpadding-md: 3rem;
      --boxpadding-lg: 4rem;
      --boxpadding-xl: 5rem;
      --tablepadding: 0.6rem 1rem;

      --headerpadding: var(--outermargin);

      --smallbuttonpadding: 0.8rem 1rem 0.95rem;
      --buttonpadding: 1rem 1.4rem 1.15rem;
      --buttonmargin: 0;
      --largebuttonpadding: 1.3rem 1.5rem 1.4rem;

      --modalpadding: 0.5rem 1rem;
      --tradeflowerpadding: 18px 23px;

      --titlemargin: 0;
      --hugemonomargin: 0 0 1.8rem 0;
      --subpage-titlemargin: 56px 0 1.5rem 0;
      --box-titlemargin: 0 0 32px 0;
      --box-hugemonomargin: 0 0 20px 0;
      --subpage-buttonmargin: 0 0 76px 0;

      /* Fonts */
      --rootfontsize: 12px;
      --rootfontsize-md: 14px;
      --rootfontsize-lg: 16px;
      --rootfontsize-xl: 18px;
      --rootfontsize-xxl: 18px;

      --titlefont: 'Darker Grotesque', sans-serif;
      --titleweight: 700;
      --titlesize: 2.4rem;
      --hugetitlesize: 2.8rem;
      --boxtitlesize: 3rem;

      --monofont: 'Fira Code', monospace;
      --monoweight: 400;
      --hugemonosize: 2rem;
      --hugemonolineheight: 2.8rem;

      --bodyfont: 'Inter', sans-serif;
      --bodyweight: 400;
      --bodysize: 1rem;
      --smallsize: 0.9rem;
      --minisize: 0.8rem;
      --mobilenavlinksize: 1.8rem;

      --boxbodysize: 1.2rem;
      --boxlineheight: 1.8;
      --highlightsize: 1.2rem;
      --highlightlineheight: 1.8;

      --theadweight: 500;
      --buttonweight: 600;

      --buttonsize: 1.2rem;
      --smallbuttonsize: 1rem;
      --largebuttonsize: 1.2rem;
      --mobilebuttonsize: 1.2rem;

      --activelinkborder: 4px solid var(--activelink);
    }

    @media (min-width: ${BreakPoint.sm}px) {
      :root {
        --rootfontsize: var(--rootfontsize-md);
        --boxpadding: var(--boxpadding-md);
      }
    }

    @media (min-width: ${BreakPoint.md}px) {
      :root {
        --rootfontsize: var(--rootfontsize-lg);
        --boxpadding: var(--boxpadding-lg);
      }
    }

    @media (min-width: ${BreakPoint.lg}px) {
      :root {
        --rootfontsize: var(--rootfontsize-xl);
        --boxpadding: var(--boxpadding-xl);
      }
    }

    @media (min-width: ${BreakPoint.xl}px) {
      :root {
        --rootfontsize: var(--rootfontsize-xxl);
      }
    }
  `}</style>
)

export default Variables
