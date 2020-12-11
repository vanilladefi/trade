import React, {
  Suspense,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from 'react'
import dynamic from 'next/dynamic'

import { Canvas, extend, MeshProps, useFrame } from 'react-three-fiber' // https://github.com/pmndrs/react-three-fiber

import * as THREE from 'three'
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline' // https://github.com/spite/THREE.MeshLine
import Particles from './Flower/Particles'
import Petals from './Flower/Petals'

extend({ MeshLine, MeshLineMaterial })

const Line = ({ points, width, color }) => {
  return (
    <mesh raycast={MeshLineRaycast}>
      <meshLine
        attach='geometry'
        points={points}
        widthCallback={(pointWidth) => pointWidth * Math.random()}
      />
      <meshLineMaterial
        attach='material'
        transparent
        depthTest={false}
        lineWidth={width}
        color={color}
        dashArray={0.05}
        dashRatio={0.95}
      />
    </mesh>
  )
}

const Box = ({ props }) => {
  // This reference will give us direct access to the mesh
  // const mesh = useRef<Mesh>() and (props: MeshProps) above for TS, but not now. Not now.
  const mesh = useRef()

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    if (mesh.current) mesh.current.rotation.x = mesh.current.rotation.y += 0.01
  })

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={(_event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

const Flower = () => {
  const [hovered, hover] = useState(false)
  const [down, set] = useState(false)
  const mouse = useRef([0, 0])
  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) =>
      (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]),
    []
  )

  return (
    <Canvas
      camera={{ fov: 80, position: [0, 0, 50] }}
      onMouseMove={onMouseMove}
      onMouseUp={() => set(false)}
      onMouseDown={() => set(true)}
    >
      <fog attach='fog' args={['white', 1, 1000]} />
      {/* <ambientLight intensity={1} /> */}
      <Particles count={200} mouse={mouse} />
      <Petals
        stems={14}
        iterations={20}
        mouse={mouse}
        colors={['#2C1929', '#2C1929', '#2C1929']}
      />
      <pointLight distance={40} intensity={10} color='white' />
      {/*<Box position={[1.2, 0, 0]} />
       <Line
        points={([1.2, 0, 0], [1.2, 4, 6], [1.2, 6, 8])}
        width={3}
        color='pink'
      />*/}
    </Canvas>
  )
}

export default Flower
