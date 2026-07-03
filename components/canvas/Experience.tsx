"use client";

import { Environment, Lightformer } from "@react-three/drei";
import CameraRig from "@/components/canvas/CameraRig";
import Lights from "@/components/canvas/Lights";
import PostFX from "@/components/canvas/PostFX";
import HeroScene from "@/components/canvas/scenes/HeroScene";

export default function Experience({ postFX = true }: { postFX?: boolean }) {
  return (
    <>
      <color attach="background" args={["#0b0908"]} />
      <fogExp2 attach="fog" args={["#0a0806", 0.028]} />
      <CameraRig />
      <Lights />
      {/* local light-strip environment for gold/crystal reflections — no
          network fetch, unlike the drei HDRI presets */}
      <Environment resolution={64}>
        <Lightformer
          position={[0, 5, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[10, 10, 1]}
          intensity={2}
          color="#ffd9a0"
        />
        <Lightformer
          position={[-5, 1, -1]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[6, 2, 1]}
          intensity={1.2}
          color="#3a4a6b"
        />
      </Environment>
      <HeroScene />
      <PostFX enabled={postFX} />
    </>
  );
}
