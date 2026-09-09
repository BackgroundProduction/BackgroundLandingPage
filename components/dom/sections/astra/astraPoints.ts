import * as THREE from "three";

/**
 * "Astra" point rendering — the particle language of OpenAI's GPT-6 Astra
 * hero, ported onto our morph rig. Every dot is a crisp star: an analytic
 * disc^2.2 core with a sub-pixel B-spline kernel below 2 px (no texture, no
 * mip blur), a heavy-tailed size distribution, a per-particle palette colour
 * whose centre blends to white as it gets bright, four-point rays on the
 * brightest few, twinkle, and HDR additive output for the bloom + ACES chain.
 *
 * Pure module: no React. The vertex shader only offsets the incoming
 * `position`, so the CPU morph loop keeps writing positions exactly as before.
 */

/** Astra palette (sRGB hex): light blue, blue, orange, light orange, white. */
export const ASTRA_PALETTE = ["#6DCBF4", "#7AB1FE", "#F87915", "#FA994C", "#F5F6FB"] as const;

// palette slot by uniform seed: 36 % / 16 % / 12 % / 10 % / 26 %
const SLOT_THRESHOLDS = [0.36, 0.52, 0.64, 0.74];

/** Deterministic colour seeds for the hero stars (one per Astra arm + core). */
export const SECONDARY_COLOR_SEEDS = [0.08, 0.58, 0.22, 0.68, 0.44, 0.99];

// THREE.Color converts sRGB hex into the linear working space on set
const paletteLinear = ASTRA_PALETTE.map((hex) => new THREE.Color(hex));

export function paletteSlot(seed: number) {
  for (let i = 0; i < SLOT_THRESHOLDS.length; i++) if (seed < SLOT_THRESHOLDS[i]) return i;
  return 4;
}

export const luminance = (r: number, g: number, b: number) =>
  0.2126 * r + 0.7152 * g + 0.0722 * b;

export interface StarAttributes {
  color: Float32Array; // linear RGB, 3 per star
  scale: Float32Array; // Astra starScale
  brightness: Float32Array; // Astra starBrightness (HDR)
  opacity: Float32Array;
  twinkle: Float32Array; // phase, rate — 2 per star
  seed: Float32Array; // three uniform randoms — intro scatter, drift, density cull
  heroIndices: number[]; // the few stars that carry rays and lens-flare sources
}

export interface StarOptions {
  /** Astra `stars.size` analogue — the master size multiplier (2.05 on the reference). */
  size: number;
  /** probability a star belongs to the bright class (Astra: 5.5–8.5 % mid-arm). */
  brightChance: number;
  /** number of hero stars, spread evenly through the index range. */
  heroes?: number;
  /** force the white palette slot (logo wall). */
  white?: boolean;
  /** fixed opacity; default is Astra's 0.82 + 0.16 r. */
  opacity?: number;
}

/**
 * Per-particle attributes with Astra's distributions (report 01 §2.3): a sea
 * of tiny stars (`0.12 + r^2.4 * 0.68`) with a rare bright class
 * (`0.85 + 1.25 r`), brightness 0.56–1.34 normal / 2–3.5 bright, palette by
 * seed thresholds. Index-invariant, so they hold across every morph scene.
 */
