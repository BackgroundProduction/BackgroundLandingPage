"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ChandelierModel from "@/components/canvas/motifs/ChandelierModel";
import StageSpotlight from "@/components/canvas/motifs/StageSpotlight";
import DustMotes from "@/components/canvas/motifs/DustMotes";
import RoomReveal from "@/components/canvas/RoomReveal";
import { useScrollStore } from "@/lib/scroll-store";

/** Hero room at z=0: chandelier centerpiece, flanking beams, drifting dust. */
export default function HeroScene() {
  const chandelierGroup = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!chandelierGroup.current) return;
    // as the user scrolls out of the hero, the chandelier drifts up and aside
    // into a "peripheral gallery" position instead of blocking the camera path
    const p = useScrollStore.getState().progress.hero;
    const damp = 1 - Math.exp(-delta * 4);
    chandelierGroup.current.position.lerp(
      new THREE.Vector3(2.55 - p * 7, 3.3 + p * 2.5, -3 - p * 2),
      damp
    );
    const s = 1 - p * 0.35;
    chandelierGroup.current.scale.lerp(new THREE.Vector3(s, s, s), damp);
  });

  return (
    <group>
      <RoomReveal section="hero" rise={0.6} from={0.5}>
        <group ref={chandelierGroup} position={[2.55, 3.3, -3]}>
          <ChandelierModel />
        </group>
        <StageSpotlight position={[-5, 4.5, -1]} tilt={-0.5} />
        <StageSpotlight position={[5, 4.5, -1]} tilt={0.5} beamColor="#e9c873" />
        <DustMotes count={70} center={[0, 1, 0]} />
      </RoomReveal>
      {/* backdrop + floor catch the light and give the room depth */}
      <mesh position={[0, 1, -9]} receiveShadow>
        <planeGeometry args={[40, 22]} />
        <meshStandardMaterial color="#14100d" roughness={1} />
      </mesh>
      <mesh position={[0, -2.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0d0a08" roughness={0.55} metalness={0.1} />
      </mesh>
    </group>
  );
}
