"use client";

import { useMemo } from "react";
import type { ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { createGoldMaterial } from "@/components/canvas/materials/materials";

/** Lectern silhouette: dark body with gold trim lines. */
export default function Podium(props: ThreeElements["group"]) {
  const goldMat = useMemo(() => createGoldMaterial(), []);
  const bodyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#171210",
        roughness: 0.5,
        metalness: 0.3,
      }),
    []
  );

  return (
    <group {...props}>
      <mesh material={bodyMat} position={[0, 0.7, 0]}>
        <boxGeometry args={[0.9, 1.4, 0.55]} />
      </mesh>
      {/* slanted top */}
      <mesh material={bodyMat} position={[0, 1.45, 0.02]} rotation={[-0.35, 0, 0]}>
        <boxGeometry args={[1.0, 0.08, 0.65]} />
      </mesh>
      {/* gold trim */}
      <mesh material={goldMat} position={[0, 1.32, 0.29]}>
        <boxGeometry args={[0.92, 0.035, 0.035]} />
      </mesh>
      <mesh material={goldMat} position={[0, 0.08, 0]}>
        <boxGeometry args={[0.96, 0.05, 0.6]} />
      </mesh>
    </group>
  );
}
