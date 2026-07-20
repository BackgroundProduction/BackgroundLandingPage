"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useContent } from "@/components/dom/LocaleProvider";
import MagneticButton from "@/components/dom/ui/MagneticButton";

// WebGL scene is client-only; until it loads the hero is just type on ink
const HeroStage = dynamic(() => import("./HeroStage"), { ssr: false });

/**
 * Hero — a full-viewport interactive 3D venue (cobloc.archi-style): the
 * wireframe rig auto-orbits and can be dragged to orbit, beams sweep from an
 * arch truss over a circular deck. Every 8s the same lines morph into a
 * cinema camera on a crane (music ↔ film production) and back. Over it: HUD
 * chips in mono type (cycling build phase + drag hint), a bottom-anchored
 * headline block, and a meta strip.
 * Reduced motion: static rig, no auto-rotate, no morph, no entrance animation.
 */
export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useContent();

  // cycling phase label in the left HUD chip
  const phases = [t.hero.rig.design, t.hero.rig.rigging, t.hero.rig.sound, t.hero.rig.lights];
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setPhase((p) => (p + 1) % 4), 2400);
    return () => window.clearInterval(id);
  }, []);

  useGSAP(
    () => {
      if (!ref.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const tl = gsap.timeline();
      tl.fromTo(
        "[data-stage]",
        { opacity: 0, scale: 1.045 },
        { opacity: 1, scale: 1, duration: 1.6, ease: "power2.out" },
        0
      );
      tl.fromTo(
        "[data-reveal]",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1 },
        0.25
      );
      tl.fromTo(
        "[data-chip]",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.12 },
        1.0
      );
    },
    { scope: ref }
  );

  const chip =
    "flex items-center gap-2.5 border border-line bg-white/[0.03] px-3.5 py-2 " +
    "font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim backdrop-blur-md";

  return (
    <section
      ref={ref}
      id="top"
      aria-label="Introduction"
      className="relative isolate min-h-screen overflow-hidden"
    >
      {/* the venue — drag to orbit */}
      <div data-stage className="absolute inset-0 z-0" aria-hidden="true">
        <HeroStage />
      </div>

      {/* scrim so the headline stays readable over the rig */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[46vh] bg-gradient-to-t from-[var(--color-bg)] via-[rgba(10,10,10,0.55)] to-transparent"
      />

      {/* HUD chips stacked on the right edge, cobloc-style */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[var(--gutter)] top-1/2 z-20 hidden -translate-y-1/2 flex-col items-end gap-3 md:flex"
      >
        {/* reviewer note: the drag-to-orbit chip is removed; only the phase
            chip stays */}
        <div data-chip className={chip}>
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          <span key={phase} className="fade-in">
            {phases[phase]}
          </span>
        </div>
      </div>

      {/* headline block — pointer-events pass through to the rig except on CTAs */}
      {/* full-width with the same gutter as the header, so the copy
          left-aligns with the logo */}
      <div className="pointer-events-none relative z-20 flex min-h-screen w-full flex-col justify-end px-[var(--gutter)] pb-8 pt-28">
        <p data-reveal className="text-eyebrow text-text-dim">
          {t.hero.eyebrow}
        </p>
        <h1
          data-reveal
          className="font-display mt-6 max-w-[20ch] font-medium"
          style={{
            fontSize: "clamp(2.2rem, 4.7vw, 4.6rem)",
            lineHeight: 1.06,
            letterSpacing: "-0.02em",
          }}
        >
          {t.hero.titleParts[0]}
          <em
            className="font-serif-display italic text-accent"
            style={{ fontSize: "1.06em", letterSpacing: "0" }}
          >
            {t.hero.titleParts[1]}
          </em>
          {t.hero.titleParts[2]}
          <span className="text-accent">.</span>
        </h1>
        <div
          data-reveal
          className="pointer-events-auto mt-9 flex flex-wrap items-center gap-x-8 gap-y-5"
        >
          <div className="flex flex-wrap items-center gap-4">
            <MagneticButton
              href={t.contact.emailHref}
              className="rounded-full px-7 py-3.5 font-medium"
              style={{ background: "var(--color-paper)", color: "var(--color-ink)" }}
            >
              {t.ui.startProject}
            </MagneticButton>
            <MagneticButton
              href="#work"
              className="rounded-full border border-line px-7 py-3.5 font-medium transition-colors hover:border-accent hover:text-accent"
            >
              {t.ui.seeWork}
            </MagneticButton>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-text-dim">{t.hero.sub}</p>
        </div>

        {/* meta strip — coordinates / live / scroll cue */}
        <div
          data-reveal
          className="mt-12 flex items-center justify-between gap-4 border-t border-[var(--color-line-soft)] pt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim"
        >
          <span>{t.hero.hud.location}</span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            {t.hero.rig.live}
          </span>
          <span className="hidden sm:inline">{t.hero.hud.scroll} ↓</span>
        </div>
      </div>
    </section>
  );
}
