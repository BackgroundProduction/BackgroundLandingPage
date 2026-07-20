"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import installationEdges from "@/lib/installation-edges.json";

const ACCENT = "#f0eee9";
const WIRE = "#6f6c66";
const WIRE_DIM = "#3a3833";
const BG = "#0a0a0a";

// arch truss span (feet at ±SPAN_X on the ground) and apex height
const SPAN_X = 9;
const ARCH_H = 9.6;
const archY = (x: number) => ARCH_H * (1 - (x / SPAN_X) ** 2);

const LAMP_X = [-6, -2, 2, 6];
const ARRAY_X = [-5.2, 5.2];

// scene cycle: hold each picture, then morph to the next (stage → film
// camera → conference hall → gala/state event → photo scenes → back around).
// The scene count is dynamic: 4 drawn venues + however many photos load.
const HOLD = 5;
const MORPH = 3;
const SEG_T = HOLD + MORPH;
const STAGGER = 0.35; // fraction of the morph spent staggering dot starts

// real event photos rendered as particles, appended to the cycle after the
// drawn venues — edges become dots. Busy wide shots read fuzzy at this dot
// budget (tried and rejected); prefer one strong subject on a plain field.
const PHOTO_SCENES: string[] = [];

/**
 * Orbit state lives at module scope: it is written by DOM pointer events and
 * read/damped every frame inside the Canvas — a single mutable store keeps
 * both worlds in sync without prop mutation (one hero per page).
 */
const orbit = {
  active: false,
  lastX: 0,
  lastY: 0,
  vel: 0,
  targetY: 0.5,
  curY: 0.5,
  targetX: 0.07,
  curX: 0.07,
};

/** Morph progress shared with the scenery: `flat` (1 = photo scene) swings
 *  the orbit to face the viewer, since photo scenes are flat billboards. */
const morphShared = { m: 0, flat: 0 };

// scenes 0..8 are the drawn venues; photo scenes are appended after
const DRAWN_SCENES = 9;

/* ------------------------------------------------------------------ */
/* Line-sketch builders: every scene is one flat list of segments      */
/* with per-vertex colors, so any scene can morph into any other.      */
/* ------------------------------------------------------------------ */

interface Sk {
  pos: number[];
  col: number[];
}

const bgColor = new THREE.Color(BG);
/** Bake opacity into the vertex color by mixing toward the background. */
const tone = (hex: string, opacity: number) =>
  bgColor.clone().lerp(new THREE.Color(hex), opacity);

function seg(
  s: Sk,
  x1: number, y1: number, z1: number,
  x2: number, y2: number, z2: number,
  c: THREE.Color
) {
  s.pos.push(x1, y1, z1, x2, y2, z2);
  s.col.push(c.r, c.g, c.b, c.r, c.g, c.b);
}

/** Circle of segments around the given axis; optional [dash, gap] pattern. */
function ring(
  s: Sk, c: THREE.Color,
  cx: number, cy: number, cz: number,
  r: number, axis: "x" | "y" | "z", n = 48,
  dash?: [number, number]
) {
  const pt = (a: number): [number, number, number] =>
    axis === "y"
      ? [cx + Math.cos(a) * r, cy, cz + Math.sin(a) * r]
      : axis === "z"
        ? [cx + Math.cos(a) * r, cy + Math.sin(a) * r, cz]
        : [cx, cy + Math.sin(a) * r, cz + Math.cos(a) * r];
  const step = (Math.PI * 2) / n;
  for (let i = 0; i < n; i++) {
    if (dash && (i * step * r) % (dash[0] + dash[1]) > dash[0]) continue;
    const [x1, y1, z1] = pt(i * step);
    const [x2, y2, z2] = pt((i + 1) * step);
    seg(s, x1, y1, z1, x2, y2, z2, c);
  }
}

/** 12 box edges around a center, with an optional Euler rotation. */
function box(
  s: Sk, c: THREE.Color,
  cx: number, cy: number, cz: number,
  sx: number, sy: number, sz: number,
  rot?: [number, number, number]
) {
  const e = rot ? new THREE.Euler(rot[0], rot[1], rot[2]) : null;
  const v = (i: number) => {
    const p = new THREE.Vector3(
      ((i >> 2) & 1 ? 1 : -1) * (sx / 2),
      ((i >> 1) & 1 ? 1 : -1) * (sy / 2),
      (i & 1 ? 1 : -1) * (sz / 2)
    );
    if (e) p.applyEuler(e);
    return p;
  };
  const E = [
    [0, 1], [2, 3], [4, 5], [6, 7],
    [0, 2], [1, 3], [4, 6], [5, 7],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ];
  for (const [a, b] of E) {
    const p = v(a);
    const q = v(b);
    seg(s, p.x + cx, p.y + cy, p.z + cz, q.x + cx, q.y + cy, q.z + cz, c);
  }
}

/** Rectangle frame in the YZ plane at a fixed x (matte-box openings). */
function rectX(s: Sk, c: THREE.Color, x: number, cy: number, cz: number, hy: number, hz: number) {
  seg(s, x, cy - hy, cz - hz, x, cy + hy, cz - hz, c);
  seg(s, x, cy + hy, cz - hz, x, cy + hy, cz + hz, c);
  seg(s, x, cy + hy, cz + hz, x, cy - hy, cz + hz, c);
  seg(s, x, cy - hy, cz + hz, x, cy - hy, cz - hz, c);
}

/** 12 octahedron edges — the moving-head lamp bodies. */
function octa(s: Sk, c: THREE.Color, cx: number, cy: number, cz: number, r: number) {
  const v: [number, number, number][] = [
    [r, 0, 0], [-r, 0, 0], [0, r, 0], [0, -r, 0], [0, 0, r], [0, 0, -r],
  ];
  const E = [
    [0, 2], [0, 3], [0, 4], [0, 5],
    [1, 2], [1, 3], [1, 4], [1, 5],
    [2, 4], [2, 5], [3, 4], [3, 5],
  ];
  for (const [a, b] of E)
    seg(s, v[a][0] + cx, v[a][1] + cy, v[a][2] + cz, v[b][0] + cx, v[b][1] + cy, v[b][2] + cz, c);
}

/** Straight truss beam in the XY plane: chords, zigzag web, z-rungs. */
function trussBeam(
  s: Sk, c: THREE.Color,
  ax: number, ay: number, bx: number, by: number,
  chord = 0.45, halfDepth = 0.28, bays = 14
) {
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy);
  const px = (-dy / len) * chord;
  const py = (dx / len) * chord;
  const P = (i: number): [number, number] => [ax + (dx * i) / bays, ay + (dy * i) / bays];
  for (const z of [-halfDepth, halfDepth]) {
    for (let i = 0; i < bays; i++) {
      const [x1, y1] = P(i);
      const [x2, y2] = P(i + 1);
      seg(s, x1, y1, z, x2, y2, z, c);
      seg(s, x1 + px, y1 + py, z, x2 + px, y2 + py, z, c);
      if (i % 2) seg(s, x1 + px, y1 + py, z, x2, y2, z, c);
      else seg(s, x1, y1, z, x2 + px, y2 + py, z, c);
      seg(s, x1, y1, z, x1 + px, y1 + py, z, c);
    }
    const [xe, ye] = P(bays);
    seg(s, xe, ye, z, xe + px, ye + py, z, c);
  }
  for (let i = 0; i <= bays; i += 2) {
    const [x, y] = P(i);
    seg(s, x, y, -halfDepth, x, y, halfDepth, c);
    seg(s, x + px, y + py, -halfDepth, x + px, y + py, halfDepth, c);
  }
}

