import {
  IconArrowDown,
  IconArrowRight,
  IconDownload,
  IconMapPin,
} from "@tabler/icons-react";
import { resume } from "@/content/resume";
import { Container } from "./section";
import { Reveal } from "./reveal";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="hero-orbit" aria-hidden="true" />
      <Container className="relative max-w-[1320px]">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:gap-20">
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
              <p className="mt-14 font-mono text-xs tracking-[0.16em] text-faint">BE TUAN MINH / BACKEND ENGINEER</p>
              <h1 className="mt-5 max-w-[12ch] text-[clamp(3.9rem,9vw,8.6rem)] font-semibold leading-[0.84] tracking-[-0.075em] text-fg">
                Systems that hold up.
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-8 max-w-[58ch] text-lg leading-[1.65] text-muted sm:text-xl">
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

          <Reveal delay={0.18} className="lg:pb-1">
            <aside className="border-t border-line-strong pt-6" aria-label="Professional profile">
              <p className="font-mono text-[11px] tracking-[0.14em] text-faint">CURRENTLY</p>
              <p className="mt-2 text-lg font-medium tracking-tight text-fg">{resume.current}</p>
              <p className="mt-6 text-[15px] leading-7 text-muted">{resume.summary}</p>
              <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6">
                <div>
                  <dt className="font-mono text-[11px] tracking-wider text-faint">EXPERIENCE</dt>
                  <dd className="mt-2 text-2xl font-semibold tracking-tight text-fg">5+ years</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] tracking-wider text-faint">SPECIALTY</dt>
                  <dd className="mt-2 text-sm font-medium leading-6 text-fg">Distributed systems</dd>
                </div>
              </dl>
            </aside>
          </Reveal>
        </div>

        <a href="#impact" aria-label="Continue to impact metrics" className="mt-20 inline-flex items-center gap-2 font-mono text-[11px] tracking-wider text-faint transition-colors hover:text-fg">
          <IconArrowDown className="size-4" stroke={1.5} />
          SELECTED IMPACT
        </a>
      </Container>
    </section>
  );
}
