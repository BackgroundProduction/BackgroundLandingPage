import { Space_Grotesk, Inter, Noto_Sans_Armenian, Instrument_Serif } from "next/font/google";

export const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  weight: "variable",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/* Editorial serif for the italic accent word inside display headings
   (Shopify-Editions-style contrast against the grotesk). Latin only —
   Armenian accent text falls through to Noto with synthetic italic. */
export const serifDisplay = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif-display",
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

/* Space Grotesk and Inter have no Armenian glyphs — Noto Sans Armenian sits
   after them in the font stacks so Armenian text renders consistently. */
export const notoArmenian = Noto_Sans_Armenian({
  subsets: ["armenian"],
  variable: "--font-armenian",
  weight: "variable",
  display: "swap",
});
