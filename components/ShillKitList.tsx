import dynamic from 'next/dynamic'
import { BreakPoint } from '../components/GlobalStyles/Breakpoints'

const ResponsiveImage = dynamic(import('components/typography/ResponsiveImage'))

const theList = [
  {
    description: '#ProfitMining, good',
    url: 'https://media.giphy.com/media/er1fPc8peBhDKejQXn/giphy.mp4',
    giphy: 'https://giphy.com/gifs/er1fPc8peBhDKejQXn',
    type: 'animated',
  },
  {
    description: 'Just chilling, and mining',
    url: '/shill/vnl--chillingandmining.jpg',
    type: 'image',
  },
  {
    description: 'Cup of profit',
    url: '/shill/vnl--cupofprofit.jpg',
    type: 'image',
  },
  {
    description: 'Do you even #ProfitMine, bro?',
    url: '/shill/vnl--doyoueven.jpg',
    type: 'image',
  },
  {
    description: 'Lit',
    url: 'https://media.giphy.com/media/iq4ez2LCX0WOatNGCi/giphy.mp4',
    giphy: 'https://giphy.com/gifs/iq4ez2LCX0WOatNGCi',
    type: 'animated',
  },
  {
    description: 'Splash',
    url: 'https://media.giphy.com/media/NFJhh0gdvNCmnkFvIB/giphy.mp4',
    giphy: 'https://giphy.com/gifs/NFJhh0gdvNCmnkFvIB',
    type: 'animated',
  },
  {
    description: 'Get inspired',
    url: '/shill/vnl--inspirational.jpg',
    type: 'image',
  },
  {
    description: 'Live Laugh #ProfitMine',
    url: '/shill/vnl--livelaughprofitmine.jpg',
    type: 'image',
  },
  {
    description: 'Motivational',
    url: '/shill/vnl--motivational.jpg',
    type: 'image',
  },
  {
    description: 'Those profitmining feels',
    url: 'https://media.giphy.com/media/8ZvWqa2oNFNa6U9uN8/giphy.mp4',
    giphy: 'https://giphy.com/gifs/8ZvWqa2oNFNa6U9uN8',
    type: 'animated',
  },
  {
    description: 'Yes, Thumbs up for ProfitMining',
    url: 'https://media.giphy.com/media/FgYB3uyw3noA4UGmHS/giphy.mp4',
    giphy: 'https://giphy.com/gifs/FgYB3uyw3noA4UGmHS',
    type: 'animated',
  },
  {
    description: 'Ride the wave',
    url: '/shill/vnl--wave.jpg',
    type: 'image',
  },
  {
    description: 'Working hard',
    url: 'https://media.giphy.com/media/gkrVw2AffIyRSrpBeF/giphy.mp4',
    giphy: 'https://giphy.com/gifs/gkrVw2AffIyRSrpBeF',
    type: 'animated',
  },
  {
    description: 'Yo dawg',
    url: '/shill/vnl--yodawg.jpg',
    type: 'image',
  },
]

const ShillKitList = (): JSX.Element => {
  return (
    <div className='galleryContainer'>
      {theList.map((shill, index) => (
        <div
          key={index}
          style={{ width: '100%', maxWidth: '400px', padding: '0 0 .5rem' }}
        >
          <a
            href={shill.giphy ? shill.giphy : shill.url}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={shill.description}
          >
            {shill.giphy ? (
              <video
                style={{ margin: 'auto', display: 'block', maxWidth: '100%' }}
                autoPlay={true}
                loop
                muted
                playsInline
                webkit-playsinline='true'
              >
                <source src={shill.url} type='video/mp4' />
              </video>
            ) : (
              <div className='imageContainer'>
                <ResponsiveImage src={shill.url} alt={shill.description} />
              </div>
            )}
          </a>
        </div>
      ))}
      <style jsx>{`
        .galleryContainer {
          column-gap: 1.5em;
          column-count: 1;
          grid-auto-columns: 1fr;
        }
        .imageContainer {
          position: relative;
          width: 100%;
          height: auto;
          min-height: 300px;
        }
        .imageContainer > * {
          object-fit: contain;
        }
        @media (min-width: ${BreakPoint.sm}px) {
          .galleryContainer {
            column-count: 2;
          }
        }

        @media (min-width: ${BreakPoint.md}px) {
          .galleryContainer {
            column-count: 3;
          }
        }
      `}</style>
    </div>
  )
}

export default ShillKitList
