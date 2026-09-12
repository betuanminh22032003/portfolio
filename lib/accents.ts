import type { CSSProperties } from "react";

export type Accent = "cyan" | "pink" | "lime" | "orange" | "violet";

export const ACCENTS: Record<Accent, string> = {
  cyan: "#54e4f7",
  pink: "#ff7185",
  lime: "#c7f36b",
  orange: "#ff9f5a",
  violet: "#a98cff",
};

/** Inline CSS var so children can reference the accent via `var(--a)`. */
export function accentVars(accent: Accent): CSSProperties {
  return { ["--a" as string]: ACCENTS[accent] } as CSSProperties;
}

/** Hex + alpha suffix helpers for tints (e.g. soft fills, borders). */
export function accentTint(accent: Accent, alphaHex: string): string {
  return ACCENTS[accent] + alphaHex;
}
