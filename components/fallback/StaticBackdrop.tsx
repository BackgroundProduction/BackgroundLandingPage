/**
 * Reduced-motion / no-WebGL backdrop: a fixed CSS gradient evoking the same
 * gallery-spotlight mood, with zero JS and zero motion. The DOM sections
 * carry all real content, so nothing is lost without the 3D layer.
 */
export default function StaticBackdrop() {
  return (
    <div
      className="fixed inset-0 z-0"
      aria-hidden="true"
      style={{
        background: `
          radial-gradient(ellipse 60% 45% at 70% 12%, rgba(201, 162, 75, 0.16), transparent 65%),
          radial-gradient(ellipse 45% 40% at 25% 80%, rgba(92, 26, 31, 0.25), transparent 70%),
          radial-gradient(ellipse 90% 70% at 50% 50%, #14100d, #0b0908)
        `,
      }}
    />
  );
}
