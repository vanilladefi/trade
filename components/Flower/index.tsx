import React, { useCallback, useRef } from 'react'
import { Canvas } from 'react-three-fiber' // https://github.com/pmndrs/react-three-fiber
import router from 'next/router'
import { InView } from 'react-intersection-observer'

import Particles from './Particles'
import Petals from './Petals'

function useHasMounted() {
  const [hasMounted, setHasMounted] = React.useState(false)
  React.useEffect(() => {
    setHasMounted(true)
  }, [])
  return hasMounted
}

type Props = {
  stems?: string | number | string[]
  iterations?: string | number | string[]
  color?: Array<string>
  particleCount?: string | number | string[]
  maxSize: string
  minSize: string
  seed: string | number | string[]
  asBackground?: boolean
  className?: string
  topLeft?: React.ReactNode
  topRight?: React.ReactNode
  bottomLeft?: React.ReactNode
  bottomRight?: React.ReactNode
}

const Flower = ({
  stems,
  iterations,
  particleCount,
  color,
  maxSize,
  minSize,
  seed,
  asBackground,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  ...rest
}: Props): JSX.Element => {
  const mouse = useRef([0, 0])
  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) =>
      (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]),
    [],
  )

  // set defaults if nothing is in url
  let isMobile = false
  seed = seed ?? 123456
  stems = stems ?? 10
  iterations = iterations ?? 34

  const hasMounted = useHasMounted()
  if (hasMounted) {
    isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    seed = router.query.seed ? router.query.seed : seed
    iterations = router.query.iterations ? router.query.iterations : iterations
    stems = router.query.stems ? router.query.stems : stems
  }

  return (
    <InView rootMargin='0px 0px' triggerOnce>
      {({ inView, ref }) => (
        <div ref={ref}>
          {asBackground ? (
            <div
              {...rest}
              style={{
                width: minSize,
                height: minSize,
                maxWidth: maxSize,
                maxHeight: maxSize,
                position: 'absolute',
                zIndex: 0,
                pointerEvents: 'none',
              }}
            >
              <Canvas
                pixelRatio={Math.min(2, isMobile ? window.devicePixelRatio : 1)}
                camera={{ fov: 80, position: [0, 0, 12] }}
              >
                <Petals
                  stems={stems}
                  iterations={iterations}
                  mouse={mouse}
                  color={color}
                  seed={seed}
                  duration={900}
                  animate={inView}
                  asBackground
                />
              </Canvas>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: minSize,
                  height: minSize,
                  maxWidth: maxSize,
                  maxHeight: maxSize,
                  background: 'var(--tradeflowergradient)',
                  borderRadius: '16px',
                }}
              >
                <Canvas
                  pixelRatio={Math.min(
                    2,
                    isMobile ? window.devicePixelRatio : 1,
                  )}
                  camera={{ fov: 80, position: [0, 0, 19] }}
                  onMouseMove={onMouseMove}
                >
                  <Petals
                    stems={stems}
                    iterations={iterations}
                    mouse={mouse}
                    color={color}
                    seed={seed}
                    duration={800}
                    animate={inView}
                    asBackground={false}
                  />
                  <Particles count={particleCount} mouse={mouse} />
                </Canvas>
              </div>
              {topLeft && (
                <div className='data-text top-left-data-text'>{topLeft}</div>
              )}
              {topRight && (
                <div className='data-text top-right-data-text'>{topRight}</div>
              )}
              {bottomLeft && (
                <div className='data-text bottom-left-data-text'>
                  {bottomLeft}
                </div>
              )}
              {bottomRight && (
                <div className='data-text bottom-right-data-text'>
                  {bottomRight}
                </div>
              )}
            </div>
          )}
          <style jsx>{`
            .data-text {
              font-family: var(--monofont);
              font-weight: 300;
              margin: 0;
              position: absolute;
              transform: translateZ(40px);
              font-size: 0.9rem;
              text-transform: uppercase;
              width: 100%;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              width: 30%;
              display: block;
            }
            .top-left-data-text {
              left: 1.5rem;
              top: 1.5rem;
            }
            .top-right-data-text {
              right: 1.5rem;
              top: 1.5rem;
              text-align: right;
            }
            .bottom-left-data-text {
              left: 1.5rem;
              bottom: 1.5rem;
            }
            .bottom-right-data-text {
              right: 1.5rem;
              bottom: 1.5rem;
              text-align: right;
            }
            span {
              width: 100%;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          `}</style>
        </div>
      )}
    </InView>
  )
}

export default Flower
