"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useContent } from "@/components/dom/LocaleProvider";
import { useReveal } from "./useReveal";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t } = useContent();
  useReveal(ref, true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
  }, []);

  useGSAP(
    () => {
      if (!ref.current || !videoWrapRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        videoWrapRef.current,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      id="top"
      aria-label="Introduction"
      className="relative isolate flex min-h-[92vh] flex-col items-center justify-center overflow-hidden bg-bg px-[var(--gutter)] pt-32 pb-16 text-center"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-bg"
        aria-hidden
      >
        <div
          ref={videoWrapRef}
          className="absolute inset-x-0 top-0 h-[120%] will-change-transform"
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            style={{ background: "var(--color-bg)" }}
            src="/assets/hero-bg.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
          {/* dark wash so the light headline stays legible over the footage */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.55) 55%, rgba(10,10,10,0.82) 100%)",
            }}
          />
        </div>
        {/* fade the video into the page background at the bottom edge */}
        <div
          className="absolute inset-x-0 bottom-0 h-40 sm:h-52"
          style={{
            background: "linear-gradient(to bottom, transparent 0%, #0a0a0a 92%)",
          }}
        />
      </div>

      <div className="relative z-10">
        <p data-reveal className="text-eyebrow text-text-dim">
          {t.hero.eyebrow}
        </p>
        <h1
          data-reveal
          className="font-display font-medium text-display-xl mx-auto mt-10 max-w-[18ch]"
        >
          {t.hero.title}
          <span className="text-accent">.</span>
        </h1>
        <p
          data-reveal
          className="mx-auto mt-10 max-w-xl text-[length:var(--text-body-lg)] leading-relaxed text-text-dim"
        >
          {t.hero.sub}
        </p>
        <div
          data-reveal
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href={t.contact.emailHref}
            className="rounded-full px-8 py-4 font-medium transition-transform hover:scale-[1.03]"
            style={{ background: "var(--color-paper)", color: "var(--color-ink)" }}
          >
            {t.ui.startProject}
          </a>
          <a
            href="#work"
            className="rounded-full border border-line px-8 py-4 font-medium transition-colors hover:border-accent hover:text-accent"
          >
            {t.ui.seeWork}
          </a>
        </div>
      </div>
    </section>
  );
}
