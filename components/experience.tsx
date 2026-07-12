import { IconChevronRight } from "@tabler/icons-react";
import { resume } from "@/content/resume";
import { ACCENTS } from "@/lib/accents";
import { Container, SectionHeading } from "./section";
import { Reveal } from "./reveal";

export function Experience() {
  return (
    <section
      id="experience"
      className="scroll-mt-24 border-t border-line py-20 sm:py-28"
    >
      <Container>
        <SectionHeading
          title="Experience"
          lead="Where the platforms above were built, migrated, and run in production."
        />

        <div className="space-y-14">
          {resume.experience.map((job) => {
            const color = ACCENTS[job.accent];
            return (
              <Reveal key={job.company}>
                <div className="grid gap-8 md:grid-cols-12">
                  {/* meta */}
                  <div className="md:col-span-4">
                    <h3 className="text-xl font-semibold tracking-tight text-fg">
                      {job.company}
                    </h3>
                    <p className="mt-1" style={{ color }}>
                      {job.role}
                    </p>
                    <p className="mt-3 font-mono text-xs text-faint">
                      {job.period}
                    </p>
                    <p className="font-mono text-xs text-faint">
                      {job.location}
                    </p>

                    <ul className="mt-5 flex flex-wrap gap-1.5">
                      {job.products.map((p) => (
                        <li
                          key={p}
                          className="rounded-full border border-line bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-muted"
                        >
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* detail */}
                  <div className="md:col-span-8">
                    <p className="text-[15px] leading-relaxed text-muted">
                      {job.summary}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {job.bullets.map((b) => (
                        <li key={b} className="flex gap-3">
                          <IconChevronRight
                            stroke={2.5}
                            className="mt-0.5 size-3.5 shrink-0"
                            style={{ color }}
                          />
                          <span className="text-[15px] leading-relaxed text-fg/85">
                            {b}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
