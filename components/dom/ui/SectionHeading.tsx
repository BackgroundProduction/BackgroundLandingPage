import clsx from "clsx";

interface SectionHeadingProps {
  eyebrow?: string;
  children: React.ReactNode;
  size?: "xl" | "lg" | "md";
  as?: "h1" | "h2" | "h3";
  className?: string;
  id?: string;
}

export default function SectionHeading({
  eyebrow,
  children,
  size = "lg",
  as: Tag = "h2",
  className,
  id,
}: SectionHeadingProps) {
  return (
    <div className={clsx("max-w-5xl", className)}>
      {eyebrow && (
        <p className="text-eyebrow text-gold mb-5 font-medium" aria-hidden="false">
          {eyebrow}
        </p>
      )}
      <Tag
        id={id}
        className={clsx("font-display font-semibold text-cream", {
          "text-display-xl": size === "xl",
          "text-display-lg": size === "lg",
          "text-display-md": size === "md",
        })}
      >
        {children}
      </Tag>
    </div>
  );
}
