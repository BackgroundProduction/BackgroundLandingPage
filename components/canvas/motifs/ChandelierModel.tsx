"use client";

import { useRef } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * Poly Haven "Chandelier 03" (CC0, polyhaven.com/a/Chandelier_03) — optimized
 * to 498KB via gltf-transform. Same idle sway + warm bloom core as the
 * procedural version, so scenes can swap between them freely.
 */
export default function ChandelierModel(props: ThreeElements["group"]) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/chandelier.glb");

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = t * 0.08;
      group.current.rotation.z = Math.sin(t * 0.4) * 0.015;
    }
  });

  return (
    <group {...props} ref={group}>
      <primitive object={scene} scale={2.4} position={[0, -1.2, 0]} />
      {/* warm emissive core — drives the bloom halo, nested in the body */}
      <mesh position={[0, -2.5, 0]}>
        <sphereGeometry args={[0.14, 24, 24]} />
        <meshBasicMaterial color="#ffd9a0" toneMapped={false} />
      </mesh>
      <pointLight
        position={[0, -2.35, 0]}
        color="#ffcf8a"
        intensity={14}
        distance={12}
        decay={2}
      />
    </group>
  );
}

useGLTF.preload("/models/chandelier.glb");
