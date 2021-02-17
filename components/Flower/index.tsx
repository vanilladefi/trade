import React, { useCallback, useRef } from 'react'
import { Canvas } from 'react-three-fiber' // https://github.com/pmndrs/react-three-fiber
import { InView } from 'react-intersection-observer'
import domtoimage from 'dom-to-image'

import Particles from './Particles'
import Petals from './Petals'
import ProfitCurve from './ProfitCurve'

type Props = {
  stems?: string | number | string[]
  iterations?: string | number | string[]
  color?: Array<string>
  particleCount?: string | number | string[]
  maxWidth: string
  maxHeight: string
  minWidth: string
  minHeight: string
  flowerSize?: string | number | string[]
  background: string
  seed: string | number | string[]
  asBackground?: boolean
  className?: string
  topLeft?: React.ReactNode
  topRight?: React.ReactNode
  bottomLeft?: React.ReactNode
  bottomRight?: React.ReactNode
  hasProfitCurve?: boolean
  allowExport?: boolean
  positionRight?: boolean
}

const Flower = ({
  stems,
  iterations,
  particleCount,
  color,
  maxWidth,
  minWidth,
  maxHeight,
  minHeight,
  flowerSize,
  background,
  seed,
  asBackground,
  hasProfitCurve,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  allowExport,
  positionRight,
  ...rest
}: Props): JSX.Element => {
  const mouse = useRef([0, 0])
  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) =>
      (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]),
    [],
  )

  const flowerRef = React.createRef<HTMLDivElement>()

  const downloadImage = () => {
    const node = flowerRef.current
    if (node) {
      domtoimage.toPng(node).then(function (dataUrl) {
        const link = document.createElement('a')
        link.download = `profitblossom-${
          new Date().toISOString().split('T')[0]
        }.png`
        link.href = dataUrl
        link.click()
      })
    }
  }

  seed = seed ?? 123456
  stems = stems ?? 14
  iterations = iterations ?? 12
  flowerSize = flowerSize ?? 3.4

  return (
    <InView rootMargin='0px' triggerOnce>
      {({ inView, ref }) => (
        <div ref={ref}>
          {asBackground ? (
            <div
              {...rest}
              style={{
                width: minWidth,
                height: minHeight,
                maxWidth: maxWidth,
                maxHeight: maxHeight,
                position: 'absolute',
                zIndex: 0,
                pointerEvents: 'none',
                background: background ? background : 'none',
                backgroundSize: '100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'bottom',
              }}
            >
              <Canvas
                pixelRatio={
                  typeof window !== 'undefined'
                    ? window.devicePixelRatio
                      ? window.devicePixelRatio
                      : 1
                    : 1
                }
                camera={{ fov: 75, position: [0, 0, 12] }}
                resize={{ scroll: false }}
              >
                <Petals
                  stems={stems}
                  iterations={iterations}
                  flowerSize={flowerSize}
                  mouse={mouse}
                  color={color}
                  seed={seed}
                  duration={900}
                  animate={inView}
                  asBackground
                />
                {hasProfitCurve && <ProfitCurve />}
              </Canvas>
            </div>
          ) : (
            <div>
              <div style={{ position: 'relative' }} ref={flowerRef}>
                <div
                  style={{
                    width: minWidth,
                    height: minHeight,
                    maxWidth: maxWidth,
                    maxHeight: maxHeight,
                    background: background
                      ? background
                      : 'var(--tradeflowergradient)',
                    borderRadius: '16px',
                    backgroundSize: '100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'bottom',
                  }}
                >
                  <Canvas
                    pixelRatio={
                      typeof window !== 'undefined'
                        ? window.devicePixelRatio
                          ? window.devicePixelRatio
                          : 1
                        : 1
                    }
                    camera={{ fov: 75, position: [0, 0, 19] }}
                    onMouseMove={onMouseMove}
                    resize={{ scroll: false }}
                    gl={{ preserveDrawingBuffer: true }}
                  >
                    <Petals
                      stems={stems}
                      iterations={iterations}
                      flowerSize={flowerSize}
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
                  <div className='data-text top-right-data-text'>
                    {topRight}
                  </div>
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
              {allowExport && (
                <button style={{ marginTop: '1rem' }} onClick={downloadImage}>
                  Download as png
                </button>
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
