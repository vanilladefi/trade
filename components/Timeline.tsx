import React from 'react'
import Wrapper from './Wrapper'

export type Milestone = {
  name: string
  time: string
}

type Props = {
  milestones: Array<Milestone>
}

const Timeline = ({ milestones }: Props): JSX.Element => {
  return (
    <>
      <div className='line' />
      <div className='timeline'>
        <Wrapper>
          <div className='milestones'>
            {milestones.map((milestone) => (
              <div
                className='milestone'
                key={`${milestone.name}-${milestone.time}`}
              >
                <div className='ball'></div>
                <h2>{milestone.name}</h2>
                <h3>{milestone.time}</h3>
              </div>
            ))}
          </div>
        </Wrapper>
      </div>
      <style jsx>{`
        .timeline {
          display: flex;
          flex-direction: row;
          width: 100%;
          padding: 0 4rem;
          overflow: hidden;
        }
        .line {
          min-height: 100%;
          width: 2px;
          background: var(--roadmapcolor);
          position: absolute;
          left: 0;
          transform: translateY(8rem) translateX(2rem);
        }
        .ball {
          width: 22px;
          height: 22px;
          position: absolute;
          transform: translateX(-3.8rem) translateY(0.7rem);
          border-radius: 50%;
          background: var(--dark);
          border: 4px solid var(--white);
          margin-bottom: 53px;
        }
        @media screen and (min-width: 540px) {
          .timeline {
            display: flex;
            flex-direction: row;
            width: 100%;
            position: relative;
            flex-wrap: nowrap;
            align-items: flex-start;
            justify-content: center;
            padding-top: 38px;
            padding-bottom: 76px;
            padding-left: 0;
            padding-right: 0;
            left: 0;
          }
          .line {
            flex-shrink: 0;
            width: 100%;
            height: 4px;
            background: var(--roadmapcolor);
            position: sticky;
            min-height: 4px;
            margin-top: 11px;
            transform: translateY(53px);
          }
          .milestone {
            display: flex;
            flex-shrink: 0;
            flex-direction: column;
            z-index: 2;
          }
          .milestones {
            display: flex;
            flex-direction: row;
            padding: var(--boxpadding);
            padding-top: 0;
            padding-bottom: 0;
            justify-content: space-between;
          }
          .ball {
            transform: none;
            position: static;
          }
          h2 {
            font-size: 1.5rem;
            line-height: 1.68;
            margin: 0;
          }
          h3 {
            font-family: var(--monofont);
            font-weight: var(--monoweight);
            font-size: 1rem;
            line-height: 1.8;
            margin: 0;
          }
        }
      `}</style>
    </>
  )
}

export default Timeline
