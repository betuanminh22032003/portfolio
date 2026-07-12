import { IconSchool, IconAward } from "@tabler/icons-react";
import { resume } from "@/content/resume";
import { Container, SectionHeading } from "./section";
import { Reveal } from "./reveal";

export function Education() {
  return (
    <section className="border-t border-line py-20 sm:py-28">
      <Container>
        <SectionHeading title="Education & awards" />

        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <Reveal className="md:col-span-6">
            <div className="flex gap-4">
              <span className="inline-grid size-11 shrink-0 place-items-center rounded-[10px] border border-line-strong bg-surface-2 text-accent">
                <IconSchool className="size-5" stroke={1.75} />
              </span>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-fg">
                  {resume.education.school}
                </h3>
                <p className="mt-1 text-[15px] text-muted">
                  {resume.education.degree}
                </p>
                <p className="mt-2 font-mono text-xs text-faint">
                  {resume.education.detail}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal className="md:col-span-6">
            <ul className="space-y-4">
              {resume.awards.map((a) => (
                <li key={a.title} className="flex items-center gap-4">
                  <span className="inline-grid size-9 shrink-0 place-items-center rounded-[8px] border border-line bg-surface-2 text-accent">
                    <IconAward className="size-4" stroke={1.75} />
                  </span>
                  <div>
                    <p className="text-[15px] font-medium text-fg">{a.title}</p>
                    <p className="font-mono text-xs text-faint">{a.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