export function makeStarAttributes(n: number, rand: () => number, o: StarOptions): StarAttributes {
  const color = new Float32Array(n * 3);
  const scale = new Float32Array(n);
  const brightness = new Float32Array(n);
  const opacity = new Float32Array(n);
  const twinkle = new Float32Array(n * 2);
  const seed = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const bright = rand() < o.brightChance;
    scale[i] = (bright ? 0.85 + 1.25 * rand() : 0.12 + Math.pow(rand(), 2.4) * 0.68) * o.size;
    brightness[i] = bright ? 2 + 1.5 * rand() : 0.56 + 0.78 * rand();
    const c = paletteLinear[o.white ? 4 : paletteSlot(rand())];
    color[i * 3] = c.r;
    color[i * 3 + 1] = c.g;
    color[i * 3 + 2] = c.b;
    opacity[i] = o.opacity ?? 0.82 + 0.16 * rand();
    twinkle[i * 2] = rand() * Math.PI * 2;
    twinkle[i * 2 + 1] = 0.65 + 0.7 * rand();
    seed[i * 3] = rand();
    seed[i * 3 + 1] = rand();
    seed[i * 3 + 2] = rand();
  }
  const heroCount = o.heroes ?? 0;
  const heroIndices: number[] = [];
  for (let k = 0; k < heroCount; k++) {
    const idx = Math.min(n - 1, Math.floor(((k + 0.5) / heroCount) * n));
    heroIndices.push(idx);
    scale[idx] = Math.max(scale[idx], 2.2 * o.size);
    brightness[idx] = Math.max(brightness[idx], 3.35);
    const c = paletteLinear[paletteSlot(SECONDARY_COLOR_SEEDS[k % SECONDARY_COLOR_SEEDS.length])];
    color[idx * 3] = c.r;
    color[idx * 3 + 1] = c.g;
    color[idx * 3 + 2] = c.b;
  }
  return { color, scale, brightness, opacity, twinkle, seed, heroIndices };
}

/** Upload the per-particle attributes next to `position` / `weight`. */
export function attachStarAttributes(g: THREE.BufferGeometry, a: StarAttributes) {
  g.setAttribute("aColor", new THREE.BufferAttribute(a.color, 3));
  g.setAttribute("aScale", new THREE.BufferAttribute(a.scale, 1));
  g.setAttribute("aBrightness", new THREE.BufferAttribute(a.brightness, 1));
  g.setAttribute("aOpacity", new THREE.BufferAttribute(a.opacity, 1));
  g.setAttribute("aTwinkle", new THREE.BufferAttribute(a.twinkle, 2));
  g.setAttribute("aSeed", new THREE.BufferAttribute(a.seed, 3));
}

/**
 * Per-scene brightness weight derived from a sketch's baked colour buffer:
 * the old `tone(hex, opacity)` levels become a 0..1 multiplier, so dim
 * structure lines stay dim and glowing accent lines stay bright while the
 * hue itself now comes from the per-particle palette.
 */
export function weightsFromColors(col: Float32Array, refLuminance: number): Float32Array {
  const n = col.length / 3;
  const w = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const l = luminance(col[i * 3], col[i * 3 + 1], col[i * 3 + 2]);
    w[i] = Math.min(1, l / refLuminance);
  }
  return w;
}

/* ------------------------------------------------------------------ */
/* Shaders — Astra's star vertex/fragment, trimmed to what we drive.   */
/* ------------------------------------------------------------------ */

