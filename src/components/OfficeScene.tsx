import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { CUSTOMER_ORDERS, type CustomerProfile } from '../data/customers'
import { useGameStore } from '../store/gameStore'
import { useProfileStore } from '../store/profileStore'

interface OfficeSceneProps {
  onOpenOrder: () => void
}

interface TalkTarget {
  name: string
  line: string
}

interface PersonProps {
  position: [number, number, number]
  shirt: string
  hair: string
  skin: string
  headset?: boolean
  phase?: number
  talk?: TalkTarget
  onTalk?: (target: TalkTarget) => void
}

interface PersonAppearance {
  shirt: string
  hair: string
  skin: string
}

function FlatMaterial({ color }: { color: string }) {
  return <meshStandardMaterial color={color} flatShading roughness={0.92} />
}

function Led({
  position,
  phase,
}: {
  position: [number, number, number]
  phase: number
}) {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)

  useFrame(({ clock }) => {
    if (!materialRef.current) return
    materialRef.current.emissiveIntensity =
      0.7 + Math.sin(clock.getElapsedTime() * 2.4 + phase) * 0.55
  })

  return (
    <mesh position={position}>
      <sphereGeometry args={[0.035, 6, 5]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#a3e635"
        emissive="#a3e635"
        emissiveIntensity={1}
        flatShading
        roughness={0.6}
      />
    </mesh>
  )
}