/** Parabolic arch truss: two chord curves per side, verticals + zigzag web. */
function archTruss(s: Sk, c: THREE.Color) {
  const N = 26;
  const w = 0.35; // half-depth in z
  const d = 0.62; // chord separation
  const xa = (i: number) => -SPAN_X + (2 * SPAN_X * i) / N;
  for (const z of [-w, w]) {
    for (let i = 0; i < N; i++) {
      const x1 = xa(i);
      const x2 = xa(i + 1);
      const y1 = archY(x1);
      const y2 = archY(x2);
      seg(s, x1, y1, z, x2, y2, z, c);
      seg(s, x1, y1 + d, z, x2, y2 + d, z, c);
      if (i % 2) seg(s, x1, y1 + d, z, x2, y2, z, c);
      else seg(s, x1, y1, z, x2, y2 + d, z, c);
      seg(s, x1, y1, z, x1, y1 + d, z, c);
    }
    const xe = xa(N);
    seg(s, xe, archY(xe), z, xe, archY(xe) + d, z, c);
  }
  for (let i = 0; i <= N; i += 2) {
    const x = xa(i);
    const y = archY(x);
    seg(s, x, y, -w, x, y, w, c);
    seg(s, x, y + d, -w, x, y + d, w, c);
  }
}

/** Scene A — the concert stage: deck, arch truss, portal, PA, lamp heads.
 *  `s` = structure pool (fine dust), `a` = accent pool (bright dots). */
function buildStage(s: Sk, a: Sk) {
  const w45 = tone(WIRE, 0.45);
  const w5 = tone(WIRE, 0.5);
  const w6 = tone(WIRE, 0.6);
  const w65 = tone(WIRE, 0.65);
  const w8 = tone(WIRE, 0.8);
  const dim8 = tone(WIRE_DIM, 0.8);

  // circular stage deck rims + inset marking
  ring(s, w65, 0, 0, 0, 7.5, "y", 64);
  ring(s, w65, 0, 1, 0, 7.5, "y", 64);
  ring(s, dim8, 0, 1.01, 0, 5.6, "y", 64);

  archTruss(s, w5);

  // ring "portal" upstage center — where a screen would hang
  ring(a, tone(ACCENT, 0.4), 0, 4.4, -2.8, 3.4, "z", 72);
  ring(s, w45, 0, 4.4, -2.8, 2.75, "z", 72);
  ring(a, tone(ACCENT, 0.55), 0, 4.4, -2.8, 2.05, "z", 96, [0.42, 0.28]);

  // cylindrical PA totems on the deck edges
  for (const x of [-6.2, 6.2]) {
    ring(s, w6, x, 1.0, 1, 0.75, "y", 32);
    ring(s, w6, x, 2.6, 1, 0.75, "y", 32);
    ring(s, w6, x, 2.6, 1, 0.58, "y", 24);
    ring(s, w6, x, 3.7, 1, 0.58, "y", 24);
  }

  // hanging line arrays, cabinets angled progressively
  for (const x of ARRAY_X) {
    const topY = archY(x);
    seg(s, x, topY, 0.2, x, topY - 1.35, 1.1, dim8);
    for (let i = 0; i < 5; i++)
      box(s, w6, x, topY - 1.65 - i * 0.58, 1.1 + i * 0.06, 1.15, 0.5, 0.75, [i * 0.09, 0, 0]);
  }

  // moving-head lamp bodies riding the arch
  for (const x of LAMP_X) octa(s, w8, x, archY(x) - 0.4, 0, 0.42);
}

/** Scene B — film production: cinema camera on a crane, dolly track, reticle. */
function buildCamera(s: Sk, a: Sk) {
  const rail = tone(WIRE_DIM, 0.9);
  const sleeper = tone(WIRE_DIM, 0.6);
  const w5 = tone(WIRE, 0.5);
  const w6 = tone(WIRE, 0.6);
  const w8 = tone(WIRE, 0.8);
  const dim8 = tone(WIRE_DIM, 0.8);
  const acc45 = tone(ACCENT, 0.45);
  const acc55 = tone(ACCENT, 0.55);

  // dolly track: two rails + sleepers
  for (const z of [-1.05, 1.05])
    for (let i = 0; i < 10; i++) {
      const x = -8.5 + i * 0.78;
      seg(s, x, 0.04, z, x + 0.78, 0.04, z, rail);
    }
  for (let x = -8.3; x <= -0.9; x += 0.92) seg(s, x, 0.02, -1.3, x, 0.02, 1.3, sleeper);

  // dolly base, wheels, turntable, pivot mast
  box(s, w6, -4.5, 0.62, 0, 3.0, 0.5, 1.8);
  for (const dx of [-1.1, 1.1])
    for (const z of [-1.05, 1.05]) ring(s, w5, -4.5 + dx, 0.32, z, 0.32, "z", 20);
  ring(s, w6, -4.5, 0.9, 0, 1.0, "y", 40);
  ring(s, w5, -4.5, 1.32, 0, 0.55, "y", 24);
  box(s, w6, -4.5, 1.6, 0, 0.55, 0.6, 0.55);

  // crane arm up to the head + short rear arm to the counterweight
  trussBeam(s, w5, -4.5, 1.9, 3.0, 5.4, 0.45, 0.28, 14);
  trussBeam(s, w5, -4.5, 1.9, -6.5, 1.2, 0.45, 0.28, 4);
  box(s, w6, -6.9, 1.25, 0, 0.95, 1.15, 0.95);

  // head platform + camera body
  box(s, dim8, 3.0, 5.2, 0, 0.85, 0.32, 0.85);
  box(s, w8, 3.9, 5.55, 0, 2.0, 1.25, 1.05);

  // lens barrel: stepped rings + spokes
  ring(s, w6, 4.95, 5.55, 0, 0.42, "x", 24);
  ring(s, w6, 5.3, 5.55, 0, 0.42, "x", 24);
  ring(s, w6, 5.55, 5.55, 0, 0.34, "x", 20);
  for (let k = 0; k < 6; k++) {
    const ang = (k * Math.PI) / 3;
    seg(
      s,
      4.95, 5.55 + Math.sin(ang) * 0.42, Math.cos(ang) * 0.42,
      5.55, 5.55 + Math.sin(ang) * 0.34, Math.cos(ang) * 0.34,
      w5
    );
  }

  // matte box: small opening flaring to a large front frame
  rectX(s, w6, 5.8, 5.55, 0, 0.48, 0.55);
  rectX(s, w6, 6.3, 5.62, 0, 0.78, 0.9);
  for (const [sy, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]] as const)
    seg(s, 5.8, 5.55 + sy * 0.48, sz * 0.55, 6.3, 5.62 + sy * 0.78, sz * 0.9, w5);

  // twin film magazines on top (accent — echoes the portal rings)
  for (const cx of [3.4, 4.85]) {
    for (const z of [-0.3, 0.3]) ring(a, acc45, cx, 6.7, z, 0.72, "z", 40);
    for (let k = 0; k < 6; k++) {
      const ang = (k * Math.PI) / 3;
      seg(
        s,
        cx + Math.cos(ang) * 0.72, 6.7 + Math.sin(ang) * 0.72, -0.3,
        cx + Math.cos(ang) * 0.72, 6.7 + Math.sin(ang) * 0.72, 0.3,
        w5
      );
    }
    ring(a, acc55, cx, 6.7, 0.31, 0.26, "z", 16);
  }

  // viewfinder eyepiece, rear-left
  ring(s, w5, 2.6, 5.95, 0.72, 0.2, "x", 16);
  ring(s, w5, 3.0, 5.95, 0.72, 0.2, "x", 16);
  seg(s, 2.6, 6.15, 0.72, 3.0, 6.15, 0.72, w5);
  seg(s, 2.6, 5.75, 0.72, 3.0, 5.75, 0.72, w5);

  // focus reticle floating ahead of the lens (dashed, accent)
  ring(a, acc55, 7.5, 5.55, 0, 1.5, "x", 96, [0.42, 0.28]);
  for (const [dy, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const)
    seg(a, 7.5, 5.55 + dy * 1.28, dz * 1.28, 7.5, 5.55 + dy * 1.72, dz * 1.72, acc45);

  // spotlight on a tripod stand, downstage right
  const lx = 6.2;
  const lz = -3.4;
  for (const ang of [Math.PI / 2, Math.PI / 2 + 2.09, Math.PI / 2 + 4.19])
    seg(s, lx, 2.2, lz, lx + Math.cos(ang) * 0.95, 0, lz + Math.sin(ang) * 0.95, w5);
  box(s, w6, lx, 2.62, lz, 0.6, 0.55, 0.6, [0.25, -0.5, 0]);
  ring(s, w6, lx + 0.34, 2.62, lz + 0.2, 0.28, "x", 16);
}

