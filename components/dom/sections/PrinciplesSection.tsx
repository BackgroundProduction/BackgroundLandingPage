"use client";

import { useRef, useMemo } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useContent } from "@/components/dom/LocaleProvider";
import { scrollImages } from "@/content/scroll-images";

/* Pin length per flipbook frame, in % of viewport height. More frames need a
   longer scroll or the cuts come too fast to read. */
const SCROLL_PER_FRAME = 12;
const MIN_SCROLL = 160;

/* The gilded frame's opening sits at ~17% in from every edge (measured off
   frame.webp's alpha channel, and centred within it). Photos are inset just
   under that so their edges tuck behind the gold lip with no hairline gap;
   the emblem gets more room so its wordmark can't be clipped. */
const PHOTO_INSET = "15.5%";
const EMBLEM_INSET = "21%";

export default function PrinciplesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const animRef = useRef<HTMLDivElement>(null);
  const staticRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLSpanElement>(null);
  const rightRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { t } = useContent();

  // photos come from public/assets/scrollimages/ (generated list); the emblem
  // stays frame 0 as the at-rest state. Falls back to the locale list while
  // that folder is still empty.
  const frames = useMemo(
    () =>
      scrollImages.length
        ? [t.principles.images[0], ...scrollImages]
        : t.principles.images,
    [t.principles.images]
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // desktop + motion-ok: swap to the animated split line, pin the section,
      // scale the centre image to full-bleed while the two text halves slide
      // off the edges, then reveal the principle words over the filled image
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const center = centerRef.current;
        const stage = stageRef.current;
        if (!center || !stage || !sectionRef.current) return;

        gsap.set(staticRef.current, { display: "none" });
        gsap.set(animRef.current, { display: "flex" });

        // The stage is laid out at its *final* size and scaled DOWN to sit in
        // the text line, then animated back to 1. Scaling a promoted layer up
        // from ~7vw only stretches the pixels it was first rasterised at, so
        // the frame and photos arrived visibly blocky; going the other way
        // rasterises at full size and every intermediate step stays sharp.
        const restScale = () =>
          center.offsetWidth / (stage.offsetWidth || center.offsetWidth);

        gsap.set(stage, { scale: restScale() });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: `+=${Math.max(MIN_SCROLL, frames.length * SCROLL_PER_FRAME)}%`,
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // the layout box and the stage both change with the viewport, so
            // the at-rest scale has to be measured again after a resize
            onRefresh: () => gsap.set(stage, { scale: restScale() }),
            // flipbook: same progress that drives the scale picks the frame
            onUpdate: (self) => {
              const frames = frameRefs.current.filter(
                (el): el is HTMLDivElement => el !== null
              );
              if (!frames.length) return;
              const idx = Math.min(
                frames.length - 1,
                Math.floor(self.progress * frames.length)
              );
              frames.forEach((el, i) => {
                el.style.opacity = i === idx ? "1" : "0";
              });
            },
          },
        });

        tl.to(leftRef.current, { xPercent: -170, opacity: 0, ease: "power2.in" }, 0)
          .to(rightRef.current, { xPercent: 170, opacity: 0, ease: "power2.in" }, 0)
          .to(stage, { scale: 1, ease: "power2.inOut" }, 0)
          .fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, ease: "none" }, 0.62);
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="principles"
      aria-labelledby="principles-heading"
      className="theme-dark relative flex min-h-screen items-center justify-center overflow-hidden px-[var(--gutter)] py-[var(--space-section-y)]"
    >
      <h2 id="principles-heading" className="sr-only">
        {t.principles.heading}
      </h2>

      {/* ANIMATED — hidden until JS enables it on desktop+motion */}
      <div
        ref={animRef}
        className="w-full items-center justify-center"
        style={{ display: "none" }}
      >
        <div className="flex w-full items-center justify-center gap-[3vw]">
          <span
            ref={leftRef}
            className="font-display shrink-0 font-bold uppercase leading-none"
            style={{ fontSize: "clamp(2.5rem, 7vw, 8rem)", letterSpacing: "-0.03em" }}
          >
            {t.principles.splitLeft}
          </span>

          {/* centre square: a scroll-driven flipbook — frames swap with scroll
              progress while the square scales to full-bleed. Frame 0 is the
              transparent emblem shown at rest. */}
          <div
            ref={centerRef}
            className="relative z-0 aspect-square w-[7vw] min-w-[80px] shrink-0"
          >
            {/* The stage carries the artwork at its final size; the box above
                only reserves the small slot in the text line. */}
            <div
              ref={stageRef}
              className="absolute left-1/2 top-1/2 aspect-square overflow-hidden will-change-transform"
              style={{
                width: "min(1000px, 92vw, 92vh)",
                margin: "calc(min(1000px, 92vw, 92vh) / -2) 0 0 calc(min(1000px, 92vw, 92vh) / -2)",
              }}
            >
            {frames.map((src, i) => (
              <div
                key={`${src}-${i}`}
                ref={(el) => {
                  frameRefs.current[i] = el;
                }}
                className="absolute"
                style={{
                  inset: src.includes("emblem") ? EMBLEM_INSET : PHOTO_INSET,
                  opacity: i === 0 ? 1 : 0,
                }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  // the square never renders wider than 1000px (see coverScale)
                  sizes="(max-width: 568px) 92vw, 1000px"
                  priority={i === 0}
                  className={src.includes("emblem") ? "object-contain" : "object-cover"}
                />
              </div>
            ))}

            {/* gilded frame — static above the flipbook, so every photo reads
                as hung inside it. Trimmed to its own gold edge, so it lines up
                with the square and the photos only show through its window. */}
            <Image
              src="/assets/frame.webp"
              alt=""
              aria-hidden="true"
              fill
              sizes="(max-width: 568px) 92vw, 1000px"
              priority
              className="pointer-events-none z-10 select-none object-fill"
            />
            </div>
          </div>

          <span
            ref={rightRef}
            className="font-display shrink-0 font-bold uppercase leading-none"
            style={{ fontSize: "clamp(2.5rem, 7vw, 8rem)", letterSpacing: "-0.03em" }}
          >
            {t.principles.splitRight}
          </span>
        </div>

        {/* principle words revealed over the filled image */}
        <div
          ref={overlayRef}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end px-[var(--gutter)] pb-[clamp(3rem,8vh,7rem)]"
          style={{ opacity: 0 }}
        >
          <p className="text-eyebrow" style={{ color: "var(--color-accent)" }}>
            {t.principles.eyebrow}
          </p>
          <div className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.principles.items.map((principle, i) => (
              <div key={principle.title}>
                <p className="font-mono text-xs tracking-widest text-white/60">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-display mt-2 text-2xl font-medium text-white">
                  {principle.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/75">
                  {principle.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STATIC fallback — mobile / reduced motion (default before JS) */}
      <div ref={staticRef} className="w-full">
        <p className="text-eyebrow text-accent">{t.principles.eyebrow}</p>
        <h2 className="font-display font-bold uppercase text-display-lg mt-6 max-w-[20ch]">
          {t.principles.heading}
          <span className="text-accent">.</span>
        </h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.principles.items.map((principle, i) => (
            <article
              key={principle.title}
              className="rounded-sm p-8"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-line-soft)" }}
            >
              <p className="font-mono text-xs tracking-widest text-text-dim">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="font-display mt-5 text-2xl font-medium">{principle.title}</h3>
              <p className="dim mt-4 text-sm leading-relaxed">{principle.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
