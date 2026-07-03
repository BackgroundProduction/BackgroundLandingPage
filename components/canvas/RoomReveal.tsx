"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollStore, SECTION_ORDER, type SectionId } from "@/lib/scroll-store";
import { roomZ } from "@/components/canvas/CameraRig";

interface RoomRevealProps {
  section: SectionId;
  children: React.ReactNode;
  /** how far the content floats up while materializing */
  rise?: number;
  /** starting scale of the entrance (1 = no scale animation) */
  from?: number;
}

/**
 * Smooth entrance for a room's motifs: as the *previous* section's scroll
 * progress ramps past 35%, the wrapped content scales up and floats into
 * place with exponential damping — no pop-in when the camera arrives.
 * The hero (no previous section) reveals on load.
 */
export default function RoomReveal({
  section,
  children,
  rise = 0.8,
  from = 0.4,
}: RoomRevealProps) {
  const group = useRef<THREE.Group>(null);
  const current = useRef(0);
  const idx = SECTION_ORDER.indexOf(section);
  // scale must pivot around the room's own center, not the world origin —
  // children keep absolute world coordinates via the inner counter-offset
  const pivotZ = roomZ(idx);

  useFrame((_, delta) => {
    if (!group.current) return;
    const { progress } = useScrollStore.getState();
    const prev = idx === 0 ? 1 : progress[SECTION_ORDER[idx - 1]];
    const target = THREE.MathUtils.clamp((prev - 0.35) / 0.45, 0, 1);

    current.current += (target - current.current) * (1 - Math.exp(-delta * 2.8));
    const eased = THREE.MathUtils.smoothstep(current.current, 0, 1);

    const scale = from + (1 - from) * eased;
    group.current.scale.setScalar(Math.max(scale, 0.0001));
    group.current.position.y = (1 - eased) * -rise;
  });

  return (
    <group position={[0, 0, pivotZ]}>
      <group ref={group}>
        <group position={[0, 0, -pivotZ]}>{children}</group>
      </group>
    </group>
  );
}
