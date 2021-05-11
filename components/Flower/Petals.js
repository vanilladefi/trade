/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { extend, useFrame, useThree } from '@react-three/fiber'
import lerp from 'lerp'
import React, { useMemo, useRef } from 'react'
import SimplexNoise from 'simplex-noise' // https://github.com/jwagner/simplex-noise.js
import * as THREE from 'three'
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline'
import { calcClamp, calcMap } from '../../utils/Calc'

extend({ MeshLine, MeshLineMaterial })

function easeInOutQuint(t) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
}

function Fatline({ curve, width, rotation, color, duration, animate }) {
  const material = useRef()
  const dashArray = 9.2
  const offsetAmount = dashArray / duration
  let progress = 0
  let time = 0
  const points = curve.length
  let pointprogress = 0

  // This makes the "brush effect" of the stroke -- disabled for now
  // add widthCallback={(pointWidth) => increaseSize()} to <meshLine>
  /*const increaseSize = () => {
    const p = pointprogress / points
    pointprogress += 1
    return 0.1 + 1 * Math.sin(1.5 * p)
  }*/

  useFrame(() => {
    if (material.current.uniforms.dashOffset.value > -1.43 && animate) {
      progress += offsetAmount
      time = progress / 1.45
      material.current.uniforms.dashOffset.value = easeInOutQuint(time) * -1
      material.current.uniforms.opacity.value = easeInOutQuint(time) * 1
    }
  })

  return (
    <mesh raycast={MeshLineRaycast} rotation={rotation}>
      <meshLine attach='geometry' points={curve} />
      <meshLineMaterial
        attach='material'
        ref={material}
        transparent
        opacity={0}
        depthTest={false}
        lineWidth={width}
        color={color}
        dashArray={dashArray}
        dashRatio={0.8}
      />
    </mesh>
  )
}

export default function Petals({
  mouse,
  stems,
  iterations,
  color,
  seed,
  duration,
  animate,
  asBackground,
  flowerSize,
}) {
  const { size, viewport } = useThree()
  const angleRange = 20
  const depthRange = 0.02

  stems = parseInt(stems)
  iterations = parseInt(iterations)

  const simplex = useMemo(() => new SimplexNoise(seed), [seed])
  const lines = useMemo(
    () =>
      new Array(stems).fill().map((_, index) => {
        const pos = new THREE.Vector3(0, 0, 0)
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
            .add(
              new THREE.Vector3(
                newX, // force last points to offset
                newY,
                calcMap(index, 0, 1, -depthRange, depthRange),
              ),
            )
            .clone()
        })

        const curve = new THREE.CatmullRomCurve3(
          points,
          true,
          'centripetal',
          1.5,
        ).getPoints(600)
        return {
          color: color[index] ? color[index] : color[0],
          width: 0.06,
          duration: duration,
          rotation: new THREE.Euler(
            0,
            0,
            calcMap(index, 0, stems, 0, Math.PI * 2),
          ),
          curve,
          index,
        }
      }),
    [color, duration, iterations, simplex, stems],
  )

  const ref = useRef()
  const aspect = size.width / viewport.width
  useFrame(() => {
    if (ref.current) {
      if (asBackground) {
        ref.current.rotation.z = Math.cos(Date.now() * 0.0001) * -0.25
        ref.current.rotation.x = Math.cos(Date.now() * 0.0002) * -0.25
        ref.current.rotation.y = Math.sin(Date.now() * 0.0004) * -0.25
      } else {
        ref.current.rotation.x = lerp(
          ref.current.rotation.x,
          0 + mouse.current[1] / aspect / -50,
          1,
        )
        ref.current.rotation.y = lerp(
          ref.current.rotation.y,
          0 + mouse.current[0] / aspect / -50,
          1,
        )
      }
    }
  })

  return (
    <group ref={ref}>
      <group position={[0, 0, 0]} scale={[1, 1, 1]}>
        {lines.map((props, index) => (
          <Fatline key={index} animate={animate} {...props} />
        ))}
      </group>
    </group>
  )
}