function LowPolyPerson({
  position,
  shirt,
  hair,
  skin,
  headset = false,
  phase = 0,
  talk,
  onTalk,
}: PersonProps) {
  const bodyRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (!hovered) return
    document.body.style.cursor = 'pointer'
    return () => {
      document.body.style.cursor = ''
    }
  }, [hovered])

  useFrame(({ clock }) => {
    if (!bodyRef.current) return
    const time = clock.getElapsedTime()
    bodyRef.current.position.y = Math.sin(time * 1.45 + phase) * 0.012
    bodyRef.current.rotation.y = Math.sin(time * 0.55 + phase) * 0.035
  })

  return (
    <group
      position={position}
      onClick={(event: ThreeEvent<MouseEvent>) => {
        if (!talk) return
        event.stopPropagation()
        onTalk?.(talk)
      }}
      onPointerOver={(event: ThreeEvent<PointerEvent>) => {
        if (!talk) return
        event.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      <group ref={bodyRef}>
        <mesh position={[0, 0.32, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.13, 0.6, 7]} />
          <FlatMaterial color="#2f3a48" />
        </mesh>
        <mesh position={[0.22, 0.32, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.13, 0.6, 7]} />
          <FlatMaterial color="#2f3a48" />
        </mesh>
        <mesh position={[0, 0.96, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.38, 0.82, 8]} />
          <FlatMaterial color={shirt} />
        </mesh>
        <mesh position={[-0.39, 1.02, 0]} rotation={[0, 0, -0.18]} castShadow>
          <cylinderGeometry args={[0.075, 0.085, 0.62, 7]} />
          <FlatMaterial color={shirt} />
        </mesh>
        <mesh position={[0.39, 1.02, 0]} rotation={[0, 0, 0.18]} castShadow>
          <cylinderGeometry args={[0.075, 0.085, 0.62, 7]} />
          <FlatMaterial color={shirt} />
        </mesh>
        <mesh position={[0, 1.62, 0]} castShadow>
          <sphereGeometry args={[0.34, 12, 8]} />
          <FlatMaterial color={skin} />
        </mesh>
        <mesh position={[0, 1.79, -0.02]} scale={[1.05, 0.65, 1.05]} castShadow>
          <sphereGeometry args={[0.35, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <FlatMaterial color={hair} />
        </mesh>
        <mesh position={[-0.12, 1.63, 0.31]}>
          <sphereGeometry args={[0.035, 6, 5]} />
          <FlatMaterial color="#2b2f36" />
        </mesh>
        <mesh position={[0.12, 1.63, 0.31]}>
          <sphereGeometry args={[0.035, 6, 5]} />
          <FlatMaterial color="#2b2f36" />
        </mesh>
        {headset ? (
          <>
            <mesh position={[0, 1.83, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.4, 0.025, 6, 18, Math.PI]} />
              <FlatMaterial color="#1e2936" />
            </mesh>
            <mesh position={[-0.42, 1.66, 0]}>
              <sphereGeometry args={[0.075, 6, 5]} />
              <FlatMaterial color="#1e2936" />
            </mesh>
            <mesh position={[0.42, 1.66, 0]}>
              <sphereGeometry args={[0.075, 6, 5]} />
              <FlatMaterial color="#1e2936" />
            </mesh>
          </>
        ) : null}
      </group>
      <mesh
        visible={hovered}
        position={[0, 0.025, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.44, 0.54, 18]} />
        <meshBasicMaterial
          color="#0f766e"
          transparent
          opacity={0.38}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

function Cat({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const time = clock.getElapsedTime()
    groupRef.current.position.y = Math.sin(time * 1.8) * 0.015
    groupRef.current.rotation.y = Math.sin(time * 0.7) * 0.14
  })

  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 0.25, 0]} scale={[0.9, 0.7, 1.35]} castShadow>
        <sphereGeometry args={[0.24, 10, 7]} />
        <FlatMaterial color="#6b5b95" />
      </mesh>
      <mesh position={[0, 0.52, 0.24]} castShadow>
        <sphereGeometry args={[0.22, 10, 7]} />
        <FlatMaterial color="#7e6aa8" />
      </mesh>
      <mesh position={[-0.13, 0.72, 0.24]} rotation={[0, 0, -0.2]}>
        <coneGeometry args={[0.08, 0.18, 4]} />
        <FlatMaterial color="#6b5b95" />
      </mesh>
      <mesh position={[0.13, 0.72, 0.24]} rotation={[0, 0, 0.2]}>
        <coneGeometry args={[0.08, 0.18, 4]} />
        <FlatMaterial color="#6b5b95" />
      </mesh>
      <mesh position={[-0.08, 0.55, 0.43]}>
        <sphereGeometry args={[0.03, 6, 5]} />
        <FlatMaterial color="#1e2936" />
      </mesh>
      <mesh position={[0.08, 0.55, 0.43]}>
        <sphereGeometry args={[0.03, 6, 5]} />
        <FlatMaterial color="#1e2936" />
      </mesh>
      <mesh position={[0.24, 0.3, -0.1]} rotation={[0, 0, 0.9]}>
        <cylinderGeometry args={[0.025, 0.04, 0.5, 6]} />
        <FlatMaterial color="#6b5b95" />
      </mesh>
    </group>
  )
}

function Desk({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[1.8, 0.1, 0.85]} />
        <FlatMaterial color="#b79a74" />
      </mesh>
      <mesh position={[-0.72, 0.35, 0]}>
        <boxGeometry args={[0.09, 0.7, 0.07]} />
        <FlatMaterial color="#6c5a48" />
      </mesh>
      <mesh position={[0.72, 0.35, 0]}>
        <boxGeometry args={[0.09, 0.7, 0.07]} />
        <FlatMaterial color="#6c5a48" />
      </mesh>
      <mesh position={[-0.35, 1.05, -0.12]} castShadow>
        <boxGeometry args={[0.62, 0.42, 0.06]} />
        <FlatMaterial color="#2f3947" />
      </mesh>
      <mesh position={[-0.35, 1.05, -0.16]}>
        <boxGeometry args={[0.5, 0.32, 0.01]} />
        <FlatMaterial color="#7dd3fc" />
      </mesh>
      <mesh position={[0.4, 0.82, 0.14]}>
        <boxGeometry args={[0.45, 0.05, 0.2]} />
        <FlatMaterial color="#e7e2d7" />
      </mesh>
    </group>
  )
}

function ServerRack({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[1.25, 2.3, 0.7]} />
        <FlatMaterial color="#39424f" />
      </mesh>
      {[0.35, 0.88, 1.41, 1.94].map((height) => (
        <group key={height}>
          <mesh position={[0, height, 0.37]}>
            <boxGeometry args={[1.02, 0.34, 0.04]} />
            <FlatMaterial color="#1f2936" />
          </mesh>
          <mesh position={[-0.34, height, 0.4]}>
            <boxGeometry args={[0.2, 0.04, 0.02]} />
            <FlatMaterial color="#7dd3fc" />
          </mesh>
          <Led position={[0.32, height, 0.4]} phase={height * 3} />
        </group>
      ))}
    </group>
  )
}

function Plant({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.8) * 0.025
  })

  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.22, 0.17, 0.5, 8]} />
        <FlatMaterial color="#b7791f" />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <sphereGeometry args={[0.35, 8, 6]} />
        <FlatMaterial color="#4d7c0f" />
      </mesh>
      <mesh position={[0.2, 0.95, 0.05]}>
        <sphereGeometry args={[0.22, 8, 6]} />
        <FlatMaterial color="#65a30d" />
      </mesh>
    </group>
  )
}

