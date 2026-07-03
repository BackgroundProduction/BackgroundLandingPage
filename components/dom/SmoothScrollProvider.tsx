"use client";

import { useEffect, useRef } from "react";
import type Lenis from "lenis";
import { createSmoothScroll } from "@/lib/lenis-scrolltrigger";

/**
 * Mounts the Lenis + ScrollTrigger scroll system exactly once.
 * Cleanup on unmount is mandatory: React StrictMode double-invokes effects in
 * dev, and a leaked second Lenis instance doubles scroll speed.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // native scroll for reduced-motion users

    const { lenis, destroy } = createSmoothScroll();
    lenisRef.current = lenis;
    return () => {
      lenisRef.current = null;
      destroy();
    };
  }, []);

  return <>{children}</>;
}
