import { IconArrowUpRight, IconChevronRight } from "@tabler/icons-react";
import { resume, type Project } from "@/content/resume";
import { ACCENTS } from "@/lib/accents";
import { Container, SectionHeading } from "./section";
import { Reveal } from "./reveal";

function ProjectPanel({ project, index }: { project: Project; index: number }) {
  const mirrored = index % 2 === 1;
  const color = ACCENTS[project.accent];

  const details = (
    <div className="md:col-span-7">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[.14em] text-muted">Responsibilities & outcomes</p>
      <ul className="space-y-3">
        {project.bullets.map((b) => (
          <li key={b} className="flex gap-3">
            <IconChevronRight
              stroke={2.5}
              className="mt-0.5 size-3.5 shrink-0"
              style={{ color }}
            />
            <span className="text-[15px] leading-relaxed text-fg/85">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const aside = (
    <div className="md:col-span-5">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[.14em] text-muted">System context</p>
      <p className="text-[15px] leading-relaxed text-muted">{project.summary}</p>
      <ul className="mt-6 flex flex-wrap gap-1.5">
        {project.stack.map((t) => (
          <li
            key={t}
            className="rounded-full border border-line bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-muted"
          >
            {t}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <Reveal>
      <article id={`project-${index+1}`} className="project-chapter group relative scroll-mt-24 overflow-hidden rounded-card border border-line bg-surface/40 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-line-strong sm:p-8">
        <div
          className="absolute inset-x-0 top-0 h-0.5"
          style={{ backgroundImage: `linear-gradient(90deg, ${color}, transparent)` }}
        />

        {/* header */}
        <span className="chapter-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <div className="relative flex flex-wrap items-start justify-between gap-6 border-b border-line pb-6">
          <div>
            <p className="font-mono text-xs text-faint">
              {String(index + 1).padStart(2, "0")} · {project.owner}
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-fg">
              {project.name}
            </h3>
            <p className="mt-1.5" style={{ color }}>
              {project.kind}
            </p>
          </div>

          <div className="flex items-center gap-6">
            {project.metrics.map((m) => (
              <div key={m.label} className="text-right">
                <p
                  className="font-mono text-xl font-semibold sm:text-2xl"
                  style={{ color: ACCENTS[m.accent] }}
                >
                  {m.value}
                </p>
                <p className="mt-1 text-xs text-faint">{m.label}</p>
              </div>
            ))}
            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-10 items-center justify-center rounded-[10px] border border-line-strong bg-surface-2 text-fg transition-colors hover:border-accent/40 hover:text-accent"
                aria-label={`Visit ${project.name}`}
              >
                <IconArrowUpRight stroke={2} className="size-4" />
              </a>
            ) : null}
          </div>
        </div>

        {/* body */}
        <div className="grid gap-8 pt-6 md:grid-cols-12">
          {mirrored ? (
            <>
              {details}
              {aside}
            </>
          ) : (
            <>
              {aside}
              {details}
            </>
          )}
        </div>
      </article>
    </Reveal>
  );
}

export function Projects() {
  return (
    <section id="work" className="scroll-mt-24 border-t border-line py-20 sm:py-28">
      <Container>
        <SectionHeading
          title="Selected work"
          lead="Production platforms spanning national-scale education, identity, and real-time assessment."
        />
        <div className="space-y-6">
          {resume.projects.map((p, i) => (
            <ProjectPanel key={p.name} project={p} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
