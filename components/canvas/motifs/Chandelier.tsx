"use client";

import { useMemo, useRef } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import {
  createGoldMaterial,
  createCrystalMaterial,
} from "@/components/canvas/materials/materials";

/**
 * Procedural crystal chandelier: gold torus tiers hung with instanced
 * crystal drops, a central stem, and a warm core glow that feeds bloom.
 */
export default function Chandelier(props: ThreeElements["group"]) {
  const group = useRef<THREE.Group>(null);

  const { goldMat, crystalMat, tiers, drops } = useMemo(() => {
    const goldMat = createGoldMaterial();
    const crystalMat = createCrystalMaterial();

    const tiers = [
      { radius: 1.5, y: 0, count: 24 },
      { radius: 1.05, y: 0.55, count: 16 },
      { radius: 0.6, y: 1.05, count: 10 },
    ];

    const drops: { position: [number, number, number]; scale: number }[] = [];
    for (const tier of tiers) {
      for (let i = 0; i < tier.count; i++) {
        const a = (i / tier.count) * Math.PI * 2;
        drops.push({
          position: [
            Math.cos(a) * tier.radius,
            tier.y - 0.14 - (i % 3) * 0.05,
            Math.sin(a) * tier.radius,
          ],
          scale: 0.035 + (i % 3) * 0.012,
        });
      }
    }
    return { goldMat, crystalMat, tiers, drops };
  }, []);

  const instRef = useRef<THREE.InstancedMesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = t * 0.08;
      group.current.rotation.z = Math.sin(t * 0.4) * 0.015;
    }
    if (instRef.current && !instRef.current.userData.filled) {
      const m = new THREE.Matrix4();
      drops.forEach((d, i) => {
        m.makeScale(d.scale, d.scale * 1.8, d.scale);
        m.setPosition(d.position[0], d.position[1], d.position[2]);
        instRef.current!.setMatrixAt(i, m);
      });
      instRef.current.instanceMatrix.needsUpdate = true;
      instRef.current.userData.filled = true;
    }
  });

  return (
    <group {...props} ref={group}>
      {/* central stem */}
      <mesh material={goldMat} position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 2.4, 12]} />
      </mesh>
      <mesh material={goldMat} position={[0, 2.05, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
      </mesh>
      {/* gold tiers */}
      {tiers.map((tier, i) => (
        <mesh key={i} material={goldMat} position={[0, tier.y, 0]}>
          <torusGeometry args={[tier.radius, 0.035, 12, 64]} />
        </mesh>
      ))}
      {/* crystal drops */}
      <instancedMesh
        ref={instRef}
        args={[undefined, undefined, drops.length]}
        material={crystalMat}
      >
        <octahedronGeometry args={[1, 0]} />
      </instancedMesh>
      {/* warm emissive core — drives the bloom halo */}
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshBasicMaterial color="#ffd9a0" toneMapped={false} />
      </mesh>
      <pointLight
        position={[0, 0.35, 0]}
        color="#ffcf8a"
        intensity={14}
        distance={12}
        decay={2}
      />
    </group>
  );
}
