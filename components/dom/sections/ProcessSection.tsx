"use client";

import { useEffect, useRef } from "react";
import { useContent } from "@/components/dom/LocaleProvider";
import { useReveal } from "./useReveal";

const BORDER = "rgba(240, 238, 233, 0.16)";

export default function ProcessSection() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useContent();
  useReveal(ref);

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
              <StepVideo src={step.video} poster={step.poster} />
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