/** Simple chair: seat + backrest. `yaw` is the direction it faces
 *  (0 = toward +z, Math.PI = toward -z). */
function chair(
  s: Sk, c: THREE.Color,
  x: number, yBase: number, z: number,
  yaw: number, scale = 1
) {
  box(s, c, x, yBase + 0.52 * scale, z, 0.5 * scale, 0.08 * scale, 0.5 * scale, [0, yaw, 0]);
  box(
    s, c,
    x - Math.sin(yaw) * 0.26 * scale,
    yBase + 0.84 * scale,
    z - Math.cos(yaw) * 0.26 * scale,
    0.5 * scale, 0.6 * scale, 0.08 * scale,
    [0, yaw, 0]
  );
}

/** Scene C — conferences & forums: dais, screen with charts, podium,
 *  panel table, audience rows, hanging banners. */
function buildConference(s: Sk, a: Sk) {
  const w45 = tone(WIRE, 0.45);
  const w5 = tone(WIRE, 0.5);
  const w6 = tone(WIRE, 0.6);
  const w8 = tone(WIRE, 0.8);
  const dim8 = tone(WIRE_DIM, 0.8);
  const acc45 = tone(ACCENT, 0.45);
  const acc55 = tone(ACCENT, 0.55);

  // stage dais
  box(s, w6, 0, 0.35, -1.5, 12, 0.7, 5);

  // big presentation screen upstage
  const sy = 5.2;
  const sz = -3.6;
  // outer frame (accent) — the visual anchor of the scene
  seg(a,-4.8, sy - 2.5, sz, 4.8, sy - 2.5, sz, acc45);
  seg(a,4.8, sy - 2.5, sz, 4.8, sy + 2.5, sz, acc45);
  seg(a,4.8, sy + 2.5, sz, -4.8, sy + 2.5, sz, acc45);
  seg(a,-4.8, sy + 2.5, sz, -4.8, sy - 2.5, sz, acc45);
  // inner bezel (structure)
  seg(s,-4.5, sy - 2.2, sz, 4.5, sy - 2.2, sz, w45);
  seg(s,4.5, sy - 2.2, sz, 4.5, sy + 2.2, sz, w45);
  seg(s,4.5, sy + 2.2, sz, -4.5, sy + 2.2, sz, w45);
  seg(s,-4.5, sy + 2.2, sz, -4.5, sy - 2.2, sz, w45);
  // support poles down to the dais
  seg(s,-3.4, sy - 2.5, sz, -3.4, 0.7, sz, w5);
  seg(s,3.4, sy - 2.5, sz, 3.4, 0.7, sz, w5);

  // on-screen chart: ascending bars (right half, accent)
  const bh = [0.7, 1.2, 1.6, 2.1, 2.7];
  for (let i = 0; i < 5; i++) {
    const bx = 0.5 + i * 0.75;
    const h = bh[i];
    seg(a,bx - 0.26, 3.55, sz + 0.05, bx - 0.26, 3.55 + h, sz + 0.05, acc55);
    seg(a,bx - 0.26, 3.55 + h, sz + 0.05, bx + 0.26, 3.55 + h, sz + 0.05, acc55);
    seg(a,bx + 0.26, 3.55 + h, sz + 0.05, bx + 0.26, 3.55, sz + 0.05, acc55);
    seg(a,bx + 0.26, 3.55, sz + 0.05, bx - 0.26, 3.55, sz + 0.05, acc55);
  }
  // on-screen pie chart (left half, dashed accent ring + two slice lines)
  ring(a, acc55, -2.5, sy + 0.1, sz + 0.05, 1.15, "z", 64, [0.42, 0.28]);
  seg(a,-2.5, sy + 0.1, sz + 0.05, -2.5, sy + 1.25, sz + 0.05, acc45);
  seg(a,-2.5, sy + 0.1, sz + 0.05, -3.5, sy - 0.47, sz + 0.05, acc45);

  // podium with gooseneck mic (stage left)
  box(s, w6, -2.6, 1.28, -0.5, 0.9, 1.15, 0.7);
  box(s, w6, -2.6, 1.94, -0.5, 1.0, 0.08, 0.8, [0.25, 0, 0]);
  seg(s,-2.45, 1.98, -0.5, -2.2, 2.35, -0.5, w5);
  octa(s, w8, -2.2, 2.42, -0.5, 0.09);

  // panel table with skirt, chairs and table mics (stage right)
  box(s, w6, 2.2, 1.48, -0.8, 4.8, 0.14, 1.2);
  box(s, w5, 2.2, 1.05, -0.28, 4.8, 0.72, 0.08);
  for (const x of [0.9, 2.2, 3.5]) {
    chair(s, w5, x, 0.7, -1.7, 0, 0.95);
    seg(s,x, 1.56, -0.85, x + 0.14, 1.84, -0.95, w5);
    octa(s, w8, x + 0.16, 1.87, -0.97, 0.06);
  }

  // audience rows facing the dais
  for (let row = 0; row < 3; row++) {
    const z = 1.9 + row * 1.25;
    const off = row % 2 ? 0.45 : 0;
    for (let i = 0; i < 6; i++) {
      const x = -4.5 + off + i * 1.8;
      chair(s, w5, x, 0, z, Math.PI);
    }
  }
  // aisle marks on the floor
  seg(s, -1.3, 0.02, 0.9, -1.3, 0.02, 6.2, dim8);
  seg(s, 1.3, 0.02, 0.9, 1.3, 0.02, 6.2, dim8);

  // hanging banners flanking the hall
  for (const x of [-5.4, 5.4]) {
    seg(s,x - 0.7, 9.1, -2, x + 0.7, 9.1, -2, w45);
    seg(s,x + 0.7, 9.1, -2, x + 0.7, 6.9, -2, w45);
    seg(s,x + 0.7, 6.9, -2, x - 0.7, 6.9, -2, w45);
    seg(s,x - 0.7, 6.9, -2, x - 0.7, 9.1, -2, w45);
    seg(s, x, 9.1, -2, x, 9.9, -2, dim8);
  }
}

/** Scene D — government & private events: colonnade, flags and podium,
 *  red-carpet walk with rope stanchions, gala tables, chandelier. */
