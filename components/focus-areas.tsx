import type { ComponentType } from "react";
import {
  IconWorldBolt,
  IconShieldLock,
  IconSparkles,
  IconActivityHeartbeat,
  IconArrowsExchange,
} from "@tabler/icons-react";
import { resume, type FocusArea } from "@/content/resume";
import { ACCENTS, accentTint } from "@/lib/accents";
import { Container, SectionHeading } from "./section";
import { Reveal } from "./reveal";

type IconComp = ComponentType<{ className?: string; stroke?: number }>;

const iconMap: Record<FocusArea["icon"], IconComp> = {
  scale: IconWorldBolt,
  identity: IconShieldLock,
  ai: IconSparkles,
  reliability: IconActivityHeartbeat,
  migration: IconArrowsExchange,
};

function Card({
  area,
  feature = false,
}: {
  area: FocusArea;
  feature?: boolean;
}) {
  const Glyph = iconMap[area.icon];
  const color = ACCENTS[area.accent];

  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface/50 p-6 transition-colors hover:border-line-strong ${
        feature ? "md:p-8" : ""
      }`}
    >
      {/* categorical accent bar */}
      <div
        className="absolute inset-x-0 top-0 h-0.5"
        style={{ backgroundImage: `linear-gradient(90deg, ${color}, transparent)` }}
      />
      {feature ? (
        <>
          <div
            className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full blur-3xl"
            style={{ backgroundColor: accentTint(area.accent, "22") }}
          />
          <div className="tech-grid pointer-events-none absolute inset-0 opacity-40" />
        </>
      ) : null}

      <div className="relative">
        <span
          className="inline-grid size-10 place-items-center rounded-[8px] border"
          style={{
            color,
            borderColor: accentTint(area.accent, "44"),
            backgroundColor: accentTint(area.accent, "14"),
          }}
        >
          <Glyph className="size-5" stroke={1.75} />
        </span>

        <h3
          className={`mt-5 font-semibold tracking-tight text-fg ${
            feature ? "text-xl" : "text-lg"
          }`}
        >
          {area.title}
        </h3>
        <p
          className={`mt-2.5 text-sm leading-relaxed text-muted ${
            feature ? "max-w-md" : ""
          }`}
        >
          {area.blurb}
        </p>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {area.tags.map((t) => (
            <li
              key={t}
              className="rounded-full border border-line bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-faint"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function FocusAreas() {
  const [feature, ...rest] = resume.focusAreas;
  return (
    <section id="focus" className="scroll-mt-24 py-20 sm:py-28">
      <Container>
        <SectionHeading
          title="What I work on"
          lead="Five areas where I do my strongest work, from national-scale platforms and identity to AI-assisted learning and reliability."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Reveal className="md:col-span-2">
            <Card area={feature} feature />
          </Reveal>
          {rest.map((area, i) => (
            <Reveal key={area.title} delay={0.06 * (i + 1)}>
              <Card area={area} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
