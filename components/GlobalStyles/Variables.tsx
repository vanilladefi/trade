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
      
      /* Gradients */
      --topgradient: radial-gradient(78.72% 122.74% at 91.23% 0%, #FFEEC2 0%, #F4F4F0 100%);
      --boxgradient: radial-gradient(107.22% 272.74% at 100% -2.86%, rgba(251, 241, 215, 0.96) 0%, #F8F7F3 100%);
      --buttongradient: linear-gradient(272.09deg, #FFD866 4.89%, #FFC684 95.55%);
      
      /* Dimensions */
      --maxlayoutwidth: var(--desktop);

      /* Spacing */
      --outermargin: 44px;
      --layoutmargin: 40px;
      --headerpadding: var(--outermargin) 56px;
      --buttonpadding: 20px;
      --largebuttonpadding: 23px 39px;
      
      --subpage-titlemargin: 56px 0 34px 0;
      --landing-titlemargin: 120px 0 32px 0;

      /* Fonts */
      --titlefont: 'Darker Grotesque', sans-serif;
      --titleweight: 700;
      --titlesize: 42px;
      --hugetitlesize: 53px;
      --landing-hugetitlesize: 76px;

      --monofont: 'Fira Code', monospace;
      --monoweight: 400;
      --hugemonosize: 30px;
      --hugemonolineheight: 45px;

      --bodyfont: 'Inter', sans-serif;
      --bodyweight: 400;
      --bodysize: 18px;
      --smallsize: 16px;

      --theadweight: 500;
      --buttonweight: 600;

      --buttonsize: var(--smallsize);
      --largebuttonsize: 23px;
      --mobilebuttonsize: 35px;
    }
  `}</style>
)

export default Variables
