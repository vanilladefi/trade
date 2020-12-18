import * as THREE from 'three'
import React, { useRef, useMemo } from 'react'
import { extend, useFrame, useThree } from 'react-three-fiber'
import lerp from 'lerp'
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline'
import SimplexNoise from 'simplex-noise' // https://github.com/jwagner/simplex-noise.js
import { calcMap } from '../../utils/Calc'

extend({ MeshLine, MeshLineMaterial })

const r = () => Math.max(0.2, Math.random())

function Fatline({ curve, width, rotation, color, speed }) {
  const material = useRef()
  useFrame(() => (material.current.uniforms.dashOffset.value -= speed))
  return (
    <mesh raycast={MeshLineRaycast} rotation={rotation}>
      <meshLine attach='geometry' points={curve} />
      <meshLineMaterial
        attach='material'
        ref={material}
        transparent
        depthTest={false}
        lineWidth={width}
        color={color}
        dashArray={0}
        dashRatio={0}
      />
    </mesh>
  )
}

export default function Petals({ mouse, stems, iterations, color, seed }) {
  const simplex = new SimplexNoise(seed)
  const angleRange = 6.9
  const speed = 4
  const depth = 0.034
  stems = parseInt(stems)
  iterations = parseInt(iterations)
  const lines = useMemo(
    () =>
      new Array(stems).fill().map((_, index) => {
        const pos = new THREE.Vector3(0, 0, 0)
        let increment = 3

        const points = new Array(iterations).fill().map((_, index) => {
          //const angle = (index / 20) * Math.PI * 2
          // (val, inputMin, inputMax, outputMin, outputMax)
          const speed = calcMap(
            simplex.noise2D(increment, 0),
            1,
            -1,
            -angleRange,
            angleRange
          )

          const angle = calcMap(
            simplex.noise2D(increment, 0),
            1,
            -1,
            -angleRange,
            angleRange
          )
          increment += increment
          return pos
            .add(
              new THREE.Vector3(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                calcMap(index, 0, 1, -depth / 2, depth / 2)
              )
            )
            .clone()
        })
        console.log(stems)
        const curve = new THREE.CatmullRomCurve3(points).getPoints(300)
        return {
          color: color,
          width: 0.15,
          speed: Math.max(0.001, 0.004 * Math.random()),
          rotation: new THREE.Euler(
            0,
            0,
            calcMap(index, 0, stems, 0, Math.PI * 2)
          ),
          curve,
        }
      }),
    [stems]
  )

  const ref = useRef()
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width
  useFrame(() => {
    if (ref.current) {
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
  })

  return (
    <group ref={ref}>
      <group position={[0, 0, 0]} scale={[1, 1, 1]}>
        {lines.map((props, index) => (
          <Fatline key={index} {...props} />
        ))}
      </group>
    </group>
  )
}
