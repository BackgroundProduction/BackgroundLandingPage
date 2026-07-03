"use client";

import VelvetCurtain from "@/components/canvas/motifs/VelvetCurtain";
import StageSpotlight from "@/components/canvas/motifs/StageSpotlight";
import RoomReveal from "@/components/canvas/RoomReveal";
import { roomZ } from "@/components/canvas/CameraRig";

const Z = roomZ(4); // -56

/**
 * Contact room: velvet curtains part as the section arrives — the show is
 * about to begin. One restrained centered spotlight; the camera settles.
 */
export default function ContactScene() {
  return (
    <group>
      <RoomReveal section="contact" rise={0.5} from={0.65}>
        <VelvetCurtain side={-1} position={[0, 0.6, Z - 2]} />
        <VelvetCurtain side={1} position={[0, 0.6, Z - 2]} />
        <StageSpotlight position={[0, 5.5, Z - 5]} tilt={0} sway={false} />
        {/* pool of light where the beam lands */}
        <mesh position={[0, -2.38, Z - 5]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.1, 40]} />
          <meshBasicMaterial color="#ffd9a0" transparent opacity={0.16} toneMapped={false} />
        </mesh>
      </RoomReveal>
      {/* stage floor + back wall behind the parted curtains */}
      <mesh position={[0, 1, Z - 6]}>
        <planeGeometry args={[30, 18]} />
        <meshStandardMaterial color="#100c08" roughness={1} />
      </mesh>
      <mesh position={[0, -2.4, Z - 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 18]} />
        <meshStandardMaterial color="#0d0a08" roughness={0.5} metalness={0.15} />
      </mesh>
      <pointLight position={[0, 3, Z + 1]} color="#ffcf8a" intensity={7} distance={12} decay={2} />
    </group>
  );
}
