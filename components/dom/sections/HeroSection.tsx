"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useContent } from "@/components/dom/LocaleProvider";
import MagneticButton from "@/components/dom/ui/MagneticButton";

const STROKE = "rgba(240, 238, 233, 0.5)";
const LABEL = "rgba(240, 238, 233, 0.45)";
const LAMP_X = [300, 480, 720, 900];
const EQ_X = [552, 565, 578, 591, 604, 617, 630, 643];

/**
 * "The venue draws itself" hero — a technical line drawing of a stage build
 * assembling on load, the way the team sets a venue: construction marks
 * (design) → platform → truss towers (rigging) → speaker stacks (sound) →
 * LED wall → mixing desk → light fixtures — then the rig POWERS ON: beams
 * light, the desk equalizer pulses, LIVE appears. Pure inline SVG, no assets.
 * Reduced motion / no-JS render the finished, lit rig statically.
 */
export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const spotX = useRef<((v: number) => void) | null>(null);
  const spotY = useRef<((v: number) => void) | null>(null);
  const { t } = useContent();

  useGSAP(
    () => {
      if (!ref.current || !svgRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const svg = svgRef.current;
      const paths = svg.querySelectorAll<SVGPathElement>("[data-draw]");
      const labels = svg.querySelectorAll<SVGTextElement>("[data-label]");
      const beams = svg.querySelectorAll<SVGPolygonElement>("[data-beam]");
      const bars = svg.querySelectorAll<SVGPathElement>("[data-eq]");
      const live = svg.querySelector<SVGTextElement>("[data-live]");

      // prime: hide everything the sequence will introduce
      paths.forEach((p) => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = `${len}`;
        p.style.strokeDashoffset = `${len}`;
      });
      gsap.set(labels, { opacity: 0 });
      gsap.set(beams, { opacity: 0 });
      if (live) gsap.set(live, { opacity: 0 });

      const draw = (group: string, duration: number) => {
        const els = svg.querySelectorAll(`[data-group="${group}"] [data-draw]`);
        return els.length
          ? gsap.to(els, { strokeDashoffset: 0, duration, ease: "power2.inOut", stagger: 0.08 })
          : null;
      };
      const label = (name: string) => {
        const el = svg.querySelector(`[data-label="${name}"]`);
        return el ? gsap.to(el, { opacity: 1, duration: 0.3 }) : null;
      };

      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

      // headline reveals in parallel with the build
      tl.fromTo(
        ref.current.querySelectorAll("[data-reveal]"),
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.85, ease: "power3.out", stagger: 0.09 },
        0.15
      );

      // ——— the build ———
      tl.add(draw("marks", 0.4)!, 0.1);
      tl.add(label("design")!, "<+0.15");
      tl.add(draw("ground", 0.5)!, ">-0.1");
      tl.add(draw("platform", 0.55)!, ">-0.15");
      tl.add(draw("truss", 1.0)!, ">-0.2");
      tl.add(label("rigging")!, "<+0.3");
      tl.add(draw("speakers", 0.6)!, ">-0.3");
      tl.add(label("sound")!, "<+0.2");
      tl.add(draw("wall", 0.7)!, ">-0.3");
      tl.add(draw("desk", 0.5)!, ">-0.2");
      tl.add(draw("fixtures", 0.5)!, ">-0.15");
      tl.add(label("lights")!, "<+0.2");

      // ——— power on ———
      tl.to(beams, { opacity: 0.45, duration: 0.7, ease: "power2.out", stagger: 0.12 }, ">+0.1");
      if (live) {
        tl.fromTo(
          live,
          { opacity: 0, scale: 0.9, transformOrigin: "50% 50%" },
          { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" },
          "<+0.3"
        );
      }
      tl.to(labels, { opacity: 0.35, duration: 0.6 }, "<");
      tl.to(spotRef.current, { opacity: 1, duration: 0.8 }, "<");

      // ——— alive: beam shimmer + equalizer pulse ———
      beams.forEach((beam, i) => {
        gsap.to(beam, {
          opacity: 0.25,
          duration: 1.6 + i * 0.35,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: 3.6 + i * 0.4,
        });
      });
      bars.forEach((bar, i) => {
        gsap.fromTo(
          bar,
          { scaleY: 0.2, transformOrigin: "50% 100%" },
          {
            scaleY: 1,
            duration: 0.5 + ((i * 29) % 40) / 100,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: 3.4 - ((i * 13) % 90) / 100,
          }
        );
      });

      // ——— followspot tracks the cursor ———
      if (spotRef.current && !window.matchMedia("(pointer: coarse)").matches) {
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

  return (
    <section
      ref={ref}
      id="top"
      aria-label="Introduction"
      onMouseMove={onMove}
      className="relative isolate flex min-h-screen flex-col justify-end overflow-hidden px-[var(--gutter)] pt-28 pb-6"
    >
      {/* followspot — warm light that follows the cursor */}
      <div
        ref={spotRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-30 hidden lg:block"
        style={{ opacity: 0 }}
      >
        <div
          className="h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(224,169,56,0.11) 0%, rgba(224,169,56,0.04) 35%, transparent 65%)",
            mixBlendMode: "screen",
          }}
        />
      </div>

      {/* headline — bold, left-aligned */}
      <div className="relative z-20 mx-auto w-full max-w-7xl">
        <p data-reveal className="text-eyebrow text-text-dim">
          {t.hero.eyebrow}
        </p>
        <h1
          data-reveal
          className="font-display font-medium mt-6 max-w-[16ch]"
          style={{
            fontSize: "clamp(2.5rem, 6.2vw, 6rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
          }}
        >
          {t.hero.title}
          <span className="text-accent">.</span>
        </h1>
        <div
          data-reveal
          className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5"
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
          <p className="max-w-md text-sm leading-relaxed text-text-dim">
            {t.hero.sub}
          </p>
        </div>
      </div>

      {/* the venue — draws itself, then powers on */}
      <svg
        ref={svgRef}
        viewBox="0 0 1200 600"
        aria-hidden="true"
        className="relative z-10 mx-auto mt-6 w-full max-w-7xl"
        fill="none"
        style={{ maxHeight: "52vh" }}
      >
        <defs>
          <linearGradient id="beam-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(224,169,56,0.55)" />
            <stop offset="100%" stopColor="rgba(224,169,56,0)" />
          </linearGradient>
        </defs>

        {/* construction marks — the design phase */}
        <g data-group="marks" stroke="var(--color-accent)" strokeWidth="1" opacity="0.6">
          <path data-draw d="M70,60 H90 M80,50 V70" />
          <path data-draw d="M1110,60 H1130 M1120,50 V70" />
          <path data-draw d="M70,470 H90 M80,460 V480" />
        </g>

        {/* ground */}
        <g data-group="ground" stroke={STROKE} strokeWidth="1.2">
          <path data-draw d="M40,560 H1160" />
        </g>

        {/* stage platform */}
        <g data-group="platform" stroke={STROKE} strokeWidth="1.2">
          <path data-draw d="M200,560 V470 H1000 V560" />
          <path data-draw d="M200,514 H1000" />
        </g>

        {/* truss towers + top beam — rigging */}
        <g data-group="truss" stroke={STROKE} strokeWidth="1.1">
          <path data-draw d="M150,560 V140 M190,560 V140 M150,140 H190" />
          <path
            data-draw
            d="M150,540 L190,500 L150,460 L190,420 L150,380 L190,340 L150,300 L190,260 L150,220 L190,180"
          />
          <path data-draw d="M1050,560 V140 M1010,560 V140 M1010,140 H1050" />
          <path
            data-draw
            d="M1050,540 L1010,500 L1050,460 L1010,420 L1050,380 L1010,340 L1050,300 L1010,260 L1050,220 L1010,180"
          />
          <path data-draw d="M190,140 H1010 M190,178 H1010" />
          <path
            data-draw
            d="M190,178 L230,140 L270,178 L310,140 L350,178 L390,140 L430,178 L470,140 L510,178 L550,140 L590,178 L630,140 L670,178 L710,140 L750,178 L790,140 L830,178 L870,140 L910,178 L950,140 L990,178"
          />
        </g>

        {/* speaker stacks — sound */}
        <g data-group="speakers" stroke={STROKE} strokeWidth="1.1">
          <path data-draw d="M235,470 V400 H300 V470" />
          <path data-draw d="M242,400 V352 H293 V400" />
          <path data-draw d="M900,470 V400 H965 V470" />
          <path data-draw d="M907,400 V352 H958 V400" />
        </g>

        {/* LED wall */}
        <g data-group="wall" stroke={STROKE} strokeWidth="1.1">
          <path data-draw d="M450,210 H750 V420 H450 Z" />
          <path data-draw d="M550,210 V420 M650,210 V420 M450,280 H750 M450,350 H750" opacity="0.5" />
        </g>

        {/* mixing desk + equalizer — music production */}
        <g data-group="desk" stroke={STROKE} strokeWidth="1.1">
          <path data-draw d="M540,470 V430 H660 V470" />
          {EQ_X.map((x, i) => (
            <path
              key={x}
              data-draw
              data-eq
              d={`M${x},466 V${438 + ((i * 7) % 18)}`}
              stroke="var(--color-accent)"
              strokeWidth="4"
              opacity="0.75"
            />
          ))}
        </g>

        {/* light fixtures */}
        <g data-group="fixtures" stroke={STROKE} strokeWidth="1.1">
          {LAMP_X.map((x) => (
            <path key={x} data-draw d={`M${x},178 V198 M${x - 14},198 H${x + 14} L${x + 9},222 H${x - 9} L${x - 14},198`} />
          ))}
        </g>

        {/* beams — power on */}
        {LAMP_X.map((x) => (
          <polygon
            key={x}
            data-beam
            points={`${x - 9},222 ${x + 9},222 ${x + 95},470 ${x - 95},470`}
            fill="url(#beam-grad)"
            opacity="0.45"
          />
        ))}

        {/* phase labels */}
        <g
          className="font-mono"
          fontSize="12"
          letterSpacing="2"
          fill={LABEL}
          stroke="none"
        >
          <text data-label="design" x="64" y="94">
            {t.hero.rig.design}
          </text>
          <text data-label="rigging" x="1062" y="304">
            {t.hero.rig.rigging}
          </text>
          <text data-label="sound" x="228" y="592">
            {t.hero.rig.sound}
          </text>
          <text data-label="lights" x="762" y="114">
            {t.hero.rig.lights}
          </text>
          <text
            data-live
            x="600"
            y="96"
            textAnchor="middle"
            fontSize="15"
            letterSpacing="8"
            style={{ fill: "var(--color-accent)" }}
          >
            ● {t.hero.rig.live}
          </text>
        </g>
      </svg>
    </section>
  );
}
