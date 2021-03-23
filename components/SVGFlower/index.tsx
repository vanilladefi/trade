/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState, lazy, Suspense, useEffect } from 'react'
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
}

const SVGFlower = ({
  stems,
  iterations,
  color,
  flowerSize,
  seed,
}: Props): JSX.Element => {
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => setHasMounted(true), [])

  seed = seed ?? 123456
  stems = stems ?? 14
  iterations = iterations ?? 12
  flowerSize = flowerSize ?? 300

  return (
    <svg
      width={flowerSize}
      height={flowerSize}
      xmlns='http://www.w3.org/2000/svg'
    >
      <g transform={`translate(${flowerSize / 2} ${flowerSize / 2})`}>
        {hasMounted && (
          <Suspense fallback={null}>
            <SVGPetals
              stems={stems}
              iterations={iterations}
              flowerSize={flowerSize}
              color={color}
              seed={seed}
              duration={800}
            />
          </Suspense>
        )}
      </g>
    </svg>
  )
}

export default SVGFlower
