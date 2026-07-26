import type { CSSProperties } from "react";

/**
 * Legacy category keys remain part of the content schema, but every category
 * resolves to one restrained sage accent for a more cohesive visual identity.
 */
export type Accent = "cyan" | "pink" | "lime" | "orange" | "violet";

export const ACCENTS: Record<Accent, string> = {
  cyan: "#9ab782",
  pink: "#9ab782",
  lime: "#9ab782",
  orange: "#9ab782",
  violet: "#9ab782",
};

/** Inline CSS var so children can reference the accent via `var(--a)`. */
export function accentVars(accent: Accent): CSSProperties {
  return { ["--a" as string]: ACCENTS[accent] } as CSSProperties;
}

/** Hex + alpha suffix helpers for tints (e.g. soft fills, borders). */
export function accentTint(accent: Accent, alphaHex: string): string {
  return ACCENTS[accent] + alphaHex;
}
