"use client";

import { useEffect, useRef } from "react";

/**
 * A braided ribbon of light that sweeps diagonally across the page as you
 * scroll — left to right, then back again.
 *
 * The spine is a function of *document* position, not screen position: it
 * oscillates across the full width with a period of a couple of viewport
 * heights, so scrolling drags a long diagonal stroke through the window and the
 * direction reverses on its own. Each strand samples that same spine at a
 * slightly different point, which is what makes them fan out and cross.
 *
 * Toward the top and bottom of the window the bundle spreads wider and fades
 * out, so the stroke dissolves at its ends instead of being cut off.
 *
 * A 2D canvas on purpose — never WebGL — so it can't compete with the hero's
 * three.js context for the GPU. It draws *over* the sections rather than behind
 * them, because several sections paint their own opaque background.
 */

const STRANDS = 16;
const MAX_DPR = 2; // native retina — at 1.5 the 2px dashes rendered soft
const STEP = 10; // px between path samples

/* How far across the width the spine swings, as a fraction of viewport width
   either side of centre, and how many viewport heights one full left→right→left
   cycle takes. */
const SWING = 0.42;
const CYCLE_SCREENS = 2.4;

/* Dash pattern: 2px mark, 15px gap. Drawn with butt caps — round caps would add
   half a line-width at each end and close the gaps up at this size. */
const DASH: [number, number] = [2, 15];

/* Per-section visibility. The bundle now crosses the whole width, so instead of
   steering it around media we simply fade it down over the sections that are
   wall-to-wall with photos and video. */
const DIM: Record<string, number> = {
  top: 0,
  about: 1,
  principles: 0.7,
  stories: 0.85,
  work: 0.3,
  services: 1,
  process: 0.75,
  faq: 1,
  contact: 1,
};

type Strand = {
  lag: number; // samples the spine slightly ahead/behind — makes them cross
  off: number; // -1..1 across the bundle
  width: number;
  alpha: number;
  bright: boolean;
  dashSpeed: number; // how fast the dashes travel along the strand
};

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export default function ScrollParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let k = 0; // spine frequency, radians per document px
    let strands: Strand[] = [];
    let fadeGrad: CanvasGradient | null = null;
    let stops: { top: number; dim: number }[] = [];
    let raf = 0;

    const measure = () => {
      stops = Object.entries(DIM)
        .map(([id, dim]) => {
          const el = document.getElementById(id);
          if (!el) return null;
          const b = el.getBoundingClientRect();
          return { top: window.scrollY + b.top + b.height / 2, dim };
        })
        .filter((s): s is { top: number; dim: number } => s !== null)
        .sort((a, b) => a.top - b.top);
    };

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      k = (Math.PI * 2) / (CYCLE_SCREENS * h);

      // dissolve the stroke at both ends rather than cutting it off
      fadeGrad = ctx.createLinearGradient(0, 0, 0, h);
      fadeGrad.addColorStop(0, "rgba(240,238,233,0)");
      fadeGrad.addColorStop(0.26, "rgba(240,238,233,1)");
      fadeGrad.addColorStop(0.74, "rgba(240,238,233,1)");
      fadeGrad.addColorStop(1, "rgba(240,238,233,0)");

      strands = Array.from({ length: STRANDS }, (_, i) => {
        const t = i / (STRANDS - 1);
        const bright = i % 5 === 2;
        return {
          // spreading the lag turns one curve into a braid — keep it small so
          // the strands stay a tight rope rather than drifting apart
          lag: (t * 2 - 1) * h * 0.05 + (Math.random() - 0.5) * 14,
          off: t * 2 - 1 + (Math.random() - 0.5) * 0.1,
          width: bright ? 1.2 + Math.random() * 0.8 : 0.5 + Math.random() * 0.7,
          // sits behind the content now, so it needs a little more presence
          alpha: bright ? 0.34 + Math.random() * 0.16 : 0.12 + Math.random() * 0.16,
          bright,
          dashSpeed: 0.25 + Math.random() * 0.5,
        };
      });
      measure();
    };

    const dimAt = (docY: number) => {
      if (!stops.length) return 0;
      if (docY <= stops[0].top) return stops[0].dim;
      const last = stops[stops.length - 1];
      if (docY >= last.top) return last.dim;
      for (let i = 0; i < stops.length - 1; i++) {
        const a = stops[i];
        const b = stops[i + 1];
        if (docY >= a.top && docY <= b.top) {
          return a.dim + (b.dim - a.dim) * smooth((docY - a.top) / (b.top - a.top));
        }
      }
      return last.dim;
    };

    // the spine, in document space — this is what sweeps across the width.
    // On narrow screens the configured swing would carry the bundle (plus its
    // sway and end-fan, ~130px of lateral extent) past the edges, so clamp the
    // amplitude to whatever keeps the whole rope on screen.
    const spineX = (docY: number) => {
      const margin = 130;
      const swing = Math.min(SWING, Math.max(0.08, 0.5 - margin / w));
      return w * (0.5 + swing * Math.sin(docY * k));
    };

    const draw = () => {
      raf = requestAnimationFrame(draw);
      const scrollY = window.scrollY;

      // hold off until the hero is behind us, then ease in over half a screen
      const fade = clamp01((scrollY - h * 0.6) / (h * 0.5));
      ctx.clearRect(0, 0, w, h);
      if (fade <= 0 || !fadeGrad) return;

      const visible = fade * dimAt(scrollY + h / 2);
      if (visible <= 0.01) return;

      const spread = Math.min(w * 0.022, 30);
      ctx.strokeStyle = fadeGrad;

      for (const s of strands) {
        ctx.globalAlpha = s.alpha * visible;
        ctx.lineWidth = s.width;
        ctx.lineCap = "butt";
        ctx.setLineDash(DASH);
        // negative offset sends the dashes travelling down the strand as the
        // page scrolls, so the rope reads as moving rather than static
        ctx.lineDashOffset = -scrollY * s.dashSpeed;
        ctx.beginPath();
        for (let y = -STEP; y <= h + STEP; y += STEP) {
          // the ends of the stroke fan wider as they dissolve
          const edge = clamp01((Math.abs(y - h / 2) / (h / 2) - 0.3) / 0.7);
          const fan = 1 + edge * 1.7;
          const x = spineX(scrollY + y + s.lag) + s.off * spread * fan;
          if (y <= -STEP) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

      }
      ctx.setLineDash([]);
      ctx.lineDashOffset = 0;
      ctx.globalAlpha = 1;
    };

    const startLoop = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const stopLoop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    // no point animating a tab nobody is looking at
    const onVisibility = () => (document.hidden ? stopLoop() : startLoop());

    build();
    startLoop();
    window.addEventListener("resize", build);
    // sections shift as images load and pinned panels resize
    window.addEventListener("load", measure);
    document.addEventListener("visibilitychange", onVisibility);
    const remeasure = window.setInterval(measure, 2000);
    return () => {
      stopLoop();
      window.clearInterval(remeasure);
      window.removeEventListener("resize", build);
      window.removeEventListener("load", measure);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      // behind every section, image, video and line of text. The elevated
      // sections are translucent (see .theme-dark) so it still reads through.
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: -1 }}
    />
  );
}
