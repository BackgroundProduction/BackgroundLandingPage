"use client";

import { useMemo, useRef } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { createGoldMaterial } from "@/components/canvas/materials/materials";

/** Gold laurel wreath: torus base ringed with instanced leaf blades. */
export default function LaurelWreath(props: ThreeElements["group"]) {
  const group = useRef<THREE.Group>(null);
  const instRef = useRef<THREE.InstancedMesh>(null);

  const { goldMat, leafGeometry, transforms } = useMemo(() => {
    const goldMat = createGoldMaterial(true);

    // simple leaf blade: squashed cone
    const leafGeometry = new THREE.ConeGeometry(0.055, 0.34, 4);
    leafGeometry.scale(1, 1, 0.35);

    const transforms: THREE.Matrix4[] = [];
    const R = 1.1;
    const perSide = 22;
    // two arcs sweeping up from the bottom, like a classical wreath
    for (const dir of [1, -1]) {
      for (let i = 0; i < perSide; i++) {
        const a = -Math.PI / 2 + dir * (i / perSide) * (Math.PI * 0.92);
        const m = new THREE.Matrix4();
        const pos = new THREE.Vector3(Math.cos(a) * R, Math.sin(a) * R, 0);
        const rot = new THREE.Euler(0, 0, a + (dir > 0 ? 0.9 : -0.9 + Math.PI));
        const scale = 0.85 + (i % 3) * 0.18;
        m.compose(
          pos,
          new THREE.Quaternion().setFromEuler(rot),
          new THREE.Vector3(scale, scale, scale)
        );
        transforms.push(m);
      }
    }
    return { goldMat, leafGeometry, transforms };
  }, []);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.25;
    }
    if (instRef.current && !instRef.current.userData.filled) {
      transforms.forEach((m, i) => instRef.current!.setMatrixAt(i, m));
      instRef.current.instanceMatrix.needsUpdate = true;
      instRef.current.userData.filled = true;
    }
  });

  return (
    <group {...props} ref={group}>
      <mesh material={goldMat}>
        <torusGeometry args={[1.1, 0.028, 10, 72]} />
      </mesh>
      <instancedMesh
        ref={instRef}
        args={[leafGeometry, goldMat, transforms.length]}
      />
    </group>
  );
}
