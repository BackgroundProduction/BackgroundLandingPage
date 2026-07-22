"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useContent } from "@/components/dom/LocaleProvider";
import { useReveal } from "./useReveal";

const BORDER = "rgba(240, 238, 233, 0.072)";

export default function ProcessSection() {
  const ref = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { t } = useContent();
  useReveal(ref);

  // giant title drifts sideways as the section scrolls (scrubbed) — the
  // oversized-headline parallax those editorial sites use
  useGSAP(
    () => {
      if (!titleRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        titleRef.current,
        { xPercent: 0 },
        {
          xPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        }
      );
    },
    { scope: ref }
  );

  const steps = t.process.steps;

  return (
    <section
      ref={ref}
      id="process"
      aria-labelledby="process-heading"
      className="theme-dark overflow-hidden"
    >
      {/* giant full-bleed title */}
      <h2
        ref={titleRef}
        id="process-heading"
        data-reveal
        className="font-display whitespace-nowrap px-[var(--gutter)] pt-[var(--space-section-y)] pb-10 font-bold uppercase leading-[0.85]"
        style={{ fontSize: "clamp(3rem, 13.5vw, 15rem)", letterSpacing: "-0.04em" }}
      >
        {t.process.bigTitle}
      </h2>

      {/* full-width bordered rows — no gaps, a line between each */}
      <ol className="list-none" style={{ borderTop: `1px solid ${BORDER}` }}>
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr]"
            style={{ borderBottom: `1px solid ${BORDER}` }}
          >
            {/* text cell */}
            <div className="flex flex-col justify-center px-[var(--gutter)] py-10 md:py-16">
              <p className="text-eyebrow text-accent">
                {t.ui.stepLabel} • {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="font-display mt-6 text-display-md font-medium">
                {step.title}
              </h3>
              <p className="mt-5 max-w-md text-[length:var(--text-body-lg)] leading-relaxed dim">
                {step.text}
              </p>
            </div>

            {/* big media cell — fills the row, flush to the right edge */}
            <div
              className="relative min-h-[56vw] w-full overflow-hidden sm:min-h-[42vw] md:min-h-[36vw] md:border-l"
              style={{ borderColor: BORDER }}
            >
              {step.youtube ? (
                <StepYouTube id={step.youtube} />
              ) : (
                <StepVideo src={step.video} poster={step.poster} />
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Plays only while the row is on screen — avoids several videos decoding at
 * once, which was a real perf cost on weaker machines. */
function StepVideo({ src, poster }: { src: string; poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover"
      src={src}
      poster={poster}
      loop
      muted
      playsInline
      preload="metadata"
    />
  );
}

/**
 * Clean background YouTube embed: muted autoplay, looped, no controls / no
 * related videos / minimal branding. The iframe is oversized to cover the
 * cell and made non-interactive; a transparent layer on top blocks any
 * click/hover chrome so it reads as a silent background clip.
 * (A small YouTube logo can still flash briefly — the embed API does not
 * allow removing it entirely.)
 */
function StepYouTube({ id }: { id: string }) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    loop: "1",
    playlist: id, // required for loop of a single video
    modestbranding: "1",
    rel: "0",
    playsinline: "1",
    disablekb: "1",
    fs: "0",
    iv_load_policy: "3",
    cc_load_policy: "0", // no captions/transcript overlay
  });

  return (
    <div className="absolute inset-0 overflow-hidden">
      <iframe
        title="YouTube video background"
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "100vw",
          height: "56.25vw",
          minWidth: "177.78vh",
          minHeight: "100%",
          border: "none",
        }}
        src={`https://www.youtube.com/embed/${id}?${params.toString()}`}
        allow="autoplay; encrypted-media"
   
   
      />
      {/* transparent blocker — no pause on click, no hover chrome */}
      <div className="absolute inset-0" />
    </div>
  );
}
