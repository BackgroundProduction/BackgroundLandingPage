"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollStore, SECTION_ORDER } from "@/lib/scroll-store";

/**
 * Distance culling for a gallery room: only renders when the scroll journey
 * (global t = 0..5) is close enough for the room to matter. Rooms further
 * than ~1.7 sections ahead are fully fog-obscured and RoomReveal holds their
 * motifs collapsed, so toggling visibility here never pops on screen — it
 * just skips their draw calls, lights and overdraw entirely.
 */
export default function Room({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!group.current) return;
    const { progress } = useScrollStore.getState();
    let t = 0;
    for (const id of SECTION_ORDER) t += progress[id];
    // visible from 1.7 sections before arrival until 2 sections past
    group.current.visible = t > index - 1.7 && t < index + 2;
  });

  return <group ref={group}>{children}</group>;
}
