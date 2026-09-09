import { BlendFunction, Effect } from "postprocessing";
import { Uniform, Vector2 } from "three";

/**
 * Lens optics for the hero, ported from the Astra scene's flare pass: a soft
 * halo, a faint ring, three ghosts and short four-point streaks on the
 * primary hero star, a lighter halo + streaks on up to five secondary hero
 * stars, and a static photographic grain that rides mostly on bright areas.
 * Sources are fed each frame as uv-space centres with an edge-fade
 * visibility. The dirty-glass distortion of the original is left out.
 */

export const OPTICS_SECONDARY_SOURCES = 5;

const fragmentShader = /* glsl */ `
  uniform vec2 uCenter;
  uniform float uVisibility;
  uniform vec2 uSecondaryCenters[5];
  uniform float uSecondaryVisibility[5];
  uniform float uAspect;
  uniform float uIntensity;
  uniform float uHalo;
  uniform float uGhosts;
  uniform float uStreaks;
  uniform float uStreakLength;
  uniform float uVerticalStreaks;
  uniform float uSecondaryIntensity;
  uniform float uGrain;

  float astraHash(vec2 point) {
    return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float softDisc(vec2 point, float radius, float softness) {
    return 1.0 - smoothstep(radius - softness, radius + softness, length(point));
  }
  float softRing(vec2 point, float radius, float width) {
    float distanceToRing = abs(length(point) - radius);
    return 1.0 - smoothstep(width, width * 2.0, distanceToRing);
  }
  vec2 aspectCorrect(vec2 point) {
    point.x *= uAspect;
    return point;
  }
  float secondaryFlare(vec2 center, vec2 uv) {
    vec2 point = aspectCorrect(uv - center);
    float distanceToSource = length(point);
    float nearHalo = exp(-distanceToSource * distanceToSource * 520.0) * 0.1;
    float halo = exp(-distanceToSource * 17.0) * 0.055;
    float horizontalWindow = 1.0 - smoothstep(uStreakLength * 0.72, uStreakLength, abs(point.x));
    float verticalWindow = 1.0 - smoothstep(uStreakLength * 0.72, uStreakLength, abs(point.y));
    float horizontalStreak = exp(-abs(point.y) * 360.0) * exp(-abs(point.x) * 10.0) * horizontalWindow * 0.24;
    float verticalStreak = exp(-abs(point.x) * 360.0) * exp(-abs(point.y) * 10.0) * verticalWindow * 0.24 * uVerticalStreaks;
    return nearHalo + halo + horizontalStreak + verticalStreak;
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec3 base = inputColor.rgb;
    vec2 source = aspectCorrect(uv - uCenter);
    float sourceDistance = length(source);

    float core = exp(-sourceDistance * sourceDistance * 480.0) * 0.18;
    float halo = exp(-sourceDistance * 11.5) * uHalo;
    halo += softRing(source, 0.105, 0.006) * 0.05 * uHalo;

    float horizontalWindow = 1.0 - smoothstep(uStreakLength * 0.72, uStreakLength, abs(source.x));
    float verticalWindow = 1.0 - smoothstep(uStreakLength * 0.72, uStreakLength, abs(source.y));
    float horizontalStreak = exp(-abs(source.y) * 310.0) * exp(-abs(source.x) * 7.5) * horizontalWindow;
    float softHorizontalStreak = exp(-abs(source.y) * 78.0) * exp(-abs(source.x) * 5.2) * horizontalWindow * 0.16;
    float verticalStreak = exp(-abs(source.x) * 310.0) * exp(-abs(source.y) * 7.5) * verticalWindow;
    float softVerticalStreak = exp(-abs(source.x) * 78.0) * exp(-abs(source.y) * 5.2) * verticalWindow * 0.16;
    float streak = (horizontalStreak + softHorizontalStreak
      + (verticalStreak + softVerticalStreak) * uVerticalStreaks) * uStreaks;

    vec2 opticalAxis = vec2(0.5) - uCenter;
    vec2 ghostA = aspectCorrect(uv - (uCenter + opticalAxis * 0.82));
    vec2 ghostB = aspectCorrect(uv - (uCenter + opticalAxis * 1.38));
    vec2 ghostC = aspectCorrect(uv - (uCenter + opticalAxis * 1.82));
    float ghosts = 0.0;
    ghosts += softDisc(ghostA, 0.016, 0.014) * 0.18;
    ghosts += softRing(ghostB, 0.046, 0.006) * 0.11;
    ghosts += softDisc(ghostC, 0.025, 0.02) * 0.08;
    ghosts *= uGhosts;

    float flare = (core + halo + streak + ghosts) * uIntensity;
    float secondary = 0.0;
    for (int i = 0; i < 5; i++) {
      secondary += secondaryFlare(uSecondaryCenters[i], uv) * uSecondaryVisibility[i];
    }
    secondary *= uIntensity * uSecondaryIntensity;
    vec3 color = base + vec3(0.956) * (flare * uVisibility + secondary);

    float baseLuminance = dot(base, vec3(0.2126, 0.7152, 0.0722));
    float reveal = smoothstep(0.025, 0.72, baseLuminance);
    float grain = astraHash(floor(uv * vec2(1536.0, 1024.0)));
    color += vec3((grain - 0.5) * uGrain) * (0.18 + reveal * 0.82);

    outputColor = vec4(max(color, vec3(0.0)), inputColor.a);
  }
`;

export class AstraOpticsEffect extends Effect {
  constructor() {
    super("AstraOpticsEffect", fragmentShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map<string, Uniform>([
        ["uCenter", new Uniform(new Vector2(-2, -2))],
        ["uVisibility", new Uniform(0)],
        [
          "uSecondaryCenters",
          new Uniform(Array.from({ length: OPTICS_SECONDARY_SOURCES }, () => new Vector2(-2, -2))),
        ],
        ["uSecondaryVisibility", new Uniform(new Array(OPTICS_SECONDARY_SOURCES).fill(0))],
        ["uAspect", new Uniform(1)],
        // live values from the reference page
        ["uIntensity", new Uniform(0.28)],
        ["uHalo", new Uniform(0.12)],
        ["uGhosts", new Uniform(0.1)],
        ["uStreaks", new Uniform(0.18)],
        ["uStreakLength", new Uniform(0.03485)],
        ["uVerticalStreaks", new Uniform(1)],
        ["uSecondaryIntensity", new Uniform(0.55)],
        ["uGrain", new Uniform(0.031)],
      ]),
    });
  }

  setAspect(aspect: number) {
    this.uniforms.get("uAspect")!.value = aspect;
  }

  /** Primary source in uv space (0..1, y up) with a 0..1 visibility. */
  setPrimary(x: number, y: number, visibility: number) {
    (this.uniforms.get("uCenter")!.value as Vector2).set(x, y);
    this.uniforms.get("uVisibility")!.value = visibility;
  }

  setSecondary(index: number, x: number, y: number, visibility: number) {
    if (index < 0 || index >= OPTICS_SECONDARY_SOURCES) return;
    (this.uniforms.get("uSecondaryCenters")!.value as Vector2[])[index].set(x, y);
    (this.uniforms.get("uSecondaryVisibility")!.value as number[])[index] = visibility;
  }
}
