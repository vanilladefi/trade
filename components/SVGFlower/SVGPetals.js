/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React, { useRef, lazy, useMemo } from 'react'
import SimplexNoise from 'simplex-noise' // https://github.com/jwagner/simplex-noise.js
import { calcMap, calcClamp } from '../../utils/Calc'
import { PathLine } from 'react-svg-pathline'

function SVGLine({ curve, width, rotation, color, duration }) {
  const offsetAmount = dashArray / duration
  const points = curve.length
  const rotationTransform = `rotation(${rotation}deg)`

  return (
    <PathLine
      points={curve}
      stroke={color}
      strokeWidth='1'
      fill='none'
      transform={`rotate(${rotation})`}
      r={30}
    />
  )
}

export default function SVGPetals({
  stems,
  iterations,
  color,
  seed,
  duration,
  flowerSize,
}) {
  const angleRange = 20
  const depthRange = 0.02

  stems = parseInt(stems)
  iterations = parseInt(iterations)

  const simplex = useMemo(() => new SimplexNoise(seed), [seed])
  const lines = useMemo(
    () =>
      new Array(stems).fill().map((_, index) => {
        const pos = { x: 0, y: 0 }
        let increment = 0.3
        let pointX = 0.1
        let pointY = 0

        const points = new Array(iterations).fill().map((_, index) => {
          const angle = calcMap(
            simplex.noise2D(increment, 0),
            -1,
            1,
            -angleRange,
            angleRange,
          )

          const angleX = Math.cos(angle)
          const newY = flowerSize / iterations

          const newX = pointX + calcClamp(angleX, -1, 1)

          pointX += newX / 100
          pointY += newY

          increment += calcMap(simplex.noise2D(increment, 0), 1, -1, 0, 1)
          return pos
            .add({
              newX, // force last points to offset
              newY,
            })
            .clone()
        })

        return {
          color: color[index] ? color[index] : color[0],
          width: 1,
          duration: duration,
          rotation: calcMap(index, 0, stems, 0, Math.PI * 2),
          points,
          index,
        }
      }),
    [color, duration, iterations, simplex, stems],
  )

  return (
    <group>
      {lines.map((props, index) => (
        <SVGLine key={index} animate={animate} {...props} />
      ))}
    </group>
  )
}