function buildGala(s: Sk, a: Sk) {
  const w45 = tone(WIRE, 0.45);
  const w5 = tone(WIRE, 0.5);
  const w6 = tone(WIRE, 0.6);
  const w8 = tone(WIRE, 0.8);
  const dim8 = tone(WIRE_DIM, 0.8);
  const acc45 = tone(ACCENT, 0.45);
  const acc55 = tone(ACCENT, 0.55);

  // colonnade across the back with architrave
  for (const x of [-6.5, -4, 4, 6.5]) {
    seg(s, x - 0.35, 0.4, -4.5, x - 0.35, 5.3, -4.5, w5);
    seg(s, x + 0.35, 0.4, -4.5, x + 0.35, 5.3, -4.5, w5);
    box(s, w6, x, 5.5, -4.5, 1.1, 0.4, 1.1);
    box(s, w6, x, 0.2, -4.5, 1.1, 0.4, 1.1);
  }
  box(s, w45, 0, 5.95, -4.5, 14.2, 0.5, 1.0);

  // flags flanking the podium (cloth is accent, with a fold line)
  for (const dx of [-2.3, 2.3]) {
    const dir = dx < 0 ? -1 : 1;
    seg(s, dx, 0, -3, dx, 5.4, -3, w6);
    octa(s, w8, dx, 5.52, -3, 0.1);
    seg(a, dx, 5.3, -3, dx + dir * 1.05, 5.3, -3, acc45);
    seg(a, dx + dir * 1.05, 5.3, -3, dx + dir * 1.05, 4.62, -3, acc45);
    seg(a, dx + dir * 1.05, 4.62, -3, dx, 4.62, -3, acc45);
    seg(a, dx, 4.62, -3, dx, 5.3, -3, acc45);
    seg(a, dx, 5.3, -3, dx + dir * 1.05, 4.62, -3, acc45);
  }

  // centered podium at the head of the carpet
  box(s, w6, 0, 1.28, -2.2, 0.95, 1.15, 0.7);
  box(s, w6, 0, 1.94, -2.2, 1.05, 0.08, 0.8, [0.25, 0, 0]);
  seg(s, 0.15, 1.98, -2.2, 0.35, 2.35, -2.2, w5);
  octa(s, w8, 0.38, 2.42, -2.2, 0.08);

  // red-carpet walk with stanchions and sagging ropes (accent)
  seg(s, -1.1, 0.02, -1.4, -1.1, 0.02, 6.4, dim8);
  seg(s, 1.1, 0.02, -1.4, 1.1, 0.02, 6.4, dim8);
  const posts = [0.2, 1.9, 3.6, 5.3];
  for (const sx of [-1.7, 1.7]) {
    for (const pz of posts) {
      seg(s, sx, 0, pz, sx, 1.05, pz, w6);
      ring(s, w5, sx, 1.05, pz, 0.09, "y", 10);
    }
    for (let i = 0; i < posts.length - 1; i++) {
      const z1 = posts[i];
      const z2 = posts[i + 1];
      const zm1 = z1 + (z2 - z1) / 3;
      const zm2 = z1 + (2 * (z2 - z1)) / 3;
      seg(a, sx, 1.0, z1, sx, 0.82, zm1, acc45);
      seg(a, sx, 0.82, zm1, sx, 0.82, zm2, acc45);
      seg(a, sx, 0.82, zm2, sx, 1.0, z2, acc45);
    }
  }

  // round gala tables with chairs facing in
  for (const tx of [-4.6, 4.6]) {
    const tz = 2.3;
    ring(s, w6, tx, 1.4, tz, 1.15, "y", 32);
    ring(s, w6, tx, 1.28, tz, 1.15, "y", 32);
    seg(s, tx, 0.06, tz, tx, 1.28, tz, w5);
    ring(s, w5, tx, 0.06, tz, 0.5, "y", 16);
    for (let k = 0; k < 5; k++) {
      const ang = (k / 5) * Math.PI * 2 + (tx < 0 ? 0.5 : 1.1);
      chair(s, w5, tx + Math.sin(ang) * 2.0, 0, tz + Math.cos(ang) * 2.0, ang + Math.PI, 0.9);
    }
  }

  // three-tier chandelier over the floor (accent centerpiece)
  seg(s, 0, 9.9, 0.8, 0, 8.55, 0.8, dim8);
  ring(a, acc45, 0, 8.5, 0.8, 0.5, "y", 20);
  ring(a, acc45, 0, 7.95, 0.8, 1.0, "y", 28);
  ring(a, acc55, 0, 7.25, 0.8, 1.5, "y", 36);
  for (let k = 0; k < 8; k++) {
    const ang = (k / 8) * Math.PI * 2;
    const cx = Math.cos(ang);
    const cz = Math.sin(ang);
    seg(a, cx * 1.0, 7.95, 0.8 + cz * 1.0, cx * 1.5, 7.25, 0.8 + cz * 1.5, acc45);
    seg(a, cx * 1.5, 7.25, 0.8 + cz * 1.5, cx * 1.5, 6.85, 0.8 + cz * 1.5, acc55);
  }
}

/** Chain a list of [x,y,z] points into segments. */
function polyline(s: Sk, c: THREE.Color, pts: [number, number, number][]) {
  for (let i = 1; i < pts.length; i++)
    seg(s, pts[i - 1][0], pts[i - 1][1], pts[i - 1][2], pts[i][0], pts[i][1], pts[i][2], c);
}

/** Scene E — the Yerevan Opera & Ballet Theatre (Tamanyan's rotunda on
 *  Freedom Square): stylobate, arched lower hall, ring colonnade, shallow
 *  conical roof, grand entrance arch and the festival sphere above. */
function buildOpera(s: Sk, a: Sk) {
  const w45 = tone(WIRE, 0.45);
  const w5 = tone(WIRE, 0.5);
  const w6 = tone(WIRE, 0.6);
  const dim8 = tone(WIRE_DIM, 0.8);
  const acc45 = tone(ACCENT, 0.45);
  const acc55 = tone(ACCENT, 0.55);

  // Freedom Square plaza
  ring(s, dim8, 0, 0.02, 0, 7.6, "y", 96, [0.6, 0.5]);
  ring(s, dim8, 0, 0.02, 0, 6.2, "y", 64);

  // stylobate — the wide base drum with pilaster rhythm
  ring(s, w6, 0, 0.12, 0, 5.7, "y", 72);
  ring(s, w6, 0, 1.15, 0, 5.7, "y", 72);
  for (let k = 0; k < 18; k++) {
    const ang = (k / 18) * Math.PI * 2;
    const cx = Math.cos(ang) * 5.7;
    const cz = Math.sin(ang) * 5.7;
    seg(s, cx, 0.12, cz, cx, 1.15, cz, w45);
  }

  // lower hall drum with arched windows around the cylinder
  ring(s, w6, 0, 1.15, 0, 5.0, "y", 72);
  ring(s, w6, 0, 3.55, 0, 5.0, "y", 72);
  for (let k = 0; k < 14; k++) {
    const angC = (k / 14) * Math.PI * 2;
    const aw = 0.13; // half-width of a window, in radians
    const yB = 1.5;
    const yT = 2.9;
    const pt = (ang: number, y: number): [number, number, number] => [
      Math.cos(ang) * 5.0,
      y,
      Math.sin(ang) * 5.0,
    ];
    const arch: [number, number, number][] = [pt(angC - aw, yB), pt(angC - aw, yT)];
    for (let i = 0; i <= 6; i++) {
      const u = i / 6;
      arch.push(pt(angC - aw + 2 * aw * u, yT + Math.sin(Math.PI * u) * 0.45));
    }
    arch.push(pt(angC + aw, yT), pt(angC + aw, yB));
    polyline(s, w5, arch);
  }

  // upper drum wearing its ring colonnade
  ring(s, w6, 0, 3.55, 0, 4.2, "y", 64);
  ring(s, w5, 0, 3.75, 0, 4.2, "y", 64);
  ring(s, w5, 0, 5.75, 0, 4.2, "y", 64);
  ring(s, w6, 0, 6.0, 0, 4.35, "y", 64);
  for (let k = 0; k < 26; k++) {
    const ang = (k / 26) * Math.PI * 2;
    const cx = Math.cos(ang) * 4.2;
    const cz = Math.sin(ang) * 4.2;
    seg(s, cx, 3.75, cz, cx, 5.75, cz, w6);
  }

  // shallow conical roof
  ring(s, w5, 0, 6.75, 0, 3.1, "y", 48);
  ring(s, w5, 0, 7.1, 0, 1.1, "y", 24);
  for (let k = 0; k < 16; k++) {
    const ang = (k / 16) * Math.PI * 2;
    seg(
      s,
      Math.cos(ang) * 4.35, 6.0, Math.sin(ang) * 4.35,
      Math.cos(ang) * 1.1, 7.1, Math.sin(ang) * 1.1,
      w45
    );
  }

  // grand entrance portico, projecting from the front (accent)
  for (const dx of [-1.6, 1.6]) seg(a, dx, 0.12, 5.8, dx, 2.5, 5.8, acc45);
  const portal: [number, number, number][] = [];
  for (let i = 0; i <= 12; i++) {
    const u = i / 12;
    portal.push([-1.6 + 3.2 * u, 2.5 + Math.sin(Math.PI * u) * 1.5, 5.8]);
  }
  polyline(a, acc55, portal);
  // entrance steps
  seg(s, -2.6, 0.05, 6.5, 2.6, 0.05, 6.5, dim8);
  seg(s, -2.2, 0.1, 6.15, 2.2, 0.1, 6.15, dim8);

  // festival sphere hovering above the roof (accent)
  seg(s, 0, 7.1, 0, 0, 8.1, 0, dim8);
  ring(a, acc55, 0, 8.55, 0, 0.45, "z", 20);
  ring(a, acc45, 0, 8.55, 0, 0.45, "x", 20);
  ring(a, acc45, 0, 8.55, 0, 0.45, "y", 20);
}

