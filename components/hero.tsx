import { IconArrowRight, IconDownload } from "@tabler/icons-react";
import { resume } from "@/content/resume";
import { Container } from "./section";
import { Reveal } from "./reveal";
import { ArchitectureDiagram } from "./architecture-diagram";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] items-center pt-28 pb-16 sm:pt-24"
    >
      <Container className="max-w-[1440px]">
        <div className="grid items-center gap-12 xl:grid-cols-[minmax(360px,1fr)_minmax(680px,760px)] xl:items-start xl:gap-12 2xl:gap-16">
          {/* ── Left: value proposition ─────────────────────────────── */}
          <div className="xl:sticky xl:top-28 xl:self-start xl:pt-16">
            <Reveal>
              <p className="font-mono text-[13px] tracking-wide text-accent">
                {resume.role} · {resume.discipline}
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="mt-5 text-5xl font-semibold leading-[0.98] tracking-tight text-fg sm:text-6xl lg:text-7xl">
                {resume.name}
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-muted">
                {resume.intro}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-2 rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent transition-transform active:translate-y-px"
                >
                  Get in touch
                  <IconArrowRight
                    stroke={2}
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                  />
                </a>
                <a
                  href={resume.cvFile}
                  download
                  className="inline-flex items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:border-accent/40 hover:text-accent"
                >
                  <IconDownload stroke={2} className="size-4" />
                  Download CV
                </a>
              </div>
            </Reveal>
          </div>

          {/* ── Right: signature architecture diagram ────────────────── */}
          <Reveal delay={0.15} className="mx-auto w-full max-w-[760px] xl:mx-0">
            <figure className="relative">
              <div className="tech-grid relative rounded-card border border-line bg-surface/60 p-3 sm:p-4">
                <div className="pointer-events-none absolute inset-0 rounded-card bg-gradient-to-b from-transparent via-transparent to-bg/40" />
                <div className="relative mx-auto w-full">
                  <ArchitectureDiagram />
                </div>
              </div>
              <figcaption className="mt-3 text-center font-mono text-[11px] text-faint">
                Reliable event delivery, independently scalable services, and observable operations.
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
