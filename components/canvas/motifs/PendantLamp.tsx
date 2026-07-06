"use client";

import { useRef } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * Poly Haven "Modern Ceiling Lamp 01" (CC0) — hero centerpiece.
 * Gentle pendulum sway + warm glow disc under the shade feeding bloom.
 * Model bounds: ~0.43m wide, y 0.22–1.17 (cable top), origin below shade.
 */
export default function PendantLamp(props: ThreeElements["group"]) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/pendant-lamp.glb");

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.z = Math.sin(t * 0.35) * 0.04;
      group.current.rotation.y = t * 0.1;
    }
  });

  return (
    <group {...props} ref={group}>
      <primitive object={scene} scale={2.5} position={[0, -2.5, 0]} />
      {/* warm light source at the shade opening — drives the bloom halo */}
      <mesh position={[0, -1.98, 0]}>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshBasicMaterial color="#ffd9a0" toneMapped={false} />
      </mesh>
      <pointLight
        position={[0, -2.1, 0]}
        color="#ffcf8a"
        intensity={14}
        distance={12}
        decay={2}
      />
    </group>
  );
}

useGLTF.preload("/models/pendant-lamp.glb");
