import type { CSSProperties } from "react";

/**
 * The portfolio's categorical accent palette. The dark base stays neutral;
 * these colors key content by category (a focus area, a metric, a project).
 * Cyan doubles as the primary action color (see --color-accent in globals.css).
 */
export type Accent = "cyan" | "pink" | "lime" | "orange" | "violet";

export const ACCENTS: Record<Accent, string> = {
  cyan: "#38bdf8",
  pink: "#f472b6",
  lime: "#a3e635",
  orange: "#fb923c",
  violet: "#a78bfa",
};

/** Inline CSS var so children can reference the accent via `var(--a)`. */
export function accentVars(accent: Accent): CSSProperties {
  return { ["--a" as string]: ACCENTS[accent] } as CSSProperties;
}

/** Hex + alpha suffix helpers for tints (e.g. soft fills, borders). */
export function accentTint(accent: Accent, alphaHex: string): string {
  return ACCENTS[accent] + alphaHex;
}
