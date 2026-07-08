"use client";

import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

/**
 * Section entrance motion:
 *  - [data-reveal] elements fade + rise, staggered.
 *  - [data-clip] elements (media) wipe in from the bottom via clip-path,
 *    with a slow inner scale settle — the Monolog-style image reveal.
 * Hero (eager=true) plays on load; other sections play on scroll into view.
 */
export function useReveal(ref: RefObject<HTMLElement | null>, eager = false) {
  useGSAP(
    () => {
      if (!ref.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const scrollTrigger = eager
        ? undefined
        : {
            trigger: ref.current,
            start: "top 72%" as const,
            toggleActions: "play none none reverse" as const,
          };

      const targets = ref.current.querySelectorAll("[data-reveal]");
      if (targets.length) {
        gsap.fromTo(
          targets,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.09,
            delay: eager ? 0.25 : 0,
            scrollTrigger,
          }
        );
      }

      const clips = ref.current.querySelectorAll<HTMLElement>("[data-clip]");
      clips.forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
        // inner "settle" scale is opt-in so it never clobbers other
        // transforms (e.g. a card's hover-zoom on the same image)
        const inner = el.querySelector("[data-clip-inner]");
        if (inner) {
          gsap.fromTo(
            inner,
            { scale: 1.18 },
            {
              scale: 1,
              duration: 1.4,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });
    },
    { scope: ref }
  );
}
