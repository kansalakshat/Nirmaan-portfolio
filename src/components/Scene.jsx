import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { scrollState, reduced } from '../lib/scroll'

const ORANGE = '#ff6b00'
const PAPER = '#0a0908'

/* Pointer lives outside React: the canvas is pointer-events:none so the page
   underneath stays clickable, which means r3f never sees the mouse itself. */
const pointer = { x: 0, y: 0 }

function roundedSlab(w, h, r, depth) {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + h - r)
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h)
  s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r)
  s.quadraticCurveTo(x, y, x + r, y)
  const g = new THREE.ExtrudeGeometry(s, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.08,
    bevelSegments: 4,
    curveSegments: 10,
  })
  g.translate(0, 0, -depth / 2)
  return g
}

/* The Nirmaan mark, measured off the logo: a left bar, a diagonal, a right
   bar, and two slabs fanned out behind it. Units are ~1/100 of logo pixels. */
const PIECES = [
  { w: 1.5, h: 5.55, pos: [-2.1, 0.13, 0], rot: 0 },
  { w: 1.6, h: 6.3, pos: [-0.42, 0.12, 0.32], rot: 0.715 },
  { w: 1.17, h: 5.15, pos: [1.26, 0.03, 0], rot: 0 },
  { w: 1.17, h: 5.0, pos: [1.82, -0.41, -0.55], rot: 0 },
  { w: 1.17, h: 4.43, pos: [2.24, -0.63, -1.1], rot: 0 },
]

function Logo() {
  const group = useRef()
  const ghost = useRef()
  const viewport = useThree((s) => s.viewport)
  const narrow = viewport.aspect < 0.9

  const geos = useMemo(() => PIECES.map((p) => roundedSlab(p.w, p.h, 0.42, 0.7)), [])
  const edges = useMemo(() => geos.map((g) => new THREE.EdgesGeometry(g, 30)), [geos])

  useFrame(({ clock, camera }) => {
    const g = group.current
    const t = clock.getElapsedTime()
    const h = reduced ? 0 : window.scrollY / window.innerHeight

    /* Scrolling out of the hero, the mark rushes the camera and whips past the
       right edge. It must never pass *through* the lens: a frame filled with
       orange behind body text fails contrast. */
    const baseX = narrow ? 0 : 5.7
    const baseY = narrow ? 2.4 : 0
    g.position.x = baseX + h * h * 9
    g.position.y = baseY + h * 1.5 + (reduced ? 0 : Math.sin(t * 0.8) * 0.15)
    g.scale.setScalar((narrow ? 0.5 : 0.7) * (1 + h * 0.4))

    // Idle sway + cursor lean + one full spin as the hero scrolls away
    const targetY = -0.35 + Math.sin(t * 0.4) * 0.18 + pointer.x * 0.35 + h * Math.PI * 1.1
    const targetX = 0.12 - pointer.y * 0.25 + h * 0.4
    g.rotation.y += (targetY - g.rotation.y) * 0.06
    g.rotation.x += (targetX - g.rotation.x) * 0.06

    // Once the camera has flown past, stop drawing it
    g.visible = camera.position.z > g.position.z + 0.5

    // Hologram twin jitters with scroll speed
    const v = Math.min(Math.abs(scrollState.velocity), 60)
    ghost.current.position.set(0.12 + v * 0.01, -0.06, -0.45 - v * 0.02)
    ghost.current.children.forEach((c) => (c.material.opacity = 0.22 + v * 0.008))
  })

  return (
    <group ref={group}>
      {PIECES.map((p, i) => (
        <mesh key={i} geometry={geos[i]} position={p.pos} rotation={[0, 0, p.rot]}>
          <meshStandardMaterial color={ORANGE} roughness={0.36} metalness={0.28} envMapIntensity={0.9} />
        </mesh>
      ))}
      <group ref={ghost}>
        {PIECES.map((p, i) => (
          <lineSegments key={i} geometry={edges[i]} position={p.pos} rotation={[0, 0, p.rot]}>
            <lineBasicMaterial color={ORANGE} transparent opacity={0.25} />
          </lineSegments>
        ))}
      </group>
    </group>
  )
}

/* Stars as short line segments. At rest they are dots; scroll fast and they
   stretch into warp streaks pointing down the tunnel. */
