import { en, type Content } from "./locales/en";
import { hy } from "./locales/hy";

export type Locale = "hy" | "en";

/** Armenian is the default locale — served at `/`; English at `/en`. */
export const DEFAULT_LOCALE: Locale = "hy";

export const locales: Record<Locale, Content> = { hy, en };

export type { Content };
