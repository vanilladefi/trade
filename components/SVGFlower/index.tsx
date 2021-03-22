/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState, lazy, Suspense, useEffect } from 'react'
const SVGPetals = lazy(() => import('./SVGPetals'))

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
  background?: string
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
  flowerSize = flowerSize ?? 3.4

  return (
    <svg>
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
    </svg>
  )
}

export default SVGFlower
