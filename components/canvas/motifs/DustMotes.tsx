"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface DustMotesProps {
  count?: number;
  /** box the motes drift inside */
  bounds?: [number, number, number];
  center?: [number, number, number];
}

/** Slow-drifting gallery dust — instanced points, constant idle motion. */
export default function DustMotes({
  count = 120,
  bounds = [14, 9, 8],
  center = [0, 0, 0],
}: DustMotesProps) {
  const points = useRef<THREE.Points>(null);

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = center[0] + (Math.random() - 0.5) * bounds[0];
      positions[i * 3 + 1] = center[1] + (Math.random() - 0.5) * bounds[1];
      positions[i * 3 + 2] = center[2] + (Math.random() - 0.5) * bounds[2];
      seeds[i] = Math.random() * Math.PI * 2;
    }
    return { positions, seeds };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    const t = state.clock.elapsedTime;
    const pos = points.current.geometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3] += Math.sin(t * 0.1 + seeds[i]) * 0.0012;
      pos[i * 3 + 1] += Math.cos(t * 0.08 + seeds[i] * 1.3) * 0.0009;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#e9c873"
        size={0.035}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
