import * as THREE from 'three'
import React, { useRef, useMemo } from 'react'
import { extend, useFrame, useThree } from 'react-three-fiber'
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline'

extend({ MeshLine, MeshLineMaterial })

function easeInOutQuint(t) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
}

function Fatline({ curve, width, color, duration, animate }) {
  const material = useRef()
  const dashArray = 9.2
  const offsetAmount = -0.03
  let progress = 0
  let time = 0
  const points = curve.length
  let pointprogress = 0

  useFrame(() => {
    if (material.current.uniforms.dashOffset.value > -1 && animate) {
      progress += offsetAmount
      material.current.uniforms.dashOffset.value = progress
    }
  })

  return (
    <mesh raycast={MeshLineRaycast}>
      <meshLine attach='geometry' points={curve} />
      <meshLineMaterial
        attach='material'
        ref={material}
        transparent
        opacity={0.9}
        depthTest={false}
        lineWidth={0.1}
        color={color}
        dashArray={10.5}
        dashRatio={0.8}
      />
    </mesh>
  )
}

export default function ProfitCurve() {
  // Curve points adjusted by hand, so it lands nicely on the left corner of the square canvas
  const curve = [
    new THREE.Vector3(-12, -10.45, 0),
    new THREE.Vector3(-2, -8, 0),
    new THREE.Vector3(0, 0, 0),
  ]
  const points = new THREE.CatmullRomCurve3(curve).getPoints(200)

  return (
    <group>
      <group position={[0, 0, 0]} scale={[1, 1, 1]}>
        <Fatline
          key={1}
          animate={true}
          curve={points}
          color='#000000'
          width={1}
          duration={600}
        />
      </group>
    </group>
  )
}
