"use client";

import { useSyncExternalStore } from "react";

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

export type DeviceTier = "high" | "low" | "none";

/**
 * "high" — full experience (bloom, dpr 2, frameloop always)
 * "low"  — canvas kept, but demand rendering, capped dpr, no postprocessing
 * "none" — no WebGL2 available: skip the 3D layer entirely
 * Uncertain signals fail toward the cheaper experience.
 */
export function getDeviceTier(): DeviceTier {
  if (typeof window === "undefined") return "low";

  const canvas = document.createElement("canvas");
  const hasWebGL2 = !!canvas.getContext("webgl2");
  if (!hasWebGL2) return "none";

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const smallViewport = window.innerWidth < 768;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  if (smallViewport || coarsePointer || cores <= 4 || memory <= 4) return "low";
  return "high";
}
