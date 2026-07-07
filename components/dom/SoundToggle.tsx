"use client";

import { useEffect, useState } from "react";
import { sound } from "@/lib/sound";
import { useContent } from "@/components/dom/LocaleProvider";

/**
 * Sound on/off pill. Off by default (autoplay policy requires a gesture).
 * While on, delegated listeners add hover ticks + click blips to all
 * links/buttons — one pair of listeners, not one per element.
 */
export default function SoundToggle() {
  const [on, setOn] = useState(false);
  const { t } = useContent();

  useEffect(() => {
    if (!on) return;
    let lastHover: EventTarget | null = null;
    const onOver = (e: PointerEvent) => {
      const target = (e.target as Element).closest("a, button, summary");
      if (target && target !== lastHover) {
        lastHover = target;
        sound.tick();
      }
      if (!target) lastHover = null;
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button, summary")) sound.click();
    };
    document.addEventListener("pointerover", onOver);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("click", onClick);
    };
  }, [on]);

  const toggle = () => {
    if (on) {
      sound.disable();
      setOn(false);
    } else {
      sound.enable();
      setOn(true);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-medium transition-colors hover:border-accent hover:text-accent"
    >
      <span
        aria-hidden="true"
        className="inline-block h-1.5 w-1.5 rounded-full transition-colors"
        style={{ background: on ? "var(--color-accent)" : "var(--color-line)" }}
      />
      {t.ui.sound} {on ? t.ui.soundOn : t.ui.soundOff}
    </button>
  );
}
