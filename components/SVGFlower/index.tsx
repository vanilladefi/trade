/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState, lazy, Suspense, useEffect } from 'react'
import { InView } from 'react-intersection-observer'
const SVGPetals = lazy(() => import('./SVGPetals'))

type Props = {
  stems?: string | number | string[]
  iterations?: string | number | string[]
  color?: Array<string>
  flowerSize?: number
  background?: string
  seed: string | number | string[]
  asBackground?: boolean
  className?: string
  hasProfitCurve?: boolean
  profitCurveHeight?: number
}

const SVGFlower = ({
  stems,
  iterations,
  color,
  flowerSize,
  seed,
  className,
  hasProfitCurve,
  profitCurveHeight,
}: Props): JSX.Element => {
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => setHasMounted(true), [])

  seed = seed ?? 123456
  stems = stems ?? 14
  iterations = iterations ?? 12
  flowerSize = flowerSize ?? 300
  profitCurveHeight = profitCurveHeight ?? 600
  const singleFlowerPos = `translate(${flowerSize / 2} ${flowerSize / 2})`
  const profitCurveFlowerPos = `translate(${770} ${flowerSize / 2})`

  return (
    <>
      {/* Single flower without profit curves */}
      {!hasProfitCurve && (
        <InView rootMargin='0px' triggerOnce>
          {({ inView, ref }) => (
            <svg
              ref={ref}
              width={flowerSize}
              height={flowerSize}
              xmlns='http://www.w3.org/2000/svg'
              className={`${className} ${inView ? 'animate-flower-svg' : ''} `}
            >
              <g transform={singleFlowerPos}>
                {hasMounted && (
                  <Suspense fallback={null}>
                    <SVGPetals
                      stems={stems}
                      iterations={iterations}
                      flowerSize={flowerSize}
                      color={color}
                      seed={seed}
                    />
                  </Suspense>
                )}
              </g>
            </svg>
          )}
        </InView>
      )}

      {/* Flower with animated profit curve */}
      {hasProfitCurve && (
        <svg
          width={1000}
          height={profitCurveHeight}
          xmlns='http://www.w3.org/2000/svg'
          className={`${className}`}
        >
          <g className='animated-profitcurve-flower'>
            <g transform={profitCurveFlowerPos}>
              {hasMounted && (
                <Suspense fallback={null}>
                  <SVGPetals
                    stems={stems}
                    iterations={iterations}
                    flowerSize={flowerSize}
                    color={color}
                    seed={seed}
                  />
                </Suspense>
              )}
            </g>
          </g>
          <path
            d={`M1 ${profitCurveHeight} C1 ${
              profitCurveHeight - 140
            } 770 ${profitCurveHeight} 770 ${flowerSize / 2}`}
            stroke='#414141'
            strokeWidth='2'
            fill='none'
            className='animated-profitcurve-curve'
          />
        </svg>
      )}
      <style jsx>{`
        .animate-flower-svg {
          opacity: 0;
          transform: scale(0.9) rotate(20deg);
          animation: animateSVG 1.7s cubic-bezier(0.85, 0, 0.15, 1) forwards;
        }

        .animate-flower-svg path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: dash 1.8s cubic-bezier(0.85, 0, 0.15, 1) forwards;
        }

        .animated-profitcurve-flower {
          opacity: 0;
          transform: scale(0.2) rotate(50deg);
          transform-origin: 770px ${flowerSize / 2}px;
          animation: animateSVG 1.7s cubic-bezier(0.85, 0, 0.15, 1) 0.8s
            forwards;
        }
        .animated-profitcurve-flower path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: dash 1.8s cubic-bezier(0.85, 0, 0.15, 1) forwards;
        }
        .animated-profitcurve-curve {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: dash 1.8s cubic-bezier(0.85, 0, 0.15, 1) forwards;
        }

        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes animateSVG {
          to {
            opacity: 1;
            transform: scale(1) rotate(0);
          }
        }
      `}</style>
    </>
  )
}

export default SVGFlower
