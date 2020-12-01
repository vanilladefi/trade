import React from 'react'

const Variables = (): JSX.Element => (
  <style global>{`
    :root {
      /* Breakpoints ( From tailwind CSS ) */
      --tablet: 640px;
      --laptop: 1024px;
      --desktop: 1280px;

      /* Colors */
      --white: #FFFFFF;
      --dark: #2C1929;
      --yellow: #D5EBF4;
      --beige: #F3F1EA;
      --inactivelink: #857482;
      --activelink: var(--dark);
      --curtain-background: rgba(44, 21, 45, 0.83);
      --curtain-backdropfilter: blur(20px);
      
      /* Gradients */
      --topgradient: radial-gradient(78.72% 122.74% at 91.23% 0%, #FFEEC2 0%, #F4F4F0 100%);
      --boxgradient: radial-gradient(107.22% 272.74% at 100% -2.86%, rgba(251, 241, 215, 0.96) 0%, #F8F7F3 100%);
      --buttongradient: linear-gradient(272.09deg, #FFD866 4.89%, #FFC684 95.55%);
      --tradeflowergradient: linear-gradient(326deg, #FFEDAB 8.09%, #EDEDED 89.18%);
      
      /* Dimensions */
      --maxlayoutwidth: var(--desktop);

      /* Border radiuses */
      --tradeflowerborderradius: 9px;

      /* Spacing */
      --outermargin: 44px;
      --layoutmargin: 40px;
      --boxpadding: 60px 72px;
      --headerpadding: var(--outermargin) 56px;
      --buttonpadding: 20px;
      --buttonmargin: 0;
      --largebuttonpadding: 23px 39px;
      --modalpadding: 8px 15px;
      --tradeflowerpadding: 18px 23px;
      
      --subpage-titlemargin: 56px 0 34px 0;
      --landing-titlemargin: 120px 0 32px 0;
      --box-titlemargin: 0 0 32px 0;

      /* Fonts */
      --titlefont: 'Darker Grotesque', sans-serif;
      --titleweight: 700;
      --titlesize: 42px;
      --hugetitlesize: 53px;
      --boxtitlesize: 67px;
      --landing-hugetitlesize: 76px;

      --monofont: 'Fira Code', monospace;
      --monoweight: 400;
      --hugemonosize: 30px;
      --hugemonolineheight: 45px;

      --bodyfont: 'Inter', sans-serif;
      --bodyweight: 400;
      --bodysize: 18px;
      --smallsize: 16px;

      --boxbodysize: 22px;
      --highlightsize: 31px;
      --highlightlineheight: 49px;

      --theadweight: 500;
      --buttonweight: 600;

      --buttonsize: var(--smallsize);
      --largebuttonsize: 23px;
      --mobilebuttonsize: 35px;
    }
  `}</style>
)

export default Variables