/** Scene F — the client's own installation, traced 1:1 from their CAD
 *  model (DWG → mesh edges → lib/installation-edges.json). Proportions
 *  are exact; only a uniform scale makes it read at hero size. The tall
 *  tower and rooflines glow as accents. */
function buildInstallation(s: Sk, a: Sk) {
  const w5 = tone(WIRE, 0.5);
  const w65 = tone(WIRE, 0.65);
  const acc5 = tone(ACCENT, 0.5);
  const K = 1.25; // uniform enlargement — shape stays 1:1
  for (const e of installationEdges as number[][]) {
    const my = ((e[1] + e[4]) / 2) * K;
    const pool = my > 1.6 ? a : s;
    const col = my > 1.6 ? acc5 : my > 0.7 ? w65 : w5;
    seg(pool, e[0] * K, e[1] * K, e[2] * K, e[3] * K, e[4] * K, e[5] * K, col);
  }
}

/** Scene G — awards night: a glowing trophy on a stepped pedestal, a star
 *  overhead and confetti glints (Khazer, Hero of Our Times…). */
function buildTrophy(s: Sk, a: Sk) {
  const w45 = tone(WIRE, 0.45);
  const w5 = tone(WIRE, 0.5);
  const w6 = tone(WIRE, 0.6);
  const dim8 = tone(WIRE_DIM, 0.8);
  const acc45 = tone(ACCENT, 0.45);
  const acc55 = tone(ACCENT, 0.55);
  const rand = mulberry32(77);

  // ceremony floor
  ring(s, dim8, 0, 0.02, 0, 4.2, "y", 64);
  ring(s, w5, 0, 0.02, 0, 6.4, "y", 96, [0.6, 0.5]);

  // stepped pedestal
  box(s, w6, 0, 0.45, 0, 3.4, 0.9, 3.4);
  box(s, w6, 0, 1.1, 0, 2.5, 0.4, 2.5);

  // stem and cup as rings of revolution
  ring(s, w5, 0, 1.35, 0, 0.55, "y", 24);
  ring(s, w5, 0, 1.9, 0, 0.32, "y", 20);
  ring(s, w5, 0, 2.45, 0, 0.5, "y", 24);
  ring(s, w6, 0, 3.0, 0, 1.05, "y", 32);
  ring(s, w6, 0, 3.6, 0, 1.45, "y", 40);
  ring(a, acc55, 0, 4.25, 0, 1.7, "y", 56); // glowing rim
  for (let k = 0; k < 8; k++) {
    const ang = (k / 8) * Math.PI * 2;
    const cx = Math.cos(ang);
    const cz = Math.sin(ang);
    polyline(s, w45, [
      [cx * 0.32, 1.9, cz * 0.32],
      [cx * 0.5, 2.45, cz * 0.5],
      [cx * 1.05, 3.0, cz * 1.05],
      [cx * 1.45, 3.6, cz * 1.45],
      [cx * 1.7, 4.25, cz * 1.7],
    ]);
  }
  // handles
  for (const dir of [-1, 1]) {
    polyline(a, acc45, [
      [dir * 1.55, 4.05, 0],
      [dir * 2.35, 3.85, 0],
      [dir * 2.55, 3.3, 0],
      [dir * 2.1, 2.85, 0],
      [dir * 1.15, 2.75, 0],
    ]);
  }
  // star hovering above the cup
  const star: [number, number, number][] = [];
  for (let i = 0; i <= 10; i++) {
    const ang = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? 0.85 : 0.36;
    star.push([Math.cos(ang) * r, 5.7 + Math.sin(ang) * r, 0]);
  }
  polyline(a, acc55, star);
  // confetti glints drifting in the air
  for (let i = 0; i < 40; i++) {
    const x = (rand() - 0.5) * 10;
    const y = 2 + rand() * 7;
    const z = (rand() - 0.5) * 6;
    seg(a, x, y, z, x + (rand() - 0.5) * 0.35, y + (rand() - 0.5) * 0.35, z, acc45);
  }
}

/** Scene H — the singing fountains: a basin with a ring of curved jets
 *  leaning toward a tall central crown, droplets glinting at the crests. */
function buildFountain(s: Sk, a: Sk) {
  const w5 = tone(WIRE, 0.5);
  const w6 = tone(WIRE, 0.6);
  const dim8 = tone(WIRE_DIM, 0.8);
  const acc45 = tone(ACCENT, 0.45);
  const acc55 = tone(ACCENT, 0.55);
  const rand = mulberry32(41);

  // plaza + basin rims
  ring(s, dim8, 0, 0.02, 0, 8, "y", 96, [0.6, 0.5]);
  ring(s, w6, 0, 0.05, 0, 6.5, "y", 96);
  ring(s, w6, 0, 0.35, 0, 6.2, "y", 96);
  ring(s, w5, 0, 0.35, 0, 2.2, "y", 40);

  // ring of jets arcing toward the centre
  const JETS = 14;
  for (let k = 0; k < JETS; k++) {
    const ang = (k / JETS) * Math.PI * 2;
    const cx = Math.cos(ang);
    const cz = Math.sin(ang);
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      const r = 5.6 - t * 3.1;
      const y = 0.35 + Math.sin(t * Math.PI * 0.62) * 4.6;
      pts.push([cx * r, y, cz * r]);
    }
    polyline(a, k % 2 ? acc45 : acc55, pts);
  }
  // central crown jet
  for (let k = 0; k < 6; k++) {
    const ang = (k / 6) * Math.PI * 2;
    const dx = Math.cos(ang) * 0.9;
    const dz = Math.sin(ang) * 0.9;
    polyline(a, acc55, [
      [0, 0.4, 0],
      [dx * 0.25, 4.2, dz * 0.25],
      [dx * 0.75, 6.4, dz * 0.75],
      [dx, 7.2, dz],
    ]);
  }
  // droplets falling off the crests
  for (let i = 0; i < 30; i++) {
    const ang = rand() * Math.PI * 2;
    const r = 1.5 + rand() * 3.5;
    const y = 3.5 + rand() * 4;
    const x = Math.cos(ang) * r;
    const z = Math.sin(ang) * r;
    seg(s, x, y, z, x + (rand() - 0.5) * 0.2, y - 0.3 - rand() * 0.3, z, w5);
  }
}

