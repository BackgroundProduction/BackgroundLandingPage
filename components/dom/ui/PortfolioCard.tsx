import Image from "next/image";
import type { PortfolioEntry } from "@/content/portfolio";

export default function PortfolioCard({ entry }: { entry: PortfolioEntry }) {
  return (
    <article className="group relative flex flex-col gap-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-bg-elevated">
        <Image
          src={entry.image.src}
          alt={entry.image.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-sm bg-bg-base/70 px-3 py-1 text-eyebrow text-gold backdrop-blur-sm">
          {entry.category}
        </span>
      </div>
      <div>
        <h3 className="font-display text-xl md:text-2xl font-semibold text-cream leading-tight">
          {entry.title}
        </h3>
        <p className="mt-2 text-sm text-cream-dim">
          {entry.location}
          {entry.date ? ` · ${entry.date}` : ""}
        </p>
        {entry.description && (
          <p className="mt-2 text-sm text-cream-dim leading-relaxed">
            {entry.description}
          </p>
        )}
      </div>
    </article>
  );
}
