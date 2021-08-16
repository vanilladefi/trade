import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { currentBlockNumberState } from 'state/meta'
import { providerState } from 'state/wallet'

const SyncIndicator = (): JSX.Element => {
  const blockNumber = useRecoilValue(currentBlockNumberState)
  const provider = useRecoilValue(providerState)
  const [blockDelta, setBlockDelta] = useState<number>(0)

  const ballClass = classNames('ball', {
    green: Math.abs(blockDelta) < 4,
    yellow: Math.abs(blockDelta) >= 4 && Math.abs(blockDelta) < 10,
    red: Math.abs(blockDelta) >= 10,
  })

  const smallClass = classNames('small', {
    hidden: Math.abs(blockDelta) < 4,
  })

  useEffect(() => {
    provider.getBlockNumber().then((result) => {
      setBlockDelta(result - blockNumber)
    })
  }, [blockNumber, provider])

  return (
    <>
      <div className='wrapper'>
        <div className={ballClass}></div>
        <b>{blockNumber}</b>
        <small className={smallClass}>({blockDelta} blocks delta)</small>
      </div>
      <style jsx>{`
        .wrapper {
          font-size: 0.7rem;
          font-family: var(--bodyfont);
          background: var(--beige);
          color: var(--dark);
          padding: 0.2rem 0.5rem;
          border-radius: 1rem;
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        .ball {
          border-radius: 50%;
          height: 0.5rem;
          width: 0.5rem;
          margin-right: 0.3rem;
        }
        .red {
          background: var(--red);
        }
        .green {
          background: var(--green);
        }
        .yellow {
          background: var(--alertyellow);
        }
        small.small {
          font-size: inherit;
          margin-left: 0.2rem;
        }
        .hidden {
          display: none;
        }
      `}</style>
    </>
  )
}

export default SyncIndicator
