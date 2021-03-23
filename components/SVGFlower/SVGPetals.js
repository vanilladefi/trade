/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React, { useRef, lazy, useMemo } from 'react'
import SimplexNoise from 'simplex-noise' // https://github.com/jwagner/simplex-noise.js
import { calcMap, calcClamp } from '../../utils/Calc'
import { PathLine } from 'react-svg-pathline'

function SVGLine({ points, width, rotation, color, duration }) {
  return (
    <PathLine
      points={points}
      stroke={color}
      strokeWidth={width}
      fill='none'
      transform={`rotate(${rotation}, 0, 0)`}
      r={70}
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
  const angleRange = 130

  stems = parseInt(stems)
  iterations = parseInt(iterations)

  const simplex = useMemo(() => new SimplexNoise(seed), [seed])
  const lines = useMemo(
    () =>
      new Array(stems).fill().map((_, index) => {
        let increment = 0.5
        let pointX = 1
        let pointY = 1

        const points = new Array(iterations).fill().map((_, index) => {
          const angle = calcMap(
            simplex.noise2D(increment, 0),
            -10,
            10,
            -angleRange,
            angleRange,
          )

          const angleX = Math.cos(angle)
          const newY = flowerSize / (iterations - 1)

          const newX = pointX + angleX * (angle * 4)

          pointX += newX
          pointY += newY

          increment += simplex.noise2D(increment, 10)
          if (index == 0 || index == iterations - 1) {
            return { x: -flowerSize / 30, y: flowerSize / 30 }
          } else {
            return { x: newX, y: newY }
          }
        })

        return {
          color: color[index] ? color[index] : color[0],
          width: 1.2,
          duration: duration,
          rotation: (360 / stems) * index,
          points,
          index,
        }
      }),
    [color, duration, iterations, simplex, stems],
  )

  console.log(lines)

  return (
    <>
      {lines.map((props, index) => (
        <SVGLine key={index} {...props} />
      ))}
    </>
  )
}