const vertexShader = /* glsl */ `
  attribute vec3 aColor;
  attribute float aScale;
  attribute float aBrightness;
  attribute float aOpacity;
  attribute float weight;
  attribute vec2 aTwinkle;
  attribute vec3 aSeed;

  uniform float uPixelRatio;
  uniform float uTime;
  uniform float uIntensity;
  uniform float uTwinkleSpeed;
  uniform float uIntroProgress;
  uniform float uKeep;
  uniform float uRefZ;
  uniform float uDepthDimNear;
  uniform float uDepthDimFar;
  uniform float uBackground;
  uniform float uDrift;
  uniform vec2 uScatterSize;
  uniform vec2 uScatterCenter;

  varying float vBrightness;
  varying vec3 vColor;
  varying float vOpacity;
  varying float vRayStrength;
  varying float vParticleDiameter;

  // Astra intro: start in the scattered field, swirl about the centre and
  // get pulled onto the authored position, each star on its own schedule.
  vec3 astraIntroMotion(vec3 position, vec3 scattered, float progress, float seed, float travelSeed) {
    if (progress >= 1.0) return position;
    float start = 0.14 + seed * 0.18;
    float duration = 0.58 + travelSeed * 0.1;
    float local = clamp((progress - start) / duration, 0.0, 1.0);
    float smoothPull = local * local * local * (local * (local * 6.0 - 15.0) + 10.0);
    float pull = mix(smoothPull, sin(smoothPull * 3.14159265359 * 0.5), 0.5);
    float angle = sin(pull * 3.14159265359) * (0.44 + seed * 0.22);
    float c = cos(angle);
    float s = sin(angle);
    vec3 orbiting = vec3(
      scattered.x * c - scattered.y * s,
      scattered.x * s + scattered.y * c,
      scattered.z
    );
    return mix(orbiting, position, pull);
  }

  float astraParticleRevealProgress(float progress, float seed) {
    float delay = seed * 0.015;
    return smoothstep(delay, 0.14 + delay, progress)
      * mix(0.2, 1.0, smoothstep(0.2, 1.0, progress));
  }

  // ambient drift of free-floating stars (the background field)
  vec2 astraDispersedMotion(float time, float sx, float sy, float sz, float strength) {
    float depth = clamp(sz, 0.0, 1.0);
    float speed = mix(0.4, 0.8, depth);
    float amount = mix(0.035, 0.12, depth) * strength;
    float phaseX = sx * 6.28318530718 + sy * 2.7;
    float phaseY = sy * 6.28318530718 + sz * 3.1;
    return vec2(
      (sin(phaseX + time * speed) - sin(phaseX)) * amount,
      (cos(phaseY + time * speed * 0.73) - cos(phaseY)) * amount
    );
  }

  void main() {
    vColor = aColor;
    if (aSeed.x > uKeep) {
      // density cull (phones): park the vertex outside the clip volume
      vBrightness = 0.0;
      vOpacity = 0.0;
      vRayStrength = 0.0;
      vParticleDiameter = 0.0;
      gl_PointSize = 1.0;
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      return;
    }
    float intro = mix(uIntroProgress, 1.0, uBackground);
    vec3 scattered = vec3(
      uScatterCenter.x + (aSeed.x - 0.5) * uScatterSize.x,
      uScatterCenter.y + (aSeed.y - 0.5) * uScatterSize.y,
      (aSeed.z - 0.5) * 0.5
    );
    vec3 p = astraIntroMotion(position, scattered, intro, aSeed.z, aSeed.y);
    p.xy += astraDispersedMotion(uTime, aSeed.x, aSeed.y, aSeed.z, uDrift);

    // motion (twinkle) fades in over the second half of the intro
    float motionGate = smoothstep(0.55, 1.0, intro);
    float twinkle = 0.86 + 0.14 * sin(aTwinkle.x + uTime * uTwinkleSpeed * motionGate * aTwinkle.y);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float depth = -mv.z;
    // the old fog, as a brightness cue instead of a colour mix
    float depthDim = mix(1.0, 0.45, smoothstep(uDepthDimNear, uDepthDimFar, depth));
    // Astra has no size attenuation; keep a mild one so the orbit still reads 3-D
    float attenuation = clamp(uRefZ / max(depth, 0.001), 0.75, 1.25);
    float reveal = mix(astraParticleRevealProgress(intro, aSeed.z), 1.0, uBackground);

    vBrightness = uIntensity * aBrightness * weight * twinkle * depthDim;
    vOpacity = aOpacity * (0.92 + 0.08 * twinkle) * smoothstep(0.0, 0.2, reveal);
    vRayStrength = smoothstep(1.45, 2.8, aBrightness * max(weight, 0.35));

    gl_PointSize = uPixelRatio
      * (0.35 + aScale * 3.8)
      * (0.97 + 0.03 * twinkle)
      * attenuation
      * sqrt(max(reveal, 0.0));
    vParticleDiameter = gl_PointSize;
    gl_PointSize = max(gl_PointSize, 4.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vBrightness;
  varying vec3 vColor;
  varying float vOpacity;
  varying float vRayStrength;
  varying float vParticleDiameter;

  // separable cubic B-spline coverage: a sub-pixel star deposits exactly
  // area * d^2 of energy wherever it lands, so tiny dots never flicker
  float astraCubicCoverage(float coordinate) {
    float x = abs(coordinate);
    if (x < 1.0) return (4.0 - 6.0 * x * x + 3.0 * x * x * x) / 6.0;
    float tail = max(2.0 - x, 0.0);
    return tail * tail * tail / 6.0;
  }
  float astraFilteredCore(vec2 pixel, float area) {
    return astraCubicCoverage(pixel.x) * astraCubicCoverage(pixel.y)
      * area * vParticleDiameter * vParticleDiameter;
  }

  void main() {
    vec2 pixel = (gl_PointCoord - vec2(0.5)) * max(vParticleDiameter, 4.0);
    vec2 point = pixel * 2.0 / max(vParticleDiameter, 0.0001);
    float distanceToCenter = length(point);
    float disc = 1.0 - smoothstep(0.08, 1.0, distanceToCenter);
    float core = pow(disc, 2.2);
    float horizontalRay = exp(-abs(point.y) * 28.0) * (1.0 - smoothstep(0.18, 1.0, abs(point.x)));
    float verticalRay = exp(-abs(point.x) * 28.0) * (1.0 - smoothstep(0.18, 1.0, abs(point.y)));
    float rays = max(horizontalRay, verticalRay) * 0.28 * vRayStrength;
    float resolved = smoothstep(2.0, 4.0, vParticleDiameter);
    float alpha = mix(astraFilteredCore(pixel, 0.150904), max(core, rays), resolved) * vOpacity;
    if (alpha <= 0.0) discard;
    // bright stars burn to white in the centre; saturated hues get extra energy
    float whiteCore = mix(0.59228, core, resolved) * smoothstep(0.9, 2.8, vBrightness) * 0.82;
    float colorEnergy = 1.0 - min(vColor.r, min(vColor.g, vColor.b));
    vec3 emission = mix(vColor, vec3(1.0), whiteCore) * vBrightness * (1.0 + colorEnergy * 0.42);
    gl_FragColor = vec4(emission, alpha);
  }
`;

