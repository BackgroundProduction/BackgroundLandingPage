"use client";

/**
 * Infinite horizontal marquee strip. The item list is rendered twice so the
 * CSS translateX(-50%) loop is seamless. Pauses on hover; still under
 * prefers-reduced-motion.
 */
export default function Marquee({
  items,
  reverse = false,
}: {
  items: string[];
  reverse?: boolean;
}) {
  const row = (
    <div className="flex shrink-0 items-center" aria-hidden="true">
      {items.map((item, i) => (
        <span
          key={i}
          className="font-display flex items-center gap-8 whitespace-nowrap pr-8 text-3xl font-medium text-text-dim md:text-5xl"
        >
          {item}
          <span className="text-accent">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="overflow-hidden border-y py-6 md:py-8"
      style={{ borderColor: "var(--color-line-soft)" }}
    >
      <div className={`marquee ${reverse ? "marquee-reverse" : ""}`}>
        {row}
        {row}
      </div>
    </div>
  );
}