function OrderBoard({
  onOpenOrder,
}: {
  onOpenOrder: () => void
}) {
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : ''
    return () => {
      document.body.style.cursor = ''
    }
  }, [hovered])

  return (
    <group
      position={[0, 0, -2.55]}
      scale={hovered ? 1.03 : 1}
      onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation()
        onOpenOrder()
      }}
      onPointerOver={(event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[0.12, 1.44, 0.12]} />
        <FlatMaterial color="#6c5a48" />
      </mesh>
      <mesh position={[0, 1.52, 0]} castShadow>
        <boxGeometry args={[2.1, 1.25, 0.14]} />
        <FlatMaterial color="#2f3a48" />
      </mesh>
      <mesh position={[0, 1.52, 0.08]}>
        <boxGeometry args={[1.86, 1.02, 0.03]} />
        <FlatMaterial color={hovered ? '#fde68a' : '#f8f5ed'} />
      </mesh>
      <mesh position={[-0.35, 1.72, 0.11]}>
        <boxGeometry args={[0.62, 0.09, 0.01]} />
        <FlatMaterial color="#0f766e" />
      </mesh>
      <mesh position={[-0.35, 1.52, 0.11]}>
        <boxGeometry args={[0.5, 0.06, 0.01]} />
        <FlatMaterial color="#8b96a3" />
      </mesh>
      <mesh position={[-0.35, 1.38, 0.11]}>
        <boxGeometry args={[0.58, 0.06, 0.01]} />
        <FlatMaterial color="#8b96a3" />
      </mesh>
      <mesh position={[0.48, 1.5, 0.11]} rotation={[0, 0, -0.08]}>
        <boxGeometry args={[0.26, 0.24, 0.01]} />
        <FlatMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <boxGeometry args={[0.28, 0.28, 0.3]} />
        <FlatMaterial color="#6c5a48" />
      </mesh>
      <mesh position={[0, 0.92, 0.06]}>
        <boxGeometry args={[0.7, 0.06, 0.35]} />
        <FlatMaterial color="#b79a74" />
      </mesh>
    </group>
  )
}

function WalkingCustomer({
  customer,
  onTalk,
}: {
  customer: CustomerProfile
  onTalk: (target: TalkTarget) => void
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const progress = Math.min(1, Math.max(0, (clock.getElapsedTime() - 1.2) / 3))
    const eased = progress * progress * (3 - 2 * progress)
    groupRef.current.position.x = THREE.MathUtils.lerp(-4.1, -1.45, eased)
    groupRef.current.position.z = THREE.MathUtils.lerp(2.15, -1.35, eased)
  })

  return (
    <group ref={groupRef} position={[-4.1, 0, 2.15]}>
      <LowPolyPerson
        position={[0, 0, 0]}
        shirt={customer.shirt}
        hair={customer.hair}
        skin={customer.skin}
        phase={2.4}
        talk={{ name: customer.name, line: customer.line }}
        onTalk={onTalk}
      />
    </group>
  )
}

function IsoCamera() {
  const { camera, size } = useThree()

  useEffect(() => {
    camera.position.set(9, 9, 9)
    camera.lookAt(0, 0.6, 0)
    if (camera instanceof THREE.OrthographicCamera) {
      camera.zoom = Math.min(size.width, size.height) / 11.8
      camera.updateProjectionMatrix()
    }
  }, [camera, size.height, size.width])

  return null
}

const IGA: PersonAppearance = {
  shirt: '#0f766e',
  hair: '#2b2f36',
  skin: '#f2c6a0',
}

