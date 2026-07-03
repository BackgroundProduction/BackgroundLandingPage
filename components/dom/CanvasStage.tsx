"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Experience from "@/components/canvas/Experience";

/**
 * Fixed full-viewport WebGL stage. Persistent across the whole scroll —
 * DOM sections scroll in-flow above it (z-index 1 vs 0).
 *
 * Low tier keeps the continuous frameloop (idle motif motion depends on it)
 * but drops the two big costs: postprocessing and device-pixel-ratio 2.
 */
export default function CanvasStage({ tier = "high" }: { tier?: "high" | "low" }) {
  const low = tier === "low";
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ fov: 42, near: 0.1, far: 80, position: [0, -1.4, 11] }}
        dpr={low ? [1, 1.5] : [1, 2]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <Experience postFX={!low} />
        </Suspense>
      </Canvas>
    </div>
  );
}
