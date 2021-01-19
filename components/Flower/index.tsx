import React, { useCallback, useRef } from 'react'
import { Canvas } from 'react-three-fiber' // https://github.com/pmndrs/react-three-fiber
import router from 'next/router'
import Tilt from 'react-parallax-tilt'
import { InView } from 'react-intersection-observer'

import Petals from './Petals'

function useHasMounted() {
  const [hasMounted, setHasMounted] = React.useState(false)
  React.useEffect(() => {
    setHasMounted(true)
  }, [])
  return hasMounted
}

type Props = {
  stems?: any
  iterations?: any
  color?: string
  maxSize: string
  minSize: string
  seed: any
  asBackground?: Boolean
  className?: string
}

const Flower = ({
  stems,
  iterations,
  color,
  maxSize,
  minSize,
  seed,
  asBackground,
  ...rest
}: Props): JSX.Element => {
  const mouse = useRef([0, 0])
  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) =>
      (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]),
    []
  )

  // set defaults if nothing is in url
  let isMobile = false
  seed ? seed : (seed = 123456)
  stems ? stems : (stems = 10)
  iterations ? iterations : (iterations = 34)

  const hasMounted = useHasMounted()
  if (hasMounted) {
    isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    seed = router.query.seed ? router.query.seed : seed
    iterations = router.query.iterations ? router.query.iterations : iterations
    stems = router.query.stems ? router.query.stems : stems
  }

  return (
    <InView rootMargin='-200px 0px' triggerOnce>
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
              }}
            >
              <Canvas
                pixelRatio={Math.min(2, isMobile ? window.devicePixelRatio : 1)}
                camera={{ fov: 90, position: [0, 0, 28] }}
              >
                <Petals
                  stems={stems}
                  iterations={iterations}
                  mouse={mouse}
                  color={color}
                  seed={seed}
                  duration={800}
                  animate={inView}
                />
                <pointLight distance={40} intensity={10} color='white' />
              </Canvas>
            </div>
          ) : (
            <Tilt
              gyroscope={true}
              tiltMaxAngleX={10}
              tiltMaxAngleY={10}
              perspective={1100}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div
                style={{
                  width: minSize,
                  height: minSize,
                  maxWidth: maxSize,
                  maxHeight: maxSize,
                  background:
                    'linear-gradient(326deg, #FFEDAB 8.09%, #EDEDED 89.18%)',
                  borderRadius: '16px',
                }}
              >
                <Canvas
                  pixelRatio={Math.min(
                    2,
                    isMobile ? window.devicePixelRatio : 1
                  )}
                  camera={{ fov: 80, position: [0, 0, 34] }}
                  onMouseMove={onMouseMove}
                >
                  <Petals
                    stems={stems}
                    iterations={iterations}
                    mouse={mouse}
                    color={color}
                    seed={seed}
                    duration={600}
                    animate={inView}
                  />
                  <pointLight distance={40} intensity={10} color='white' />
                </Canvas>
              </div>
              <div className='data-text top-left-data-text'>Seed {seed}</div>
              <div className='data-text top-right-data-text'>
                Iterations {iterations}
              </div>
              <div className='data-text bottom-left-data-text'>
                Stems {stems}
              </div>
            </Tilt>
          )}
          <style jsx>{`
            .data-text {
              font-family: var(--monofont);
              font-weight: 300;
              position: absolute;
              transform: translateZ(40px);
              font-size: 0.9rem;
              text-transform: uppercase;
            }
            .top-left-data-text {
              left: 8%;
              top: 8%;
            }
            .top-right-data-text {
              right: 8%;
              top: 8%;
            }
            .bottom-left-data-text {
              left: 8%;
              bottom: 8%;
            }
          `}</style>
        </div>
      )}
    </InView>
  )
}

export default Flower
