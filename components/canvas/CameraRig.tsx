"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollStore, SECTION_ORDER } from "@/lib/scroll-store";

/**
 * World layout: the five "gallery rooms" sit along -Z, one every 14 units.
 * Scroll drives a global path parameter t ∈ [0,5] (sum of sequential section
 * progress); the camera samples two Catmull-Rom curves (position + lookAt)
 * and damps toward the sample, so scroll jumps never snap the camera.
 */
export const ROOM_SPACING = 14;
export const roomZ = (index: number) => -index * ROOM_SPACING;

const POSITION_POINTS = [
  new THREE.Vector3(0, -0.3, 7.5), // hero start — low, looking up at the chandelier
  new THREE.Vector3(1.6, 0.6, -6), // drifting right past the hero room
  new THREE.Vector3(-1.8, 0.8, -20), // lateral drift through the about "portrait wall"
  new THREE.Vector3(0, 1.0, -34), // services cluster
  new THREE.Vector3(0, 0.8, -48), // down the portfolio red carpet
  new THREE.Vector3(0, 0.5, -52.5), // settling before the contact curtain
];

const LOOKAT_POINTS = [
  new THREE.Vector3(0, 1.6, 0),
  new THREE.Vector3(0, 0.8, -14),
  new THREE.Vector3(0, 0.6, -28),
  new THREE.Vector3(0, 0.5, -42),
  new THREE.Vector3(0, 0.6, -56),
  new THREE.Vector3(0, 0.5, -58),
];

export default function CameraRig() {
  const positionCurve = useMemo(
    () => new THREE.CatmullRomCurve3(POSITION_POINTS, false, "centripetal"),
    []
  );
  const lookAtCurve = useMemo(
    () => new THREE.CatmullRomCurve3(LOOKAT_POINTS, false, "centripetal"),
    []
  );

  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const currentLook = useRef(new THREE.Vector3(0, 1.6, 0));
  const initialized = useRef(false);

  useFrame((state, delta) => {
    const { progress } = useScrollStore.getState();
    // sections scroll sequentially, so summing per-section progress yields a
    // continuous 0..5 parameter along the whole journey
    let t = 0;
    for (const id of SECTION_ORDER) t += progress[id];
    const u = Math.min(t / SECTION_ORDER.length, 1);

    positionCurve.getPointAt(u, targetPos.current);
    lookAtCurve.getPointAt(u, targetLook.current);

    if (!initialized.current) {
      // entry shot: start pulled back + low, damping dollies us in
      state.camera.position.set(0, -1.4, 11);
      currentLook.current.copy(targetLook.current);
      initialized.current = true;
    }

    const damp = 1 - Math.exp(-delta * 4.5);
    state.camera.position.lerp(targetPos.current, damp);
    currentLook.current.lerp(targetLook.current, damp);
    state.camera.lookAt(currentLook.current);
  });

  return null;
}
