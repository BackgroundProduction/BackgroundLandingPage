"use client";

import { useRef, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useScrollStore, type SectionId } from "@/lib/scroll-store";

/**
 * Registers this section's ScrollTrigger: writes 0–1 progress into the shared
 * scroll store (consumed by the 3D CameraRig inside useFrame) and runs an
 * entrance reveal on elements marked [data-reveal].
 */
export function useSectionTrigger(
  section: SectionId,
  ref: RefObject<HTMLElement | null>
) {
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      // reduced motion: no reveal tweens, no scroll-driven state — content
      // renders plainly and the static backdrop replaces the 3D layer
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const setSectionProgress = useScrollStore.getState().setSectionProgress;

      triggerRef.current = ScrollTrigger.create({
        trigger: ref.current,
        start: section === "hero" ? "top top" : "top bottom",
        end: section === "contact" ? "bottom bottom" : "bottom top",
        onUpdate: (self) => setSectionProgress(section, self.progress),
      });

      const revealTargets = ref.current.querySelectorAll("[data-reveal]");
      if (revealTargets.length) {
        const from = { opacity: 0, y: 40 };
        const to = {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out" as const,
          stagger: 0.1,
        };
        if (section === "hero") {
          // above the fold — entrance plays on load, not on scroll
          gsap.fromTo(revealTargets, from, { ...to, delay: 0.3 });
        } else {
          gsap.fromTo(revealTargets, from, {
            ...to,
            scrollTrigger: {
              trigger: ref.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          });
        }
      }
    },
    { scope: ref }
  );

  return triggerRef;
}
