"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "@/lib/gsap";
import { useContent } from "@/components/dom/LocaleProvider";
import { useReveal } from "./useReveal";

export default function ProcessSection() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useContent();
  const [active, setActive] = useState(0);
  useReveal(ref);

  const steps = t.process.steps;

  // each tall step block marks itself active as it crosses the viewport centre,
  // driving the sticky media panel on the right
  useGSAP(
    () => {
      if (!ref.current) return;
      ref.current
        .querySelectorAll<HTMLElement>("[data-step]")
        .forEach((el) => {
          const index = Number(el.dataset.step);
          ScrollTrigger.create({
            trigger: el,
            start: "top center",
            end: "bottom center",
            onToggle: (self) => {
              if (self.isActive) setActive(index);
            },
          });
        });
    },
    { scope: ref }
  );

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
        className="font-display whitespace-nowrap px-[var(--gutter)] pt-[var(--space-section-y)] font-bold uppercase leading-[0.85]"
        style={{
          fontSize: "clamp(3rem, 13.5vw, 15rem)",
          letterSpacing: "-0.04em",
        }}
      >
        {t.process.bigTitle}
      </h2>

      <div className="px-[var(--gutter)] pb-[var(--space-section-y)]">
        <div className="mx-auto grid max-w-7xl md:grid-cols-2 md:gap-16">
          {/* LEFT — stacked, tall step blocks */}
          <ol className="list-none">
            {steps.map((step, i) => (
              <li
                key={step.title}
                data-step={i}
                className="flex min-h-[70vh] flex-col justify-center py-12 md:min-h-[86vh]"
              >
                <p
                  className="text-eyebrow transition-colors duration-500"
                  style={{ color: i === active ? "var(--color-accent)" : "var(--color-dark-dim)" }}
                >
                  {t.ui.stepLabel} • {String(i + 1).padStart(2, "0")}
                </p>
                <h3
                  className="font-display mt-6 text-display-md font-medium transition-opacity duration-500"
                  style={{ opacity: i === active ? 1 : 0.4 }}
                >
                  {step.title}
                </h3>
                <p
                  className="mt-5 max-w-md text-[length:var(--text-body-lg)] leading-relaxed transition-opacity duration-500"
                  style={{ opacity: i === active ? 1 : 0.4 }}
                >
                  {step.text}
                </p>

                {/* inline media on mobile (no sticky panel there) */}
                <div
                  className="relative mt-10 aspect-video w-full overflow-hidden rounded-sm md:hidden"
                  style={{ border: "1px solid var(--color-line-soft)" }}
                >
                  <StepMedia step={step} />
                </div>
              </li>
            ))}
          </ol>

          {/* RIGHT — sticky media panel, crossfades to the active step */}
          <div className="hidden md:block">
            <div className="sticky top-0 flex h-screen items-center">
              <div
                className="relative aspect-video w-full overflow-hidden rounded-sm"
                style={{ border: "1px solid var(--color-line-soft)" }}
              >
                {steps.map((step, i) => (
                  <div
                    key={step.title}
                    className="absolute inset-0 transition-opacity duration-700"
                    style={{ opacity: i === active ? 1 : 0 }}
                    aria-hidden={i !== active}
                  >
                    <StepMedia step={step} eager={i === active} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepMedia({
  step,
  eager = true,
}: {
  step: { title: string; video: string; poster: string };
  eager?: boolean;
}) {
  return (
    <video
      className="h-full w-full object-cover"
      src={step.video}
      poster={step.poster}
      autoPlay={eager}
      loop
      muted
      playsInline
      preload="metadata"
    />
  );
}
