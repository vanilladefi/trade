import React from 'react'

const Variables = (): JSX.Element => (
  <style global>{`
    :root {

      /* Colors */
      --white: #FFFFFF;
      --dark: #2C1929; 
      --yellow: #D5EBF4;
      --beige: #F3F1EA;
      --inactivelink: #857482;
      --activelink: var(--dark);
      --curtain-background: rgba(44, 21, 45, 0.83);
      --curtain-backdropfilter: blur(10px);
      --roadmapcolor: #FFD866;
      
      /* Gradients */
      --topgradient: radial-gradient(78.72% 122.74% at 91.23% 0%, #FFEEC2 0%, #F4F4F0 100%);
      --boxgradient: radial-gradient(107.22% 272.74% at 100% -2.86%, rgba(251, 241, 215, 0.96) 0%, #F8F7F3 100%);
      --buttongradient: linear-gradient(272.09deg, #FFD866 4.89%, #FFC684 95.55%);
      --tradeflowergradient: linear-gradient(326deg, #FFEDAB 8.09%, #EDEDED 89.18%);
      
      /* Dimensions */
      --maxlayoutwidth: 1280px;

      /* Border radiuses */
      --tradeflowerborderradius: 9px;

      /* Spacing */
      --outermargin: 1rem;
      --layoutmargin: 1rem;
      --boxpadding: 2rem;
      --boxpadding-md: 3rem;
      --boxpadding-lg: 4rem;
      --boxpadding-xl: 5rem;

      --headerpadding: var(--outermargin);
      
      --buttonpadding: 20px;
      --buttonmargin: 0;
      --largebuttonpadding: 23px 39px;
      
      --modalpadding: .5rem 1rem;
      --tradeflowerpadding: 18px 23px;
      
      --titlemargin: 0;
      --hugemonomargin: 0 0 40px 0;
      --subpage-titlemargin: 56px 0 34px 0;
      --landing-titlemargin: 120px 0 32px 0;
      --box-titlemargin: 0 0 32px 0;
      --box-hugemonomargin: 0 0 20px 0;
      --subpage-buttonmargin: 0 0 76px 0;
      --landing-buttonmargin: 0 0 90px 0;

      /* Fonts */

      --rootfontsize: 12px;
      --rootfontsize-md: 14px;
      --rootfontsize-lg: 18px;
      --rootfontsize-xl: 20px;
      --rootfontsize-xxl: 20px;

      --titlefont: 'Darker Grotesque', sans-serif;
      --titleweight: 700;
      --titlesize: 2.4rem;
      --hugetitlesize: 2.8rem;
      --boxtitlesize: 3rem;
      --landing-hugetitlesize: 4rem;

      --monofont: 'Fira Code', monospace;
      --monoweight: 400;
      --hugemonosize: 2rem;
      --hugemonolineheight: 2.8rem;

      --bodyfont: 'Inter', sans-serif;
      --bodyweight: 400;
      --bodysize: 1rem;
      --smallsize: .9rem;
      --minisize: .8rem;

      --boxbodysize: 1.2rem;
      --boxlineheight: 1.8;
      --highlightsize: 1.2rem;
      --highlightlineheight: 1.8;

      --theadweight: 500;
      --buttonweight: 600;

      --buttonsize: 1rem;
      --largebuttonsize: 1.2rem;
      --mobilebuttonsize: 1.2rem;

      --activelinkborder: 4px solid var(--activelink);

    }

    @media (min-width: 640px) {
      :root {
        --rootfontsize: var(--rootfontsize-md);
        --boxpadding: var(--boxpadding-md);
      }
    }

    @media (min-width: 1024px) {
      :root {
        --rootfontsize: var(--rootfontsize-lg);
        --boxpadding: var(--boxpadding-lg);
      }
    }

    @media (min-width: 1280px) {
      :root {
        --rootfontsize: var(--rootfontsize-xl);
        --boxpadding: var(--boxpadding-xl);
      }
    }

    @media (min-width: 1400px) {
      :root {
        --rootfontsize: var(--rootfontsize-xxl);
      }
    }

  `}</style>
)

export default Variables
