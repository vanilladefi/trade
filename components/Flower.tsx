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

import Particles from './Flower/Particles'
import Petals from './Flower/Petals'
import Sparks from './Flower/Sparks'
import router from 'next/router'

import Tilt from 'react-parallax-tilt'

function useHasMounted() {
  const [hasMounted, setHasMounted] = React.useState(false)
  React.useEffect(() => {
    setHasMounted(true)
  }, [])
  return hasMounted
}

type Props = {
  stems?: any
  iterations?: any
  color?: String
  maxSize: Number
  seed: any
}

const Flower = ({
  stems,
  iterations,
  color,
  maxSize,
  seed,
}: Props): JSX.Element => {
  const [hovered, hover] = useState(false)
  const [down, set] = useState(false)
  const mouse = useRef([0, 0])
  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) =>
      (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]),
    []
  )

  // set defaults if nothing is in url
  let isMobile = false
  seed ? seed : (seed = 123456)
  stems ? stems : (stems = 10)
  iterations ? iterations : (iterations = 34)

  const hasMounted = useHasMounted()
  if (hasMounted) {
    isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    seed = router.query.seed ? router.query.seed : seed
    iterations = router.query.iterations ? router.query.iterations : iterations
    stems = router.query.stems ? router.query.stems : stems
  }

  return (
    <>
      <Tilt
        gyroscope={true}
        tiltMaxAngleX={10}
        tiltMaxAngleY={10}
        perspective={1100}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          style={{
            width: '80vw',
            height: '80vw',
            maxWidth: `${maxSize}px`,
            maxHeight: `${maxSize}px`,
            background:
              'linear-gradient(326deg, #FFEDAB 8.09%, #EDEDED 89.18%)',
            borderRadius: '16px',
          }}
        >
          <Canvas
            pixelRatio={Math.min(2, isMobile ? window.devicePixelRatio : 1)}
            camera={{ fov: 80, position: [0, 0, 50] }}
            onMouseMove={onMouseMove}
            onMouseUp={() => set(false)}
            onMouseDown={() => set(true)}
          >
            <fog attach='fog' args={['white', 1, 1000]} />
            {/* <ambientLight intensity={1} /> */}
            {/* <Particles count={200} mouse={mouse} /> */}
            <Petals
              stems={stems}
              iterations={iterations}
              mouse={mouse}
              color={color}
              seed={seed}
            />
            {/* <Sparks
            count={10}
            mouse={mouse}
            colors={[
              '#A2CCB6',
              '#FCEEB5',
              '#EE786E',
              '#e0feff',
              'lightpink',
              'lightblue',
            ]}
          /> */}
            <pointLight distance={40} intensity={10} color='white' />
          </Canvas>
        </div>
        <div className='data-text top-left-data-text'>Seed {seed}</div>
        <div className='data-text top-right-data-text'>
          Iterations {iterations}
        </div>
        <div className='data-text bottom-left-data-text'>Stems {stems}</div>
      </Tilt>
      <style jsx>{`
        .data-text {
          font-family: var(--monofont);
          font-weight: 300;
          position: absolute;
          transform: translateZ(40px);
          font-size: 0.9rem;
          text-transform: uppercase;
        }
        .top-left-data-text {
          left: 8%;
          top: 8%;
        }
        .top-right-data-text {
          right: 8%;
          top: 8%;
        }
        .bottom-left-data-text {
          left: 8%;
          bottom: 8%;
        }
      `}</style>
    </>
  )
}

export default Flower
