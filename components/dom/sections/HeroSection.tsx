"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useContent } from "@/components/dom/LocaleProvider";
import MagneticButton from "@/components/dom/ui/MagneticButton";

/**
 * "Control room" hero — the moment before showtime, staged as a sequence:
 *  1. stage-manager cue lines check in (sound / lights / doors)
 *  2. the stage screen powers on from a thin line and settles (user's footage)
 *  3. headline + CTAs reveal
 *  4. the three-step process (listen → design → deliver) runs as an endless
 *     cue loop along the bottom, a dot travelling between the steps
 *  5. a followspot tracks the visitor's cursor across the whole hero
 * Reduced motion / no-JS render everything statically.
 */
export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const spotX = useRef<((v: number) => void) | null>(null);
  const spotY = useRef<((v: number) => void) | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const { t } = useContent();

  useGSAP(
    () => {
      if (!ref.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // ——— boot sequence ———
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ref.current.querySelectorAll("[data-cue]"),
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.3 }
      )
        .fromTo(
          screenRef.current,
          { scaleY: 0.015, opacity: 0 },
          { scaleY: 1, opacity: 1, duration: 0.9, ease: "power4.inOut" },
          "-=0.15"
        )
        .fromTo(
          screenRef.current,
          { filter: "brightness(2.4) saturate(0.4)" },
          { filter: "brightness(1) saturate(1)", duration: 0.6, ease: "power2.out" },
          "-=0.25"
        )
        .fromTo(
          ref.current.querySelectorAll("[data-reveal]"),
          { opacity: 0, y: 36 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.09 },
          "-=0.35"
        )
        .fromTo(
          ref.current.querySelector("[data-strip]"),
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4"
        )
        .to(spotRef.current, { opacity: 1, duration: 0.8 }, "-=0.3");

      // ——— endless process cue loop (dot travels listen → design → deliver) ———
      const dot = dotRef.current;
      if (dot) {
        gsap.fromTo(
          dot,
          { left: "0%" },
          {
            left: "100%",
            duration: 8,
            ease: "none",
            repeat: -1,
            onUpdate() {
              const idx = Math.min(2, Math.floor(this.progress() * 3));
              setActiveStep((prev) => (prev === idx ? prev : idx));
            },
          }
        );
      }

      // ——— followspot tracks the cursor ———
      if (
        spotRef.current &&
        !window.matchMedia("(pointer: coarse)").matches
      ) {
        spotX.current = gsap.quickTo(spotRef.current, "x", { duration: 0.6, ease: "power3" });
        spotY.current = gsap.quickTo(spotRef.current, "y", { duration: 0.6, ease: "power3" });
      }
    },
    { scope: ref }
  );

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    spotX.current?.(e.clientX - r.left);
    spotY.current?.(e.clientY - r.top);
  };

  const steps = t.process.steps;

  return (
    <section
      ref={ref}
      id="top"
      aria-label="Introduction"
      onMouseMove={onMove}
      className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-[var(--gutter)] pt-28 pb-24 text-center"
    >
      {/* followspot — a warm beam that follows the cursor */}
      <div
        ref={spotRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-30 hidden lg:block"
        style={{ opacity: 0 }}
      >
        <div
          className="h-[72vmin] w-[72vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(224,169,56,0.12) 0%, rgba(224,169,56,0.05) 35%, transparent 65%)",
            mixBlendMode: "screen",
          }}
        />
      </div>

      {/* stage-manager cue lines */}
      <div
        aria-hidden="true"
        className="absolute left-[var(--gutter)] top-24 z-20 hidden flex-col gap-1.5 text-left font-mono text-[11px] tracking-widest text-text-dim sm:flex"
      >
        {t.hero.cues.map((cue, i) => (
          <p key={cue} data-cue>
            <span className={i === t.hero.cues.length - 1 ? "text-accent" : ""}>
              {cue}
            </span>
          </p>
        ))}
      </div>

      {/* the stage screen — powers on around the user's footage */}
      <div
        ref={screenRef}
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 z-0 aspect-video w-[min(86vw,1040px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-sm will-change-transform"
        style={{
          border: "1px solid var(--color-line-soft)",
          boxShadow: "0 0 120px rgba(224,169,56,0.07)",
        }}
      >
        {/* generative stage — dark hall, sweeping beams, haze, no assets */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #0d0c0b 0%, #131211 55%, #0a0a0a 100%)",
          }}
        />
        {/* sweeping light beams */}
        <div
          className="stage-beam"
          style={{
            left: "6%",
            background:
              "linear-gradient(to bottom, rgba(224,169,56,0.5), rgba(224,169,56,0.08) 65%, transparent)",
            animationDuration: "7.5s",
          }}
        />
        <div
          className="stage-beam"
          style={{
            left: "38%",
            background:
              "linear-gradient(to bottom, rgba(240,238,233,0.34), rgba(240,238,233,0.05) 65%, transparent)",
            animationDuration: "9s",
            animationDelay: "-3s",
          }}
        />
        <div
          className="stage-beam"
          style={{
            left: "66%",
            background:
              "linear-gradient(to bottom, rgba(224,169,56,0.42), rgba(224,169,56,0.07) 65%, transparent)",
            animationDuration: "6.2s",
            animationDelay: "-1.5s",
          }}
        />
        {/* floor haze where the beams land */}
        <div
          className="absolute inset-x-0 bottom-0 h-[46%]"
          style={{
            background:
              "radial-gradient(ellipse 70% 90% at 50% 100%, rgba(224,169,56,0.14), transparent 70%)",
          }}
        />
        {/* equalizer strip — the show's pulse */}
        <div
          className="absolute inset-x-10 bottom-5 flex h-[13%] items-end gap-[3px]"
          style={{ opacity: 0.5 }}
        >
          {Array.from({ length: 36 }, (_, i) => (
            <span
              key={i}
              className="eq-bar h-full flex-1 rounded-[1px]"
              style={{
                background:
                  i % 9 === 4 ? "var(--color-accent)" : "rgba(240,238,233,0.35)",
                animationDuration: `${0.7 + ((i * 37) % 60) / 100}s`,
                animationDelay: `${-((i * 13) % 90) / 100}s`,
              }}
            />
          ))}
        </div>
        {/* scanline sheen over the screen */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(to bottom, rgba(240,238,233,0.02) 0px, rgba(240,238,233,0.02) 1px, transparent 2px, transparent 5px)",
          }}
        />
      </div>

      {/* headline */}
      <div className="relative z-20 mx-auto max-w-5xl">
        <p data-reveal className="text-eyebrow text-text-dim">
          {t.hero.eyebrow}
        </p>
        <h1
          data-reveal
          className="font-display font-medium text-display-xl mx-auto mt-8 max-w-[18ch]"
        >
          {t.hero.title}
          <span className="text-accent">.</span>
        </h1>
        <p
          data-reveal
          className="mx-auto mt-8 max-w-xl text-[length:var(--text-body-lg)] leading-relaxed text-text-dim"
        >
          {t.hero.sub}
        </p>
        <div
          data-reveal
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton
            href={t.contact.emailHref}
            className="rounded-full px-8 py-4 font-medium"
            style={{ background: "var(--color-paper)", color: "var(--color-ink)" }}
          >
            {t.ui.startProject}
          </MagneticButton>
          <MagneticButton
            href="#work"
            className="rounded-full border border-line px-8 py-4 font-medium transition-colors hover:border-accent hover:text-accent"
          >
            {t.ui.seeWork}
          </MagneticButton>
        </div>
      </div>

      {/* process cue loop — listen → design → deliver, dot travelling */}
      <div
        data-strip
        aria-hidden="true"
        className="absolute inset-x-[var(--gutter)] bottom-10 z-20 hidden md:block"
      >
        <div className="relative mx-auto max-w-3xl">
          <div
            className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2"
            style={{ background: "var(--color-line)" }}
          />
          <div
            ref={dotRef}
            className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: "var(--color-accent)",
              boxShadow: "0 0 12px rgba(224,169,56,0.8)",
            }}
          />
          <div className="relative flex justify-between">
            {steps.map((step, i) => (
              <span
                key={step.title}
                className="-translate-y-6 font-mono text-[11px] tracking-widest transition-colors duration-300"
                style={{
                  color: i === activeStep ? "var(--color-accent)" : "var(--color-text-dim)",
                }}
              >
                {String(i + 1).padStart(2, "0")} {step.title}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
