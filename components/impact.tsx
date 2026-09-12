import { resume } from "@/content/resume";
import { ACCENTS } from "@/lib/accents";
import { Container } from "./section";
import { Reveal } from "./reveal";

export function Impact() {
  return (
    <section id="impact" className="scroll-mt-24 border-y border-line bg-surface/30">
      <Container className="py-10 sm:py-12">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
          {resume.metrics.map((m, i) => (
            <Reveal
              as="div"
              key={m.label}
              delay={i * 0.06}
              className="sm:border-l sm:border-line sm:pl-6 sm:first:border-l-0 sm:first:pl-0"
            >
              <dt className="font-mono text-[clamp(1.3rem,3vw,2.25rem)] font-semibold tracking-tight" style={{ color: ACCENTS[m.accent] }}>
                {m.value}
              </dt>
              <dd className="mt-2 text-sm text-fg">{m.label}</dd>
              {m.note ? (
                <dd className="mt-1 text-xs text-faint">{m.note}</dd>
              ) : null}
            </Reveal>
          ))}
        </dl>
        <p className="mt-6 text-xs leading-relaxed text-muted">Platform scale provides context for the work; individual responsibilities and outcomes are detailed below.</p>
      </Container>
    </section>
  );
}
