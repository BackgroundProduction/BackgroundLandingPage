"use client";

import { useMemo, useRef } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { createGoldMaterial } from "@/components/canvas/materials/materials";

interface StageSpotlightProps {
  /** direction the beam leans, radians around Z */
  tilt?: number;
  beamColor?: string;
  sway?: boolean;
}

/**
 * Ornate stage light: gold housing + fake-volumetric beam (additive cone).
 * Real volumetric lighting is too expensive — an additive-blended cone with
 * bloom reads as a light shaft at a fraction of the cost.
 */
export default function StageSpotlight({
  tilt = 0.3,
  beamColor = "#ffd9a0",
  sway = true,
  ...props
}: StageSpotlightProps & ThreeElements["group"]) {
  const group = useRef<THREE.Group>(null);
  const goldMat = useMemo(() => createGoldMaterial(), []);

  const beamMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: beamColor,
        transparent: true,
        opacity: 0.07,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
        toneMapped: false,
      }),
    [beamColor]
  );

  useFrame((state) => {
    if (group.current && sway) {
      group.current.rotation.z =
        tilt + Math.sin(state.clock.elapsedTime * 0.35) * 0.08;
    }
  });

  return (
    <group {...props}>
      <group ref={group} rotation={[0, 0, tilt]}>
        {/* housing */}
        <mesh material={goldMat}>
          <cylinderGeometry args={[0.22, 0.3, 0.55, 20]} />
        </mesh>
        <mesh material={goldMat} position={[0, 0.32, 0]}>
          <torusGeometry args={[0.18, 0.04, 10, 24]} />
        </mesh>
        {/* lens glow */}
        <mesh position={[0, -0.29, 0]}>
          <circleGeometry args={[0.24, 24]} />
          <meshBasicMaterial color={beamColor} toneMapped={false} />
        </mesh>
        {/* beam */}
        <mesh material={beamMat} position={[0, -3.3, 0]}>
          <coneGeometry args={[1.9, 6, 24, 1, true]} />
        </mesh>
      </group>
    </group>
  );
}
