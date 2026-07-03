"use client";

import { useMemo } from "react";
import * as THREE from "three";
import Medal from "@/components/canvas/motifs/Medal";
import StageSpotlight from "@/components/canvas/motifs/StageSpotlight";
import DustMotes from "@/components/canvas/motifs/DustMotes";
import { roomZ } from "@/components/canvas/CameraRig";
import { createVelvetMaterial } from "@/components/canvas/materials/materials";

const Z = roomZ(3); // -42

/**
 * Portfolio room: red carpet receding into depth, floating medals flanking
 * the processional axis, spotlights marking the way.
 */
export default function PortfolioScene() {
  const velvetMat = useMemo(() => createVelvetMaterial(), []);

  const medals = useMemo(
    () =>
      [0, 1, 2, 3, 4, 5].map((i) => ({
        position: [
          (i % 2 === 0 ? -1 : 1) * (2.6 + (i % 3) * 0.5),
          0.6 + (i % 3) * 0.9,
          Z - i * 2.8,
        ] as [number, number, number],
        spinOffset: i * 1.7,
      })),
    []
  );

  return (
    <group>
      {/* red carpet processional — starts at the room threshold, not before */}
      <mesh
        material={velvetMat}
        position={[0, -2.35, Z - 8]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[2.8, 20]} />
      </mesh>
      {/* gold edge trims */}
      {[-1.5, 1.5].map((x) => (
        <mesh key={x} position={[x, -2.34, Z - 8]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.07, 20]} />
          <meshBasicMaterial color="#c9a24b" toneMapped={false} />
        </mesh>
      ))}
      {medals.map((m, i) => (
        <Medal key={i} position={m.position} spinOffset={m.spinOffset} />
      ))}
      <StageSpotlight position={[-4.5, 5, Z - 2]} tilt={-0.45} />
      <StageSpotlight position={[4.5, 5, Z - 8]} tilt={0.45} beamColor="#e9c873" />
      <DustMotes count={80} center={[0, 0.5, Z - 3]} bounds={[12, 8, 16]} />
      <mesh position={[0, -2.4, Z - 4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[36, 34]} />
        <meshStandardMaterial color="#0c0906" roughness={0.55} />
      </mesh>
      <pointLight position={[0, 2, Z]} color="#ffb066" intensity={6} distance={14} decay={2} />
    </group>
  );
}
