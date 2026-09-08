"use client";

import { useEffect, useRef } from "react";

/**
 * A braided stream of light — soft glowing particles — that sweeps diagonally
 * across the page as you scroll, left to right and back again.
 *
 * The spine is a function of *document* position, not screen position: it
 * oscillates across the full width with a period of a couple of viewport
 * heights, so scrolling drags a long diagonal stroke through the window and the
 * direction reverses on its own. Each strand samples that same spine at a
 * slightly different point, which is what makes the strands fan out and cross.
 *
 * The strands are drawn as rows of soft dots (an offscreen glow sprite) with
 * additive `lighter` compositing, so where dots overlap they brighten — the
 * same galaxy-particle language as the hero. The dots travel along each strand
 * as the page scrolls, so the stream reads as moving rather than static.
 *
 * Toward the top and bottom of the window the bundle spreads wider and fades
 * out, so the stroke dissolves at its ends instead of being cut off.
 *
 * A 2D canvas on purpose — never WebGL — so it can't compete with the hero's
 * three.js context for the GPU. It draws *over* the sections rather than behind
 * them, because several sections paint their own opaque background.
 */

const STRANDS = 16;
const MAX_DPR = 2;

/* How far across the width the spine swings, as a fraction of viewport width
   either side of centre, and how many viewport heights one full left→right→left
   cycle takes. */
const SWING = 0.42;
const CYCLE_SCREENS = 2.4;

/* Spacing between glowing dots along a strand, in px. */
const GAP = 15;

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
  radius: number; // dot glow radius in px
  alpha: number;
  bright: boolean;
  speed: number; // how fast the dots travel along the strand
  twk: number; // per-strand twinkle phase offset
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

    // offscreen glow sprite: a cream star with a tight core and a soft halo,
    // matching the hero particles. Drawn (scaled) at every dot — far cheaper
    // than building a radial gradient per dot per frame.
    const SP = 48;
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = SP;
    const sctx = sprite.getContext("2d");
    if (sctx) {
      const g = sctx.createRadialGradient(SP / 2, SP / 2, 0, SP / 2, SP / 2, SP / 2);
      // cool white to match the hero's particle palette
      g.addColorStop(0, "rgba(228,236,255,1)");
      g.addColorStop(0.16, "rgba(228,236,255,0.85)");
      g.addColorStop(0.4, "rgba(228,236,255,0.28)");
      g.addColorStop(0.7, "rgba(228,236,255,0.07)");
      g.addColorStop(1, "rgba(228,236,255,0)");
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, SP, SP);
    }

    let w = 0;
    let h = 0;
    let k = 0; // spine frequency, radians per document px
    let strands: Strand[] = [];
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

      strands = Array.from({ length: STRANDS }, (_, i) => {
        const t = i / (STRANDS - 1);
        const bright = i % 5 === 2;
        return {
          // spreading the lag turns one curve into a braid — keep it small so
          // the strands stay a tight rope rather than drifting apart
          lag: (t * 2 - 1) * h * 0.05 + (Math.random() - 0.5) * 14,
          off: t * 2 - 1 + (Math.random() - 0.5) * 0.1,
          radius: bright ? 2.6 + Math.random() * 1.2 : 1.3 + Math.random() * 0.9,
          // sits behind the content now, so it needs a little presence
          alpha: bright ? 0.5 + Math.random() * 0.22 : 0.18 + Math.random() * 0.16,
          bright,
          speed: 0.25 + Math.random() * 0.5,
          twk: Math.random() * Math.PI * 2,
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

    // vertical dissolve at the top and bottom of the window (baked per-dot,
    // since additive compositing can't be masked by an overlay gradient)
    const endFade = (y: number) => {
      const t = y / h;
      if (t < 0.26) return clamp01(t / 0.26);
      if (t > 0.74) return clamp01((1 - t) / 0.26);
      return 1;
    };

    const draw = () => {
      raf = requestAnimationFrame(draw);
      const scrollY = window.scrollY;

      ctx.clearRect(0, 0, w, h);
      // hold off until the hero is behind us, then ease in over half a screen
      const fade = clamp01((scrollY - h * 0.6) / (h * 0.5));
      if (fade <= 0) return;

      const visible = fade * dimAt(scrollY + h / 2);
      if (visible <= 0.01) return;

      const spread = Math.min(w * 0.022, 30);
      const now = performance.now();
      ctx.globalCompositeOperation = "lighter";

      for (const s of strands) {
        // dots travel along the strand as the page scrolls
        const travel = (((scrollY * s.speed) % GAP) + GAP) % GAP;
        for (let yi = -1; ; yi++) {
          const y = yi * GAP + travel;
          if (y > h + GAP) break;
          if (y < -GAP) continue;

          const ef = endFade(y);
          if (ef <= 0) continue;

          // the ends of the stream fan wider as they dissolve
          const edge = clamp01((Math.abs(y - h / 2) / (h / 2) - 0.3) / 0.7);
          const fan = 1 + edge * 1.7;
          const x = spineX(scrollY + y + s.lag) + s.off * spread * fan;

          // gentle twinkle so the stream shimmers like a starfield
          const tw = 0.72 + 0.28 * Math.sin(now * 0.0012 + yi * 1.7 + s.twk);
          const a = s.alpha * visible * ef * tw;
          if (a <= 0.01) continue;

          const r = s.radius;
          ctx.globalAlpha = clamp01(a);
          ctx.drawImage(sprite, x - r, y - r, r * 2, r * 2);
        }
      }

      ctx.globalCompositeOperation = "source-over";
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
