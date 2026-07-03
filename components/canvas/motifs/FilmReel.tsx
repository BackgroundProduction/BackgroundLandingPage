"use client";

import { useMemo, useRef } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { createGoldMaterial } from "@/components/canvas/materials/materials";

/** Film reel: two flat discs, spoke bars, hub — slow cinematic spin. */
export default function FilmReel(props: ThreeElements["group"]) {
  const group = useRef<THREE.Group>(null);
  const goldMat = useMemo(() => createGoldMaterial(), []);
  const darkMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1f1913",
        roughness: 0.4,
        metalness: 0.7,
      }),
    []
  );

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
  });

  const spokes = [0, 1, 2, 3, 4].map((i) => (i / 5) * Math.PI * 2);

  return (
    <group {...props}>
      <group ref={group}>
        {[-0.14, 0.14].map((z) => (
          <mesh
            key={z}
            material={darkMat}
            position={[0, 0, z]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.9, 0.9, 0.04, 48]} />
          </mesh>
        ))}
        {spokes.map((a) => (
          <mesh
            key={a}
            material={goldMat}
            position={[Math.cos(a) * 0.45, Math.sin(a) * 0.45, 0]}
            rotation={[0, 0, a + Math.PI / 2]}
          >
            <boxGeometry args={[0.09, 0.72, 0.24]} />
          </mesh>
        ))}
        <mesh material={goldMat} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.34, 24]} />
        </mesh>
        <mesh material={goldMat}>
          <torusGeometry args={[0.9, 0.03, 10, 64]} />
        </mesh>
      </group>
    </group>
  );
}
