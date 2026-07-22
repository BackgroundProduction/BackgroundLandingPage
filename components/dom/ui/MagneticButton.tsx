"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Anchor that gently pulls toward the cursor while hovered and springs back
 * on leave — the "premium" magnetic CTA. Renders a plain <a> so it stays a
 * real link. Motion is skipped under prefers-reduced-motion and on touch.
 */
export default function MagneticButton({
  href,
  children,
  className,
  style,
  strength = 0.35,
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  strength?: number;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    gsap.to(el, { x, y, duration: 0.4, ease: "power3.out" });
  };

  const reset = () => {
    if (ref.current)
      gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <a
      ref={ref}
      href={href}
      className={`magnetic ${className ?? ""}`}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
