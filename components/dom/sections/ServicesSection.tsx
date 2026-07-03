"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { services } from "@/content/services";
import { ScrollTrigger } from "@/lib/gsap";
import { useScrollStore } from "@/lib/scroll-store";
import SectionHeading from "@/components/dom/ui/SectionHeading";
import { useSectionTrigger } from "./useSectionTrigger";

export default function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  useSectionTrigger("services", ref);

  // each card marks itself active as it crosses the viewport center,
  // driving the matching 3D motif highlight
  useGSAP(
    () => {
      if (!ref.current) return;
      const setActiveServiceIndex =
        useScrollStore.getState().setActiveServiceIndex;
      const cards = ref.current.querySelectorAll("[data-service-index]");
      cards.forEach((card) => {
        const index = Number(card.getAttribute("data-service-index"));
        ScrollTrigger.create({
          trigger: card,
          start: "top 55%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (self.isActive) setActiveServiceIndex(index);
          },
        });
      });
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      id="services"
      aria-labelledby="services-heading"
      className="relative px-6 md:px-12 lg:px-24 py-[var(--space-section-y)]"
    >
      <div className="mx-auto max-w-6xl">
        <div data-reveal>
          <SectionHeading eyebrow="What we do" id="services-heading">
            Every stage, every scale
          </SectionHeading>
        </div>

        <ol className="mt-20 md:mt-32 space-y-24 md:space-y-40 list-none">
          {services.map((service, i) => (
            <li
              key={service.slug}
              data-service-index={i}
              data-reveal
              className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-16 items-baseline"
            >
              <span
                aria-hidden="true"
                className="font-display text-display-lg text-gold-dim leading-none select-none"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="max-w-2xl">
                <h3 className="font-display font-semibold text-display-md text-cream">
                  {service.title}
                </h3>
                <p className="mt-5 text-[length:var(--text-body-lg)] text-cream-dim leading-relaxed">
                  {service.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