/** Scene I — fireworks over the city: three particle bursts above a dim
 *  skyline, launch trails rising from the ground. */
function buildFireworks(s: Sk, a: Sk) {
  const w45 = tone(WIRE, 0.45);
  const w5 = tone(WIRE, 0.5);
  const dim8 = tone(WIRE_DIM, 0.8);
  const acc45 = tone(ACCENT, 0.45);
  const acc55 = tone(ACCENT, 0.55);
  const rand = mulberry32(9);

  // city horizon
  seg(s, -9, 0.02, -3.5, 9, 0.02, -3.5, dim8);
  const skyline = [
    [-8.2, 1.6, 1.4], [-6.2, 2.4, 1.0], [-4.6, 1.2, 1.6], [-2.4, 2.0, 1.2],
    [0.2, 1.5, 1.8], [2.6, 2.6, 1.0], [4.6, 1.3, 1.5], [6.8, 2.1, 1.2], [8.4, 1.0, 1.4],
  ] as const;
  for (const [bx, bh, bw] of skyline) {
    polyline(s, w45, [
      [bx - bw / 2, 0.02, -3.5],
      [bx - bw / 2, bh, -3.5],
      [bx + bw / 2, bh, -3.5],
      [bx + bw / 2, 0.02, -3.5],
    ]);
  }

  // three bursts
  const bursts: [number, number, number, number][] = [
    [-4.2, 6.6, -1, 2.1],
    [0.8, 7.6, 0, 2.6],
    [5.0, 5.9, -1.5, 1.7],
  ];
  for (const [bx, by, bz, R] of bursts) {
    for (let k = 0; k < 22; k++) {
      const u = rand() * 2 - 1;
      const ph = rand() * Math.PI * 2;
      const sq = Math.sqrt(1 - u * u);
      const dx = sq * Math.cos(ph);
      const dz = sq * Math.sin(ph);
      const inner = 0.25 + rand() * 0.15;
      const tip = 0.8 + rand() * 0.2;
      seg(
        a,
        bx + dx * R * inner, by + u * R * inner, bz + dz * R * inner,
        bx + dx * R * tip, by + u * R * tip - 0.15, bz + dz * R * tip,
        rand() > 0.4 ? acc55 : acc45
      );
    }
    ring(a, acc45, bx, by, bz, R * 0.35, "z", 20);
  }

  // launch trails rising to each burst
  for (const [bx, by, bz] of bursts) {
    const x0 = bx * 0.75;
    for (let i = 0; i < 7; i++) {
      const t1 = i / 7;
      const t2 = t1 + 0.06;
      const px = (t: number) => x0 + (bx - x0) * t;
      const py = (t: number) => 0.1 + (by - 1.2) * t;
      const pz = (t: number) => -2 + (bz + 2) * t;
      seg(s, px(t1), py(t1), pz(t1), px(t2), py(t2), pz(t2), w5);
    }
  }
  ring(s, dim8, 0, 0.02, 0, 6, "y", 96, [0.6, 0.5]);
}

/* ------------------------------------------------------------------ */
/* Scene matching: equal particle budgets per scene, spatial sort for  */
/* coherent travel, precomputed per-particle stagger delays.           */
/* ------------------------------------------------------------------ */

const mulberry32 = (a: number) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

interface Cloud {
  pos: Float32Array;
  col: Float32Array;
}

/**
 * Sample a fixed budget of dots along a sketch's segments, proportional to
 * segment length (stratified along the total path so coverage stays even).
 * A fixed budget means every scene has the same particle count — the swarm
 * never gains or loses dots, it only reassembles.
 */
function skToCloud(sk: Sk, count: number, rand: () => number): Cloud {
  const segs = sk.pos.length / 6;
  const cum = new Float32Array(segs);
  let total = 0;
  for (let i = 0; i < segs; i++) {
    const b = i * 6;
    const len = Math.hypot(
      sk.pos[b + 3] - sk.pos[b],
      sk.pos[b + 4] - sk.pos[b + 1],
      sk.pos[b + 5] - sk.pos[b + 2]
    );
    total += Math.max(len, 0.02);
    cum[i] = total;
  }
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const jitter = 0.035;
  let si = 0;
  for (let k = 0; k < count; k++) {
    const u = ((k + rand()) / count) * total; // strictly increasing → pointer walk
    while (si < segs - 1 && cum[si] < u) si++;
    const b = si * 6;
    const start = si === 0 ? 0 : cum[si - 1];
    const span = cum[si] - start;
    const t = span > 0 ? (u - start) / span : 0.5;
    for (let a = 0; a < 3; a++) {
      pos[k * 3 + a] =
        sk.pos[b + a] + (sk.pos[b + 3 + a] - sk.pos[b + a]) * t + (rand() - 0.5) * jitter;
      col[k * 3 + a] = sk.col[b + a];
    }
  }
  return { pos, col };
}

/** Sort dots spatially so corresponding particles travel short, coherent paths. */
function sortCloud(c: Cloud) {
  const n = c.pos.length / 3;
  const key = (i: number) =>
    c.pos[i * 3 + 1] * 2 + c.pos[i * 3] * 0.5 + c.pos[i * 3 + 2] * 0.25;
  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => key(a) - key(b));
  const pos = new Float32Array(n * 3);
  const col = new Float32Array(n * 3);
  for (let o = 0; o < n; o++) {
    const b = order[o] * 3;
    for (let k = 0; k < 3; k++) {
      pos[o * 3 + k] = c.pos[b + k];
      col[o * 3 + k] = c.col[b + k];
    }
  }
  c.pos = pos;
  c.col = col;
}

interface Pool {
  n: number;
  pos: Float32Array[]; // one buffer per scene, matched point-for-point
  col: Float32Array[];
  delays: Float32Array;
}

// dot budgets per pool — fixed regardless of scene complexity
const STRUCTURE_DOTS = 6000;
const ACCENT_DOTS = 2200;

/**
 * Sample a photo into structure/accent clouds by EDGE strength: contours and
 * detail become dots (dust for soft edges, glowing accents for the sharpest),
 * so a real event photo joins the morph cycle as a sketch of light — same
 * language as the drawn venues, and immune to bright skies flooding the frame.
 */
function photoClouds(
  url: string,
  rand: () => number
): Promise<{ structure: Cloud; accent: Cloud }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const w = 480;
      const h = Math.max(1, Math.round((img.naturalHeight / img.naturalWidth) * w));
      const cv = document.createElement("canvas");
      cv.width = w;
      cv.height = h;
      const ctx = cv.getContext("2d");
      if (!ctx) return reject(new Error("no 2d context"));
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      const lum = new Float32Array(w * h);
      for (let i = 0; i < w * h; i++)
        lum[i] =
          (0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255;
      const dim: number[] = []; // [x, y, edge strength] soft edges and up
      const hot: number[] = []; // sharpest edges only
      for (let y = 1; y < h - 1; y++)
        for (let x = 1; x < w - 1; x++) {
          const i = y * w + x;
          const g = Math.abs(lum[i + 1] - lum[i - 1]) + Math.abs(lum[i + w] - lum[i - w]);
          if (g > 0.09) {
            const s = Math.min(1, g * 3);
            // strong contours enter multiple times so they draw more dots
            // than surface texture — keeps the subject readable
            const copies = 1 + Math.floor(s * s * 4);
            for (let c = 0; c < copies; c++) dim.push(x, y, s);
          }
          if (g > 0.2) hot.push(x, y, Math.min(1, g * 2.5));
        }
      if (dim.length / 3 < 50) return reject(new Error("photo too flat to sample"));
      // tighter frame = denser dots; the fixed budget has to read as a picture
      const worldW = 12;
      const worldH = (worldW * h) / w;
      const make = (cand: number[], count: number, base: number, boost: number): Cloud => {
        const total = cand.length / 3;
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        for (let k = 0; k < count; k++) {
          const j = Math.floor(rand() * total) * 3;
          const lum = cand[j + 2];
          pos[k * 3] = ((cand[j] + rand()) / w - 0.5) * worldW;
          pos[k * 3 + 1] = 0.2 + worldH - ((cand[j + 1] + rand()) / h) * worldH;
          pos[k * 3 + 2] = (rand() - 0.5) * 0.7;
          const c = tone(ACCENT, Math.min(1, base + lum * boost));
          col[k * 3] = c.r;
          col[k * 3 + 1] = c.g;
          col[k * 3 + 2] = c.b;
        }
        return { pos, col };
      };
      resolve({
        structure: make(dim, STRUCTURE_DOTS, 0.2, 0.45),
        accent: make(hot.length / 3 >= 50 ? hot : dim, ACCENT_DOTS, 0.45, 0.4),
      });
    };
    img.onerror = () => reject(new Error("photo load failed"));
    img.src = url;
  });
}

