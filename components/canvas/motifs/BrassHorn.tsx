"use client";

import { useMemo, useRef } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { createGoldMaterial } from "@/components/canvas/materials/materials";

/** Abstract brass horn: lathe-revolved bell + curved tube — concert motif. */
export default function BrassHorn(props: ThreeElements["group"]) {
  const group = useRef<THREE.Group>(null);
  const goldMat = useMemo(() => createGoldMaterial(true), []);

  const bellGeometry = useMemo(() => {
    // flared bell profile revolved around Y
    const profile: THREE.Vector2[] = [];
    for (let i = 0; i <= 16; i++) {
      const t = i / 16;
      // exponential flare
      profile.push(new THREE.Vector2(0.08 + Math.pow(t, 2.6) * 0.55, t * 0.9));
    }
    return new THREE.LatheGeometry(profile, 40);
  }, []);

  const tubeGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.1, -0.5, 0),
      new THREE.Vector3(0.65, -0.72, 0),
      new THREE.Vector3(1.05, -0.35, 0),
      new THREE.Vector3(1.0, 0.25, 0),
    ]);
    return new THREE.TubeGeometry(curve, 40, 0.07, 12);
  }, []);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.2;
      group.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
    }
  });

  return (
    <group {...props} ref={group}>
      <mesh geometry={bellGeometry} material={goldMat} rotation={[Math.PI, 0, 0.3]} />
      <mesh geometry={tubeGeometry} material={goldMat} position={[0, -0.05, 0]} />
    </group>
  );
}
