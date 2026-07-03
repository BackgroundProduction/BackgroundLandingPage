"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import FilmReel from "@/components/canvas/motifs/FilmReel";
import BrassHorn from "@/components/canvas/motifs/BrassHorn";
import Podium from "@/components/canvas/motifs/Podium";
import Medal from "@/components/canvas/motifs/Medal";
import { roomZ } from "@/components/canvas/CameraRig";
import RoomReveal from "@/components/canvas/RoomReveal";
import { useScrollStore } from "@/lib/scroll-store";

const Z = roomZ(2); // -28

/**
 * Services room: one motif per service arranged in a slow-orbiting ring;
 * the motif matching the active service card scales up and brightens.
 */
export default function ServicesScene() {
  const ring = useRef<THREE.Group>(null);
  const motifRefs = useRef<(THREE.Group | null)[]>([]);

  // ring slots — motif i sits at angle i/4·2π; the ring is offset to the
  // right of the camera path so the dolly never collides with a motif
  const slots = [0, 1, 2, 3].map((i) => {
    const a = (i / 4) * Math.PI * 2;
    return [Math.sin(a) * 2.2, 0.6, Math.cos(a) * 2.2] as const;
  });

  useFrame((state, delta) => {
    const { activeServiceIndex } = useScrollStore.getState();
    if (ring.current) {
      // slow idle orbit + scroll-scrubbed rotation bringing the active motif forward
      const target =
        -activeServiceIndex * (Math.PI / 2) +
        Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
      ring.current.rotation.y = THREE.MathUtils.lerp(
        ring.current.rotation.y,
        target,
        1 - Math.exp(-delta * 2.5)
      );
    }
    motifRefs.current.forEach((g, i) => {
      if (!g) return;
      const active = i === activeServiceIndex;
      const s = active ? 1.1 : 0.7;
      g.scale.lerp(new THREE.Vector3(s, s, s), 1 - Math.exp(-delta * 3));
    });
  });

  return (
    <group>
      <RoomReveal section="services" rise={1.2} from={0.25}>
      <group ref={ring} position={[3.4, 0.3, Z - 4]}>
        <group ref={(el) => void (motifRefs.current[0] = el)} position={slots[0]}>
          <FilmReel />
        </group>
        <group ref={(el) => void (motifRefs.current[1] = el)} position={slots[1]}>
          <BrassHorn />
        </group>
        <group ref={(el) => void (motifRefs.current[2] = el)} position={slots[2]}>
          <Podium position={[0, -1, 0]} />
        </group>
        <group ref={(el) => void (motifRefs.current[3] = el)} position={slots[3]}>
          <Medal spinOffset={2} />
        </group>
      </group>
      </RoomReveal>
      <mesh position={[0, 1, Z - 8]}>
        <planeGeometry args={[34, 20]} />
        <meshStandardMaterial color="#120e0a" roughness={1} />
      </mesh>
      <mesh position={[0, -2.4, Z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[34, 22]} />
        <meshStandardMaterial color="#0d0a08" roughness={0.6} />
      </mesh>
      <pointLight position={[0, 3, Z + 2]} color="#ffcf8a" intensity={8} distance={12} decay={2} />
    </group>
  );
}
