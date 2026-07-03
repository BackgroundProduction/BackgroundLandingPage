"use client";

import { useMemo, useRef } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { createVelvetMaterial } from "@/components/canvas/materials/materials";
import { useScrollStore } from "@/lib/scroll-store";

interface VelvetCurtainProps {
  /** -1 = left panel, 1 = right panel */
  side: -1 | 1;
  /** how far the panel slides open at full contact progress */
  openDistance?: number;
}

/**
 * Stage curtain panel with sine-fold pleats (vertex displacement baked into
 * the geometry) that parts as the contact section scrolls in.
 */
export default function VelvetCurtain({
  side,
  openDistance = 5.5,
  ...props
}: VelvetCurtainProps & ThreeElements["group"]) {
  const group = useRef<THREE.Group>(null);
  const velvetMat = useMemo(() => createVelvetMaterial(), []);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(5.5, 9, 48, 8);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      // vertical pleats, deeper toward the inner edge
      pos.setZ(i, Math.sin(x * 4.2) * 0.22 + Math.sin(x * 9.1) * 0.08);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const baseX = side * 2.6;

  useFrame((_, delta) => {
    if (!group.current) return;
    const p = useScrollStore.getState().progress.contact;
    // ease the parting so the reveal feels weighty, not linear
    const eased = 1 - Math.pow(1 - Math.min(p * 1.6, 1), 3);
    const damp = 1 - Math.exp(-delta * 3.5);
    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      baseX + side * eased * openDistance,
      damp
    );
  });

  return (
    <group {...props}>
      <group ref={group} position={[baseX, 0, 0]}>
        <mesh geometry={geometry} material={velvetMat} />
      </group>
    </group>
  );
}
