import React, { useRef, useState } from 'react'
import { Canvas, MeshProps, useFrame } from 'react-three-fiber'
import { Mesh } from 'three'
import SimplexNoise from 'simplex-noise'

const Box = (props: MeshProps) => {
  this.simplex = config.simplex
    this.total = config.total
    this.x = config.x
    this.y = config.y
    this.dir = config.dir
    this.speed = config.speed
    this.delta = config.delta
    this.time = config.time
    this.angleRange = config.angleRange
    this.away = config.away
    this.depth = config.depth

    this.position = new THREE.Vector3(this.x, this.y, 0)
    this.path = []

    let walker = {
      simplex: this.simplex,
      total: this.vb.get('iterations'),
      x: centered ? 0 : Calc.rand(-1, 1),
      y: centered ? 0 : Calc.rand(-1, 1),
      dir: (i / this.count) * ((Math.PI * 2) / this.stems),
      speed: 0,
      delta: this.vb.get('noise-speed'),
      angleRange: this.vb.get('angle-range'),
      away: 0,
      depth: this.vb.get('depth'),
      time: i * 1000,
    }
    let geometry = new THREE.Geometry()
    let line = new MeshLine()

  // This reference will give us direct access to the mesh
  const mesh = useRef<Mesh>()

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    if (mesh.current) mesh.current.rotation.x = mesh.current.rotation.y += 0.01

     // progress the time for noise
     this.time += this.delta

     // get noise values for angle and speed
     this.angle = Calc.map(
       this.simplex.noise2D(this.time, 0),
       -1,
       1,
       -this.angleRange,
       this.angleRange
     )
     this.speed = Calc.map(this.simplex.noise2D(this.time, 1000), -1, 1, 0, 0.01)
 
     // apply noise values
     this.dir += this.angle
     this.position.x += Math.cos(this.dir) * this.speed
     this.position.y += Math.sin(this.dir) * this.speed
 
     // grow away or toward the camera
     if (this.away) {
       this.position.z = Calc.map(p, 0, 1, this.depth / 2, -this.depth / 2)
     } else {
       this.position.z = Calc.map(p, 0, 1, -this.depth / 2, this.depth / 2)
     }
 
     // push new position into the path array
     this.path.push({
       x: this.position.x,
       y: this.position.y,
       z: this.position.z,
     })
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
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  )
}

export default Flower
