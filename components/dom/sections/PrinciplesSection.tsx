"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useContent } from "@/components/dom/LocaleProvider";

export default function PrinciplesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { t } = useContent();

  // Desktop: pin the section and drive the card track horizontally as the
  // user scrolls down — the pinned horizontal-scroll pattern. Below lg (and
  // under reduced motion) the track is a plain horizontal swipe instead.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const track = trackRef.current;
          const viewport = viewportRef.current;
          if (!track || !viewport || !sectionRef.current) return;
          const distance = () =>
            Math.max(0, track.scrollWidth - viewport.clientWidth);

          gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 0.5,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
        }
      );
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="principles-heading"
      className="theme-dark relative flex min-h-screen flex-col justify-center overflow-hidden px-[var(--gutter)] py-[var(--space-section-y)]"
    >
      <p className="text-eyebrow text-accent">{t.principles.eyebrow}</p>
      <h2
        id="principles-heading"
        className="font-display font-medium text-display-lg mt-6 max-w-[20ch]"
      >
        {t.principles.heading}
        <span className="text-accent">.</span>
      </h2>

      {/* card track — pinned horizontal on desktop, swipe on mobile */}
      <div
        ref={viewportRef}
        className="mt-14 overflow-x-auto lg:overflow-hidden"
        style={{ scrollbarWidth: "none" }}
      >
        <div ref={trackRef} className="flex w-max gap-6 pb-2">
          {t.principles.items.map((principle, i) => (
            <article
              key={principle.title}
              className="flex w-[82vw] shrink-0 flex-col justify-between rounded-sm p-8 sm:w-[24rem] lg:h-[24rem] lg:w-[26rem] lg:p-10"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-line-soft)",
              }}
            >
              <p className="font-mono text-xs tracking-widest text-text-dim">
                {String(i + 1).padStart(2, "0")}
              </p>
              <div>
                <h3 className="font-display text-3xl font-medium lg:text-4xl">
                  {principle.title}
                </h3>
                <p className="dim mt-5 text-[length:var(--text-body-lg)] leading-relaxed">
                  {principle.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