function Warp({ count }) {
  const ref = useRef()
  const { positions, seeds } = useMemo(() => {
    const seeds = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2
      const r = 3 + Math.random() * 26
      seeds[i * 3] = Math.cos(a) * r
      seeds[i * 3 + 1] = Math.sin(a) * r
      seeds[i * 3 + 2] = -Math.random() * 140
    }
    return { positions: new Float32Array(count * 6), seeds }
  }, [count])

  useFrame(({ camera }, dt) => {
    const v = Math.min(Math.abs(scrollState.velocity), 80)
    const speed = reduced ? 0 : 2 + v * 1.4
    const len = 0.08 + v * 0.09
    const camZ = camera.position.z
    for (let i = 0; i < count; i++) {
      let z = seeds[i * 3 + 2] + speed * dt
      // Wrap relative to the camera so the field never runs out
      if (z > camZ + 4) z -= 140
      if (z < camZ - 140) z += 140
      seeds[i * 3 + 2] = z
      const x = seeds[i * 3]
      const y = seeds[i * 3 + 1]
      positions.set([x, y, z, x, y, z - len], i * 6)
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <lineSegments ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count * 2} array={positions} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color="#f4eee6" transparent opacity={0.55} />
    </lineSegments>
  )
}

/* Hexagonal gates down the length of the page */
function Tunnel() {
  const ref = useRef()
  const gates = useMemo(() => Array.from({ length: 30 }, (_, i) => -14 - i * 6.5), [])
  useFrame((_, dt) => {
    if (reduced) return
    ref.current.children.forEach((m, i) => (m.rotation.z += dt * (i % 2 ? 0.12 : -0.08)))
  })
  return (
    <group ref={ref}>
      {gates.map((z, i) => (
        <mesh key={z} position={[0, 0, z]} rotation={[0, 0, i * 0.18]}>
          <torusGeometry args={[9 + (i % 3) * 1.4, 0.035, 4, 6]} />
          <meshBasicMaterial color={ORANGE} transparent opacity={i % 3 === 0 ? 0.7 : 0.3} />
        </mesh>
      ))}
    </group>
  )
}

function Floor() {
  const ref = useRef()
  useEffect(() => {
    ref.current.material.transparent = true
    ref.current.material.opacity = 0.28
  }, [])
  useFrame(({ camera }) => {
    // Snap to grid spacing so the infinite floor never visibly jumps
    ref.current.position.z = Math.round(camera.position.z / 5) * 5 - 60
  })
  return (
    <gridHelper ref={ref} args={[260, 52, ORANGE, '#3a2a1c']} position={[0, -7, -60]} />
  )
}

function CameraRig() {
  useFrame(({ camera }) => {
    const h = reduced ? 0 : window.scrollY / window.innerHeight
    const z = 12 - h * 9
    camera.position.z += (z - camera.position.z) * 0.08
    camera.position.x += (pointer.x * 0.8 - camera.position.x) * 0.04
    camera.position.y += (pointer.y * 0.5 - camera.position.y) * 0.04
    camera.lookAt(camera.position.x * 0.3, camera.position.y * 0.3, camera.position.z - 12)
  })
  return null
}

/* Bloom lifts the orange; the colour split widens with scroll speed, so a
   hard flick of the wheel reads as the ship jumping to warp. */
function Effects() {
  const offset = useMemo(() => new THREE.Vector2(0.0005, 0.0003), [])
  useFrame(() => {
    const v = Math.min(Math.abs(scrollState.velocity), 60) / 60
    offset.set(0.0005 + v * 0.007, 0.0003 + v * 0.004)
  })
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.55} luminanceThreshold={0.42} luminanceSmoothing={0.3} mipmapBlur />
      <ChromaticAberration offset={offset} radialModulation={false} modulationOffset={0} />
      <Vignette darkness={0.65} offset={0.28} />
    </EffectComposer>
  )
}

function Environment() {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = env
    return () => {
      scene.environment = null
      env.dispose()
      pmrem.dispose()
    }
  }, [gl, scene])
  return null
}

export default function Scene() {
  useEffect(() => {
    const move = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])

  const small = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={reduced ? 'demand' : 'always'}
      camera={{ position: [0, 0, 12], fov: 55, near: 0.1, far: 160 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={[PAPER]} />
      <fog attach="fog" args={[PAPER, 18, 85]} />
      <Environment />
      <ambientLight intensity={0.25} />
      <directionalLight position={[6, 8, 8]} intensity={1.6} />
      <pointLight position={[-6, -2, 4]} intensity={30} color={ORANGE} />
      <Logo />
      <Warp count={small ? 700 : 1600} />
      <Tunnel />
      <Floor />
      <CameraRig />
      {!small && !reduced && <Effects />}
    </Canvas>
  )
}
