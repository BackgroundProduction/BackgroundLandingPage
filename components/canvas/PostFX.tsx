"use client";

import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export default function PostFX({ enabled = true }: { enabled?: boolean }) {
  if (!enabled) return null;
  return (
    // multisampling 0: default is 8x MSAA on the composer buffer — a huge
    // fragment cost on large screens, and bloom soft-blurs edges anyway
    <EffectComposer multisampling={0}>
      <Bloom
        luminanceThreshold={0.4}
        luminanceSmoothing={0.3}
        intensity={0.7}
        mipmapBlur
      />
      <Vignette darkness={0.55} offset={0.3} />
      <Noise opacity={0.025} blendFunction={BlendFunction.OVERLAY} />
    </EffectComposer>
  );
}
