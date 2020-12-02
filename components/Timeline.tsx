import React from 'react'
import { Row } from './grid/Flex'
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
      <div className='timeline'>
        <div className='line' />
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
      <style jsx>{`
        .timeline {
          display: flex;
          flex-direction: row;
          width: 100%;
          position: relative;
          flex-wrap: nowrap;
          overflow-x: scroll-x;
          align-items: flex-start;
          justify-content: center;
          margin-top: 38px;
          padding-bottom: 76px;
          padding-left: 0;
          padding-right: 0;
          left: 0;
        }
        .line {
          width: 100%;
          height: 4px;
          background: var(--roadmapcolor);
          position: absolute;
          top: 11px;
          left: 0;
        }
        .milestone {
          display: flex;
          width: 224px;
          flex-direction: column;
          z-index: 2;
        }
        .ball {
          width: 27px;
          height: 27px;
          border-radius: 50%;
          background: var(--dark);
          border: 4px solid var(--white);
          margin-bottom: 53px;
        }
        h2 {
          font-size: 25px;
          line-height: 37px;
          margin: 0;
        }
        h3 {
          font-family: var(--monofont);
          font-weight: var(--monoweight);
          font-size: 21px;
          line-height: 31px;
          margin: 0;
        }
      `}</style>
    </>
  )
}

export default Timeline
