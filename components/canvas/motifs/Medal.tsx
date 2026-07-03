"use client";

import { useMemo, useRef } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import {
  createGoldMaterial,
  createVelvetMaterial,
} from "@/components/canvas/materials/materials";

/** Award medal on an oxblood ribbon, gently swinging. */
export default function Medal({
  spinOffset = 0,
  ...props
}: { spinOffset?: number } & ThreeElements["group"]) {
  const group = useRef<THREE.Group>(null);
  const goldMat = useMemo(() => createGoldMaterial(true), []);
  const velvetMat = useMemo(() => createVelvetMaterial(), []);

  useFrame((state) => {
    if (group.current) {
      const t = state.clock.elapsedTime + spinOffset;
      group.current.rotation.y = Math.sin(t * 0.5) * 0.5;
      group.current.rotation.z = Math.sin(t * 0.35) * 0.06;
    }
  });

  return (
    <group {...props} ref={group}>
      {/* ribbon */}
      <mesh material={velvetMat} position={[0, 0.62, 0]} rotation={[0.08, 0, 0]}>
        <boxGeometry args={[0.22, 0.85, 0.02]} />
      </mesh>
      {/* disc */}
      <mesh material={goldMat} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.06, 40]} />
      </mesh>
      <mesh material={goldMat} position={[0, 0, 0.035]}>
        <torusGeometry args={[0.28, 0.02, 8, 40]} />
      </mesh>
      {/* star relief */}
      <mesh material={goldMat} position={[0, 0, 0.045]}>
        <circleGeometry args={[0.12, 5]} />
      </mesh>
    </group>
  );
}
