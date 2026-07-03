"use client";

import { useEffect, useRef } from "react";
import { useScrollStore, SECTION_ORDER } from "@/lib/scroll-store";

/** Thin gold progress line along the right edge — written imperatively from
 * store subscription so 60fps scroll never re-renders React. */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return useScrollStore.subscribe((state) => {
      if (!bar.current) return;
      let t = 0;
      for (const id of SECTION_ORDER) t += state.progress[id];
      bar.current.style.transform = `scaleY(${t / SECTION_ORDER.length})`;
    });
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed right-0 top-0 z-40 hidden h-full w-px bg-cream/10 md:block"
    >
      <div
        ref={bar}
        className="h-full w-full origin-top bg-gold"
        style={{ transform: "scaleY(0)" }}
      />
    </div>
  );
}