/** Build every scene's clouds: 4 drawn venues + the photo scenes. */
async function buildPools(): Promise<{ structure: Pool; accent: Pool }> {
  const builders = [
    buildStage,
    buildCamera,
    buildConference,
    buildGala,
    buildOpera,
    buildInstallation,
    buildTrophy,
    buildFountain,
    buildFireworks,
  ];
  const structures: Sk[] = [];
  const accents: Sk[] = [];
  for (const build of builders) {
    const s: Sk = { pos: [], col: [] };
    const a: Sk = { pos: [], col: [] };
    build(s, a);
    structures.push(s);
    accents.push(a);
  }
  const rand = mulberry32(1234);
  const structureClouds = structures.map((sk) => skToCloud(sk, STRUCTURE_DOTS, rand));
  const accentClouds = accents.map((sk) => skToCloud(sk, ACCENT_DOTS, rand));
  for (const url of PHOTO_SCENES) {
    try {
      const p = await photoClouds(url, rand);
      structureClouds.push(p.structure);
      accentClouds.push(p.accent);
    } catch {
      // a missing/broken photo just drops out of the cycle
    }
  }
  for (const c of [...structureClouds, ...accentClouds]) sortCloud(c);
  const poolOf = (clouds: Cloud[], count: number): Pool => {
    const delays = new Float32Array(count);
    for (let i = 0; i < count; i++) delays[i] = rand();
    return {
      n: count,
      pos: clouds.map((c) => c.pos),
      col: clouds.map((c) => c.col),
      delays,
    };
  };
  return {
    structure: poolOf(structureClouds, STRUCTURE_DOTS),
    accent: poolOf(accentClouds, ACCENT_DOTS),
  };
}

/**
 * The morphing dot rig: two particle pools (fine structure dust + bigger
 * glowing accent dots) whose positions ease between scenes on a
 * hold/morph/hold/morph cycle. Each dot gets a random start delay so the
 * picture dissolves organically rather than sliding as a block.
 */
function MorphRig({ animate }: { animate: boolean }) {
  const [scenes, setScenes] = useState<{ structure: Pool; accent: Pool } | null>(null);

  // pools load async (photo scenes sample from image files)
  useEffect(() => {
    let live = true;
    buildPools().then((p) => {
      if (live) setScenes(p);
    });
    return () => {
      live = false;
    };
  }, []);

  const clouds = useMemo(() => {
    if (!scenes) return null;
    const make = (pool: Pool, size: number, opacity: number) => {
      const g = new THREE.BufferGeometry();
      // slice: the morph loop writes into the live buffers, and the pristine
      // scene data must stay untouched
      g.setAttribute("position", new THREE.BufferAttribute(pool.pos[0].slice(), 3));
      g.setAttribute("color", new THREE.BufferAttribute(pool.col[0].slice(), 3));
      const m = new THREE.PointsMaterial({
        vertexColors: true,
        size,
        sizeAttenuation: true,
        map: getDotTexture(),
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      m.fog = true;
      const p = new THREE.Points(g, m);
      p.frustumCulled = false;
      return p;
    };
    return {
      structure: make(scenes.structure, 0.085, 0.85),
      accent: make(scenes.accent, 0.17, 0.95),
    };
  }, [scenes]);

  useEffect(() => {
    if (!clouds) return;
    return () => {
      for (const p of [clouds.structure, clouds.accent]) {
        p.geometry.dispose();
        (p.material as THREE.PointsMaterial).dispose();
      }
    };
  }, [clouds]);

  const st = useRef({ t: 0, wasMorph: false });

  useFrame((_, dt) => {
    if (!animate || !clouds || !scenes) return;
    const sceneCount = scenes.structure.pos.length;
    const cycle = SEG_T * sceneCount;
    const s = st.current;
    s.t = (s.t + Math.min(dt, 0.1)) % cycle;
    const src = Math.floor(s.t / SEG_T);
    const dst = (src + 1) % sceneCount;
    const tin = s.t - src * SEG_T;
    const inMorph = tin >= HOLD;
    const tm = inMorph ? (tin - HOLD) / MORPH : 0;

    // photo scenes are flat: 1 while a photo holds, blending during morphs
    const wp = (i: number) => (i >= DRAWN_SCENES ? 1 : 0);
    morphShared.flat = inMorph ? wp(src) + (wp(dst) - wp(src)) * tm : wp(src);

    if (!inMorph && !s.wasMorph) return;
    const snap = !inMorph;
    for (const [cloud, pool] of [
      [clouds.structure, scenes.structure],
      [clouds.accent, scenes.accent],
    ] as const) {
      const posBuf = cloud.geometry.getAttribute("position") as THREE.BufferAttribute;
      const colBuf = cloud.geometry.getAttribute("color") as THREE.BufferAttribute;
      const P = posBuf.array as Float32Array;
      const C = colBuf.array as Float32Array;
      if (snap) {
        // snap exactly onto the held scene once the morph window closes
        P.set(pool.pos[src]);
        C.set(pool.col[src]);
      } else {
        const { delays, n } = pool;
        const pa = pool.pos[src];
        const pb = pool.pos[dst];
        const ca = pool.col[src];
        const cb = pool.col[dst];
        for (let i = 0; i < n; i++) {
          let ti = (tm - delays[i] * STAGGER) / (1 - STAGGER);
          ti = ti < 0 ? 0 : ti > 1 ? 1 : ti;
          const e = ti * ti * ti * (ti * (ti * 6 - 15) + 10); // smootherstep
          const b = i * 3;
          for (let k = 0; k < 3; k++) {
            P[b + k] = pa[b + k] + (pb[b + k] - pa[b + k]) * e;
            C[b + k] = ca[b + k] + (cb[b + k] - ca[b + k]) * e;
          }
        }
      }
      posBuf.needsUpdate = true;
      colBuf.needsUpdate = true;
    }
    s.wasMorph = inMorph;
  });

  if (!clouds) return null;
  return (
    <>
      <primitive object={clouds.structure} />
      <primitive object={clouds.accent} />
    </>
  );
}

/** Soft round glow sprite shared by all particle systems (points render as
 *  hard squares without a map). Lazy singleton — client only. */
let dotTexture: THREE.CanvasTexture | null = null;
function getDotTexture() {
  if (!dotTexture) {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.35, "rgba(255,255,255,0.7)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    dotTexture = new THREE.CanvasTexture(c);
  }
  return dotTexture;
}

/**
 * The brand backwall: the logo SVG rasterized offscreen and rebuilt as a
 * field of glowing particles hanging upstage behind the rig — the venue's
 * "LED wall". Stays up through both scenes.
 */
function LogoWall({ animate }: { animate: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const [geo, setGeo] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    let cancelled = false;
    let blobUrl = "";
    const img = new Image();
    img.onload = () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      if (cancelled) return;
      const W = 760;
      const H = 760; // emblem viewBox is square
      const c = document.createElement("canvas");
      c.width = W;
      c.height = H;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, W, H);
      const data = ctx.getImageData(0, 0, W, H).data;
      const candidates: number[] = [];
      let minX = W;
      let maxX = 0;
      let minY = H;
      let maxY = 0;
      for (let y = 0; y < H; y++)
        for (let x = 0; x < W; x++) {
          if (data[(y * W + x) * 4 + 3] > 100) {
            candidates.push(x, y);
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      const total = candidates.length / 2;
      if (!total) return;
      const rand = mulberry32(7);
      const count = Math.min(2200, total);
      const spanX = Math.max(1, maxX - minX);
      const spanY = Math.max(1, maxY - minY);
      const worldW = 15;
      const worldH = (worldW * spanY) / spanX;
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const j = Math.floor(rand() * total) * 2;
        const nx = (candidates[j] + rand() - minX) / spanX - 0.5;
        const ny = (candidates[j + 1] + rand() - minY) / spanY - 0.5;
        pos[i * 3] = nx * worldW;
        pos[i * 3 + 1] = 5.9 - ny * worldH;
        pos[i * 3 + 2] = (rand() - 0.5) * 0.45;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      g.userData.base = pos.slice(); // pristine layout the shimmer offsets from
      setGeo(g);
    };
    // viewBox-only SVGs rasterize at a tiny default size; inject explicit
    // dimensions so the letterforms sample crisply
    fetch("/assets/moments-emblem.svg")
      .then((r) => r.text())
      .then((svg) => {
        if (cancelled) return;
        const sized = svg.replace("<svg ", '<svg width="760" height="760" ');
        blobUrl = URL.createObjectURL(new Blob([sized], { type: "image/svg+xml" }));
        img.src = blobUrl;
      })
      .catch(() => {
        // no logo wall if the asset is missing — the hero still works
      });
    return () => {
      cancelled = true;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, []);

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: ACCENT,
        size: 0.13,
        sizeAttenuation: true,
        map: getDotTexture(),
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false, // stays crisp behind the fogged rig
      }),
    []
  );

  useFrame(({ clock }) => {
    if (!animate || !ref.current || !geo) return;
    const t = clock.elapsedTime;
    ref.current.position.y = Math.sin(t * 0.3) * 0.18;
    // gentle per-particle drift so the wall reads as living light, not a decal
    const attr = geo.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const base = geo.userData.base as Float32Array;
    for (let i = 0; i < arr.length; i += 3) {
      const bx = base[i];
      const bz = base[i + 2];
      arr[i + 1] = base[i + 1] + Math.sin(t * 0.7 + bx * 1.6 + bz * 4.0) * 0.05;
      arr[i + 2] = bz + Math.sin(t * 0.5 + bx * 0.9) * 0.07;
    }
    attr.needsUpdate = true;
  });

  if (!geo) return null;
  return (
    <points
      ref={ref}
      geometry={geo}
      material={mat}
      position={[0, 0, -10]}
      frustumCulled={false}
    />
  );
}

