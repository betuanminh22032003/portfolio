import {
  IconArrowDown,
  IconArrowRight,
  IconDownload,
  IconMapPin,
} from "@tabler/icons-react";
import { resume } from "@/content/resume";
import { Container } from "./section";
import { Reveal } from "./reveal";
import { NetworkVisual } from "./network-visual";

export function Hero() {
  return (
    <section id="top" className="hero-shell relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="hero-aurora" aria-hidden="true" />
      <Container className="relative max-w-[1320px]">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,.85fr)_minmax(460px,1.15fr)] lg:gap-12">
          <div>
            <Reveal>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted">
                <span className="inline-flex items-center gap-2 font-medium text-accent">
                  <span className="size-1.5 rounded-full bg-accent shadow-[0_0_0_4px_rgba(154,183,130,.12)]" />
                  Open to senior backend roles
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <IconMapPin className="size-3.5" stroke={1.75} />
                  {resume.location}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <p className="mt-12 font-mono text-xs tracking-[0.16em] text-faint">{resume.name.toUpperCase()} / {resume.role.toUpperCase()}</p>
              <h1 className="hero-title mt-5 max-w-[11ch] text-[clamp(3.6rem,7vw,7rem)] font-semibold leading-[0.9] tracking-[-0.075em] text-fg">
                Systems that <span className="text-gradient">hold up.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-8 max-w-[55ch] text-lg leading-[1.65] text-muted sm:text-xl">
                I design and modernize <strong className="font-medium text-fg">.NET platforms</strong> for identity,
                learning, and real-time assessment—built for heavy traffic, clear operations, and safe change.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <a href="#work" className="group inline-flex items-center gap-2 bg-accent px-5 py-3 text-sm font-semibold text-on-accent transition-all hover:-translate-y-0.5 hover:bg-accent-strong active:translate-y-0">
                  View selected work
                  <IconArrowRight className="size-4 transition-transform group-hover:translate-x-1" stroke={2} />
                </a>
                <a href={resume.cvFile} download className="inline-flex items-center gap-2 text-sm font-medium text-fg underline decoration-line-strong underline-offset-8 transition-colors hover:text-accent">
                  <IconDownload className="size-4" stroke={1.75} />
                  Download résumé
                </a>
              </div>
            </Reveal>
          </div>

          <div className="relative min-w-0">
            <NetworkVisual />
          </div>
        </div>

        <a href="#impact" aria-label="Continue to impact metrics" className="mt-10 inline-flex items-center gap-2 font-mono text-[11px] tracking-wider text-faint transition-colors hover:text-fg">
          <IconArrowDown className="size-4" stroke={1.5} />
          SELECTED IMPACT
        </a>
      </Container>
    </section>
  );
}
