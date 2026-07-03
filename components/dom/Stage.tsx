"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePrefersReducedMotion, getDeviceTier, type DeviceTier } from "@/lib/device";
import StaticBackdrop from "@/components/fallback/StaticBackdrop";

// Only imported (and its three.js chunk only downloaded) when actually rendered.
const CanvasStage = dynamic(() => import("@/components/dom/CanvasStage"), {
  ssr: false,
});

/** Picks the background layer: full 3D, lightweight 3D, or static CSS. */
export default function Stage() {
  const reducedMotion = usePrefersReducedMotion();
  const [tier, setTier] = useState<DeviceTier | null>(null);

  useEffect(() => {
    setTier(getDeviceTier());
  }, []);

  if (tier === null) return <StaticBackdrop />; // first paint, pre-detection
  if (reducedMotion || tier === "none") return <StaticBackdrop />;
  return <CanvasStage tier={tier} />;
}
