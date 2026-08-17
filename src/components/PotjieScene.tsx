import { ContactShadows } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import type { ExperienceTier } from '../lib/experience';

type PotjieSceneProps = {
  tier: ExperienceTier;
  animate: boolean;
};

type PawProps = {
  position: [number, number, number];
  scale?: number;
  opacity?: number;
};

function SteamPaw({ position, scale = 1, opacity = 0.5 }: PawProps) {
  const material = {
    color: '#fff4d2',
    emissive: '#ffd65a',
    emissiveIntensity: 0.35,
    transparent: true,
    opacity,
    roughness: 0.45,
  } as const;

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0, 0]} scale={[1.25, 1, 0.7]}>
        <sphereGeometry args={[0.18, 16, 12]} />
        <meshStandardMaterial {...material} />
      </mesh>
      {[
        [-0.2, 0.22, 0],
        [-0.07, 0.31, 0],
        [0.08, 0.31, 0],
        [0.21, 0.22, 0],
      ].map((toe, index) => (
        <mesh key={index} position={toe as [number, number, number]} scale={[0.8, 1, 0.7]}>
          <sphereGeometry args={[0.09, 12, 10]} />
          <meshStandardMaterial {...material} />
        </mesh>
      ))}
    </group>
  );
}

function PotjieModel({ tier, animate }: PotjieSceneProps) {
  const group = useRef<THREE.Group>(null);
  const segments = tier === 'full' ? 64 : 36;

  useFrame((state, delta) => {
    if (!animate || !group.current) return;

    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      -0.2 + state.pointer.x * 0.16,
      4,
      delta,
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      state.pointer.y * -0.07,
      4,
      delta,
    );
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      Math.sin(state.clock.elapsedTime * 0.9) * 0.07,
      3.5,
      delta,
    );
  });

  return (
    <group ref={group} rotation={[0, -0.2, 0]}>
      <mesh scale={[1.12, 0.86, 1.12]} castShadow receiveShadow>
        <sphereGeometry args={[1.34, segments, Math.max(18, Math.floor(segments / 2))]} />
        <meshStandardMaterial color="#25180f" roughness={0.72} metalness={0.08} />
      </mesh>

      <mesh position={[0, 0.93, 0]} castShadow>
        <cylinderGeometry args={[1.16, 1.36, 0.18, segments]} />
        <meshStandardMaterial color="#3a2719" roughness={0.64} metalness={0.1} />
      </mesh>

      <mesh position={[0, 1.14, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.31, 0.075, 12, 32, Math.PI]} />
        <meshStandardMaterial color="#25180f" roughness={0.62} />
      </mesh>

      {[
        [-0.72, -1.18, 0.03, -0.18],
        [0.72, -1.18, 0.03, 0.18],
        [0, -1.18, 0.58, 0],
      ].map(([x, y, z, angle], index) => (
        <mesh key={index} position={[x, y, z]} rotation={[0, 0, angle]} castShadow>
          <cylinderGeometry args={[0.075, 0.105, 0.76, 12]} />
          <meshStandardMaterial color="#25180f" roughness={0.78} />
        </mesh>
      ))}

      <SteamPaw position={[-0.55, 1.65, 0.1]} scale={0.8} opacity={0.38} />
      <SteamPaw position={[0.05, 2.0, -0.05]} scale={0.62} opacity={0.28} />
      <SteamPaw position={[0.6, 1.55, 0]} scale={0.74} opacity={0.34} />
    </group>
  );
}

export function PotjieScene({ tier, animate }: PotjieSceneProps) {
  const dpr: number | [number, number] = tier === 'full' ? [1, 1.5] : [1, 1.2];

  return (
    <div className="three-stage" aria-hidden="true">
      <Canvas
        dpr={dpr}
        shadows={tier === 'full'}
        frameloop={animate ? 'always' : 'demand'}
        camera={{ position: [0, 0.7, 5.5], fov: 37 }}
        gl={{ alpha: true, antialias: tier === 'full', powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={1.35} />
        <directionalLight position={[3, 5, 4]} intensity={2.6} color="#fff5dc" castShadow={tier === 'full'} />
        <pointLight position={[-3, 1, 2]} intensity={22} distance={8} color="#e95532" />
        <pointLight position={[2, 2, -2]} intensity={18} distance={7} color="#ffd65a" />
        <PotjieModel tier={tier} animate={animate} />
        <ContactShadows
          position={[0, -1.62, 0]}
          opacity={0.28}
          scale={5}
          blur={2.4}
          far={3}
          frames={animate ? Infinity : 1}
        />
      </Canvas>
    </div>
  );
}
