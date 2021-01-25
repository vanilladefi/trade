/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import * as THREE from 'three'
import React, { useRef, useMemo } from 'react'
import { extend, useFrame, useThree } from 'react-three-fiber'
import lerp from 'lerp'
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline'
import SimplexNoise from 'simplex-noise' // https://github.com/jwagner/simplex-noise.js
import { calcMap, calcClamp } from '../../utils/Calc'

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

  // This makes the "brush effect"
  const increaseSize = () => {
    const p = pointprogress / points
    pointprogress += 1
    return 0.8 + 2 * Math.sin(18 * p)
  }

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
      <meshLine
        attach='geometry'
        widthCallback={(pointWidth) => increaseSize()}
        points={curve}
      />
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
}) {
  const angleRange = 9
  const depthRange = 0.058
  stems = parseInt(stems)
  iterations = parseInt(iterations)
  const simplex = useMemo(() => new SimplexNoise(seed), [seed])
  const lines = useMemo(
    () =>
      new Array(stems).fill().map((_, index) => {
        const pos = new THREE.Vector3(0, 0, 0)
        let increment = 1.4
        let pointX = 0
        let pointY = 0

        const points = new Array(iterations).fill().map((_, index) => {
          const angle = calcMap(
            simplex.noise2D(increment, 0),
            -1,
            1,
            -angleRange,
            angleRange
          )

          const newX = pointX + Math.cos(angle)
          const newY = pointY + Math.sin(angle)

          pointX += Math.cos(angle) / 100
          pointY += Math.sin(angle) / 100

          increment += calcMap(simplex.noise2D(increment, 0), 1, -1, 0, 0.9)
          return pos
            .add(
              new THREE.Vector3(
                calcClamp(newX, -1, 1),
                calcClamp(newY, -1, 1),
                calcMap(index, 0, 1, -depthRange / 2, depthRange / 2)
              )
            )
            .clone()
        })

        const curve = new THREE.CatmullRomCurve3(points).getPoints(100)
        return {
          color: color[index] ? color[index] : color[0],
          width: 0.06,
          duration: duration,
          rotation: new THREE.Euler(
            0,
            0,
            calcMap(index, 0, stems, 0, Math.PI * 2)
          ),
          curve,
          index,
        }
      }),
    [color, duration, iterations, simplex, stems]
  )

  const ref = useRef()
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width
  useFrame(() => {
    if (ref.current) {
      if (asBackground) {
        ref.current.rotation.z = Math.cos(Date.now() * 0.0001) * -0.1
        ref.current.rotation.x = Math.cos(Date.now() * 0.0002) * -0.1
        ref.current.rotation.y = Math.sin(Date.now() * 0.0004) * -0.1
      } else {
        ref.current.rotation.x = lerp(
          ref.current.rotation.x,
          0 + mouse.current[1] / aspect / -200,
          0.8
        )
        ref.current.rotation.y = lerp(
          ref.current.rotation.y,
          0 + mouse.current[0] / aspect / -400,
          0.8
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
