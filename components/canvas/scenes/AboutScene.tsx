"use client";

import GLBModel from "@/components/canvas/motifs/GLBModel";
import DustMotes from "@/components/canvas/motifs/DustMotes";
import RoomReveal from "@/components/canvas/RoomReveal";
import { roomZ } from "@/components/canvas/CameraRig";

const Z = roomZ(1); // -14

/**
 * About room: a modern event-lounge vignette — designer sofa, coffee table,
 * warm spot — intimate "who we are" framing beside the copy.
 */
export default function AboutScene() {
  return (
    <group>
      <RoomReveal section="about" rise={1.0} from={0.3}>
        <group position={[2.9, -2.38, Z - 5]} rotation={[0, -0.5, 0]}>
          <GLBModel url="/models/sofa.glb" modelScale={1.2} />
          <GLBModel
            url="/models/coffee-table.glb"
            modelScale={1.2}
            position={[0.1, 0, 1.35]}
          />
        </group>
        <DustMotes count={60} center={[0, 0.5, Z]} bounds={[12, 7, 6]} />
      </RoomReveal>
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