/** Slow-drifting dust motes that catch the light around the rig. */
function Dust({ animate }: { animate: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const rand = mulberry32(99);
    const n = 340;
    const p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 2.5 + rand() * 12.5;
      const ang = rand() * Math.PI * 2;
      p[i * 3] = Math.cos(ang) * r;
      p[i * 3 + 1] = rand() * 11;
      p[i * 3 + 2] = Math.sin(ang) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    return g;
  }, []);
  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: ACCENT,
        size: 0.09,
        sizeAttenuation: true,
        map: getDotTexture(),
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );
  useFrame(({ clock }) => {
    if (!animate || !ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.014;
    ref.current.position.y = Math.sin(clock.elapsedTime * 0.22) * 0.3;
  });
  return <points ref={ref} geometry={geo} material={mat} frustumCulled={false} />;
}

/** Pulls the camera back on narrow viewports so the venue stays framed. */
function ResponsiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / size.height;
    const z = aspect < 0.7 ? 30 : aspect < 1.1 ? 25 : 20.5;
    camera.position.set(0, 5.6, z);
    camera.lookAt(0, 3.6, 0);
  }, [camera, size]);
  return null;
}

/** Drag-to-orbit rig: inertia + damping, slow auto-rotate when idle. */
function OrbitGroup({
  autoRotate,
  children,
}: {
  autoRotate: boolean;
  children: React.ReactNode;
}) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!g.current) return;
    const flat = morphShared.flat;
    if (!orbit.active) {
      orbit.vel *= Math.pow(0.9, dt * 60);
      orbit.targetY += orbit.vel * dt;
      // pause the idle spin while a flat photo scene faces the viewer
      if (autoRotate && flat < 0.5) orbit.targetY += dt * 0.07;
    }
    const k = Math.min(1, dt * 5);
    orbit.curY += (orbit.targetY - orbit.curY) * k;
    orbit.curX += (orbit.targetX - orbit.curX) * k;
    // photo scenes are flat billboards: blend toward the nearest front-facing
    // turn so the photo reads, then release back to free orbit
    const frontY = Math.round(orbit.curY / (Math.PI * 2)) * Math.PI * 2;
    g.current.rotation.y = orbit.curY + (frontY - orbit.curY) * flat;
    g.current.rotation.x = orbit.curX + (0.07 - orbit.curX) * flat;
  });
  return <group ref={g}>{children}</group>;
}

export default function HeroStage() {
  const wrap = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(true);
  const reduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  // reset the shared orbit store; start behind the resting angle so the
  // rig swings into place on load (unless reduced motion)
  useEffect(() => {
    Object.assign(orbit, {
      active: false,
      vel: 0,
      targetY: 0.5,
      curY: reduced ? 0.5 : -0.45,
      targetX: 0.07,
      curX: 0.07,
    });
  }, [reduced]);

  // stop the render loop when the hero scrolls out of view
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setRunning(e.isIntersecting),
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    orbit.active = true;
    orbit.lastX = e.clientX;
    orbit.lastY = e.clientY;
    orbit.vel = 0;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // synthetic events may carry an unknown pointerId — drag still works
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!orbit.active) return;
    const dx = e.clientX - orbit.lastX;
    const dy = e.clientY - orbit.lastY;
    orbit.lastX = e.clientX;
    orbit.lastY = e.clientY;
    orbit.targetY += dx * 0.003;
    orbit.vel = dx * 0.15;
    orbit.targetX = THREE.MathUtils.clamp(orbit.targetX + dy * 0.0016, -0.04, 0.3);
  };
  const endDrag = () => {
    orbit.active = false;
  };

  return (
    <div
      ref={wrap}
      className="h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <Canvas
        camera={{ position: [0, 5.6, 20.5], fov: 31 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false, // the composer owns AA; MSAA here would be paid twice
          alpha: false,
          stencil: false,
          powerPreference: "high-performance",
        }}
        frameloop={running ? "always" : "never"}
      >
        <ResponsiveCamera />
        <color attach="background" args={[BG]} />
        <fog attach="fog" args={[BG, 16, 46]} />
        {/* brand backwall stays outside the orbit group so it always reads */}
        <LogoWall animate={!reduced} />
        <OrbitGroup autoRotate={!reduced}>
          <polarGridHelper args={[32, 16, 8, 64, "#2a2822", "#171613"]} />
          <MorphRig animate={!reduced} />
          <Dust animate={!reduced} />
        </OrbitGroup>
        <EffectComposer multisampling={2}>
          <Bloom
            mipmapBlur
            intensity={0.9}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.3}
            radius={0.72}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