export function OfficeScene({ onOpenOrder }: OfficeSceneProps) {
  const levelId = useGameStore((state) => state.levelId)
  const orderAccepted = useGameStore((state) => state.orderAccepted)
  const upgrades = useProfileStore((state) => state.profile.upgrades)
  const [speech, setSpeech] = useState<TalkTarget | null>(null)
  const customerOrder = CUSTOMER_ORDERS[levelId]?.customer

  const igaTalk: TalkTarget = {
    name: 'Iga',
    line: 'Papan order ada di tengah ruangan. Aku siap berangkat.',
  }
  const raniTalk: TalkTarget = {
    name: 'Mbak Rani',
    line: 'Kabel cadangan ada di lemari. Jangan disambung dengan selotip, ya.',
  }
  const darmaTalk: TalkTarget = {
    name: 'Pak Darma',
    line: 'Periksa gateway dulu sebelum menyalahkan kabel.',
  }

  return (
    <div className="office-hub">
      <Canvas
        orthographic
        dpr={[1, 1.5]}
        camera={{ position: [9, 9, 9], zoom: 62, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ camera }) => camera.lookAt(0, 0.6, 0)}
      >
        <color attach="background" args={['#f7f4ec']} />
        <ambientLight intensity={1.55} />
        <directionalLight position={[4, 8, 5]} intensity={1.25} />
        <IsoCamera />

        <mesh position={[0, -0.2, 0]} receiveShadow>
          <boxGeometry args={[11, 0.4, 8]} />
          <FlatMaterial color="#e5ded0" />
        </mesh>
        <mesh position={[0, 0.025, 0]}>
          <boxGeometry args={[6.5, 0.04, 3.6]} />
          <FlatMaterial color="#d9e8e2" />
        </mesh>
        <mesh position={[0, 2.2, -3.8]}>
          <boxGeometry args={[11, 4.4, 0.25]} />
          <FlatMaterial color="#fbf8f0" />
        </mesh>
        <mesh position={[-5.4, 2.2, 0]}>
          <boxGeometry args={[0.25, 4.4, 8]} />
          <FlatMaterial color="#f1ece1" />
        </mesh>

        <Desk position={[-3.1, 0, -2.1]} />
        <Desk position={[3.2, 0, -2.1]} />
        <ServerRack position={[3.8, 0, -3.1]} />
        <Plant position={[-4.5, 0, -3.1]} />
        <Plant position={[4.7, 0, -2.9]} />
        <OrderBoard onOpenOrder={onOpenOrder} />

        {upgrades.cableTray ? (
          <group position={[0, 0.08, 2.7]}>
            <mesh>
              <boxGeometry args={[6.2, 0.12, 0.45]} />
              <FlatMaterial color="#6c5a48" />
            </mesh>
            <mesh position={[-1.4, 0.09, 0]}>
              <boxGeometry args={[1.4, 0.04, 0.18]} />
              <FlatMaterial color="#0f766e" />
            </mesh>
            <mesh position={[1.6, 0.09, 0]}>
              <boxGeometry args={[1.2, 0.04, 0.18]} />
              <FlatMaterial color="#0f766e" />
            </mesh>
          </group>
        ) : null}

        {upgrades.ups ? (
          <mesh position={[2.7, 0.3, -2.55]}>
            <boxGeometry args={[0.8, 0.6, 0.5]} />
            <FlatMaterial color="#0f766e" />
          </mesh>
        ) : null}

        <LowPolyPerson
          position={[0, 0, 0.7]}
          shirt={IGA.shirt}
          hair={IGA.hair}
          skin={IGA.skin}
          headset
          phase={0.2}
          talk={igaTalk}
          onTalk={setSpeech}
        />
        <LowPolyPerson
          position={[-2.2, 0, 0.1]}
          shirt="#b7791f"
          hair="#3c2a21"
          skin="#e8b98c"
          phase={1.4}
          talk={raniTalk}
          onTalk={setSpeech}
        />
        <LowPolyPerson
          position={[2.2, 0, 0.1]}
          shirt="#6b5b95"
          hair="#252525"
          skin="#d9a273"
          phase={2.7}
          talk={darmaTalk}
          onTalk={setSpeech}
        />
        {customerOrder && !orderAccepted ? (
          <WalkingCustomer customer={customerOrder} onTalk={setSpeech} />
        ) : null}
        <Cat position={[3.3, 0, 1.5]} />

        <mesh position={[-4.2, 0.5, 2.1]}>
          <boxGeometry args={[1.2, 0.8, 0.7]} />
          <FlatMaterial color="#e7e2d7" />
        </mesh>
      </Canvas>

      <div className="office-hub-top">
        <span className="eyebrow">Kantor NetForge</span>
        <strong>Iga siap menerima order</strong>
        <small>Klik karakter untuk menyapa.</small>
      </div>

      {speech ? (
        <div className="office-speech" role="status">
          <div>
            <span>{speech.name}</span>
            <p>{speech.line}</p>
          </div>
          <button onClick={() => setSpeech(null)}>Tutup</button>
        </div>
      ) : null}

      <div className="office-hub-bottom">
        <div>
          <span className="office-hub-label">Papan order</span>
          <p>Klik papan di ruangan atau tombol ini untuk melihat pekerjaan.</p>
        </div>
        <button className="office-order-button" onClick={onOpenOrder}>
          Buka papan order
        </button>
      </div>
    </div>
  )
}