export interface AstraMaterialOptions {
  /** Astra `stars.intensity` analogue (1.35 on the reference). */
  intensity: number;
  /** background field: exempt from the intro pull, reveal and density cull. */
  background?: boolean;
  /** ambient drift strength (0..1) — background stars only. */
  drift?: number;
  twinkleSpeed?: number;
}

/** Astra's blend: colour adds weighted by alpha, alpha accumulates "over". */
export function createAstraPointsMaterial(o: AstraMaterialOptions) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uPixelRatio: { value: 1 },
      uTime: { value: 0 },
      uIntensity: { value: o.intensity },
      uTwinkleSpeed: { value: o.twinkleSpeed ?? 0.62 },
      uIntroProgress: { value: o.background ? 1 : 0 },
      uKeep: { value: 1 },
      uRefZ: { value: 20.5 },
      uDepthDimNear: { value: 16 },
      uDepthDimFar: { value: 46 },
      uBackground: { value: o.background ? 1 : 0 },
      uDrift: { value: o.drift ?? 0 },
      uScatterSize: { value: new THREE.Vector2(18, 12) },
      uScatterCenter: { value: new THREE.Vector2(0, 3.6) },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
    blending: THREE.CustomBlending,
    blendEquation: THREE.AddEquation,
    blendSrc: THREE.SrcAlphaFactor,
    blendDst: THREE.OneFactor,
    blendEquationAlpha: THREE.AddEquation,
    blendSrcAlpha: THREE.OneFactor,
    blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
  });
}

/** Per-frame values shared by every star material. */
export interface StarFrame {
  time: number;
  pixelRatio: number;
  intro: number;
  keep: number;
  refZ: number;
  dimNear: number;
  dimFar: number;
  scatterW: number;
  scatterH: number;
  scatterY: number;
  twinkleSpeed: number;
}

export function updateStarUniforms(m: THREE.ShaderMaterial, f: StarFrame) {
  const u = m.uniforms;
  u.uTime.value = f.time;
  u.uPixelRatio.value = f.pixelRatio;
  u.uIntroProgress.value = f.intro;
  u.uKeep.value = f.keep;
  u.uRefZ.value = f.refZ;
  u.uDepthDimNear.value = f.dimNear;
  u.uDepthDimFar.value = f.dimFar;
  u.uTwinkleSpeed.value = f.twinkleSpeed;
  (u.uScatterSize.value as THREE.Vector2).set(f.scatterW, f.scatterH);
  (u.uScatterCenter.value as THREE.Vector2).set(0, f.scatterY);
}
