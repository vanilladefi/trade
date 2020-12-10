import React from 'react'

const Fonts = (): JSX.Element => (
  <style jsx global>{`
    @font-face {
      font-family: 'Darker Grotesque';
      src: url('fonts/Darker_Grotesque/DarkerGrotesque-Bold.ttf')
        format('truetype');
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
      src: url('fonts/Inter/static/Inter-SemiBold-slnt=0.ttf')
        format('truetype');
      font-weight: 600;
      font-style: normal;
    }
  `}</style>
)

export default Fonts
