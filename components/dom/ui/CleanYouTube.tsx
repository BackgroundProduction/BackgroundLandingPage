"use client";

/**
 * Clean background YouTube embed: muted autoplay, looped, no controls /
 * related videos / keyboard, non-interactive (pointer events blocked).
 * Fills its parent box; `coverWidth` oversizes the 16:9 iframe so it
 * cover-crops the container (111.2% suits a 16/10 frame).
 * A small YouTube logo can still flash briefly — the embed API does not
 * allow removing it entirely.
 */
export default function CleanYouTube({
  id,
  coverWidth = "111.2%",
  start,
}: {
  id: string;
  coverWidth?: string;
  /** seconds into the video to begin (first play; loops restart at 0) */
  start?: number;
}) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    loop: "1",
    playlist: id, // required to loop a single video
    modestbranding: "1",
    rel: "0",
    playsinline: "1",
    disablekb: "1",
    fs: "0",
    iv_load_policy: "3",
  });
  if (start) params.set("start", String(start));

  return (
    <div className="absolute inset-0 overflow-hidden">
      <iframe
        title=""
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ height: "100%", width: coverWidth, border: "none" }}
        src={`https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`}
        allow="autoplay; encrypted-media"
      />
      {/* transparent blocker — no pause on click, no hover chrome */}
      <div className="absolute inset-0" />
    </div>
  );
}
