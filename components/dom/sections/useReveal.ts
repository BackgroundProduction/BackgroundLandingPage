"use client";

import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

/**
 * Staggered entrance for elements marked [data-reveal] inside the section.
 * Hero (eager=true) plays on load; other sections play on scroll into view.
 */
export function useReveal(ref: RefObject<HTMLElement | null>, eager = false) {
  useGSAP(
    () => {
      if (!ref.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const targets = ref.current.querySelectorAll("[data-reveal]");
      if (!targets.length) return;

      const from = { opacity: 0, y: 36 };
      const to = {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out" as const,
        stagger: 0.09,
      };

      if (eager) {
        gsap.fromTo(targets, from, { ...to, delay: 0.25 });
      } else {
        gsap.fromTo(targets, from, {
          ...to,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        });
      }
    },
    { scope: ref }
  );
}
