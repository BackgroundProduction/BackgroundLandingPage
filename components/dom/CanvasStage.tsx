"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import Experience from "@/components/canvas/Experience";

/**
 * Fixed full-viewport WebGL stage. Persistent across the whole scroll —
 * DOM sections scroll in-flow above it (z-index 1 vs 0).
 *
 * Quality is adaptive: PerformanceMonitor watches the measured frame rate
 * and degrades in steps (drop postprocessing → drop resolution) when the
 * GPU can't keep up, regardless of what the device-tier heuristic guessed.
 */
export default function CanvasStage({ tier = "high" }: { tier?: "high" | "low" }) {
  // 0 = full, 1 = no postFX, 2 = no postFX + dpr 1
  const [degrade, setDegrade] = useState(tier === "low" ? 1 : 0);
  const dpr: number | [number, number] = degrade >= 2 ? 1 : [1, 1.5];

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ fov: 42, near: 0.1, far: 80, position: [0, -1.4, 11] }}
        dpr={dpr}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <PerformanceMonitor
          bounds={() => [40, 90]}
          flipflops={2}
          onDecline={() => setDegrade((d) => Math.min(d + 1, 2))}
        >
          <Suspense fallback={null}>
            <Experience postFX={degrade === 0} />
          </Suspense>
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
