"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import LaurelWreath from "@/components/canvas/motifs/LaurelWreath";
import Podium from "@/components/canvas/motifs/Podium";
import DustMotes from "@/components/canvas/motifs/DustMotes";
import { roomZ } from "@/components/canvas/CameraRig";
import { useScrollStore } from "@/lib/scroll-store";

const Z = roomZ(1); // -14

/** About room: rotating laurel wreath, podium silhouette — intimate framing. */
export default function AboutScene() {
  const wreathGroup = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!wreathGroup.current) return;
    const p = useScrollStore.getState().progress.about;
    const damp = 1 - Math.exp(-delta * 4);
    // drift in from the right as the section enters, exit past camera on leave
    const enter = Math.min(p * 2.5, 1);
    const exit = Math.max(0, p - 0.75) * 4;
    wreathGroup.current.position.lerp(
      new THREE.Vector3(2.6 - enter * 1.0 + exit * 2, 1.3, Z - 5 + exit * 4),
      damp
    );
  });

  return (
    <group>
      <group ref={wreathGroup} position={[2.6, 1.3, Z - 5]}>
        <LaurelWreath />
      </group>
      <Podium position={[-3.2, -2.2, Z - 6]} rotation={[0, 0.4, 0]} />
      <DustMotes count={60} center={[0, 0.5, Z]} bounds={[12, 7, 6]} />
      {/* portrait-wall backdrop */}
      <mesh position={[0, 1, Z - 7]}>
        <planeGeometry args={[34, 20]} />
        <meshStandardMaterial color="#131009" roughness={1} />
      </mesh>
      <mesh position={[0, -2.4, Z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[34, 20]} />
        <meshStandardMaterial color="#0d0a08" roughness={0.6} />
      </mesh>
      <pointLight position={[2.5, 2.5, Z + 1]} color="#ffb066" intensity={6} distance={10} decay={2} />
    </group>
  );
}
