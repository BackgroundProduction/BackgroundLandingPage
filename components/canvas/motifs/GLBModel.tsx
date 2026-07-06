"use client";

import { useMemo, useRef } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface GLBModelProps {
  url: string;
  modelScale?: number;
  /** offset applied to the model inside the group (recenter base-origin models) */
  modelOffset?: [number, number, number];
  /** idle spin speed, radians/s around Y (0 = none) */
  spin?: number;
  /** idle vertical bob amplitude (0 = none) */
  float?: number;
  /** phase offset so multiple instances don't move in sync */
  phase?: number;
}

/**
 * Generic loaded-model motif: clones the GLTF scene (so the same file can
 * appear multiple times) and adds gentle idle spin/float motion.
 */
export default function GLBModel({
  url,
  modelScale = 1,
  modelOffset = [0, 0, 0],
  spin = 0,
  float = 0,
  phase = 0,
  ...props
}: GLBModelProps & ThreeElements["group"]) {
  const inner = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useFrame((state) => {
    if (!inner.current) return;
    const t = state.clock.elapsedTime + phase;
    if (spin) inner.current.rotation.y = t * spin;
    if (float) inner.current.position.y = Math.sin(t * 0.6) * float;
  });

  return (
    <group {...props}>
      <group ref={inner}>
        <primitive object={cloned} scale={modelScale} position={modelOffset} />
      </group>
    </group>
  );
}
