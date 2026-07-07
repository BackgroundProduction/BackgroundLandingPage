"use client";

import { useEffect, useRef } from "react";

/** Thin accent progress line along the right edge — rAF-driven transform,
 * never re-renders React. */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      if (bar.current) {
        const max = document.body.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        bar.current.style.transform = `scaleY(${Math.min(Math.max(p, 0), 1)})`;
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed right-0 top-0 z-40 hidden h-full w-px md:block"
      style={{ background: "var(--color-line-soft)" }}
    >
      <div
        ref={bar}
        className="h-full w-full origin-top"
        style={{ transform: "scaleY(0)", background: "var(--color-accent)" }}
      />
    </div>
  );
}
