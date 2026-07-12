import { resume } from "@/content/resume";
import { ACCENTS } from "@/lib/accents";
import { Container, SectionHeading } from "./section";
import { Reveal } from "./reveal";
import { TechLogos } from "./tech-logos";

export function Skills() {
  return (
    <section id="stack" className="scroll-mt-24 border-t border-line py-20 sm:py-28">
      <Container>
        <SectionHeading
          title="Stack & skills"
          lead="The tools I reach for, grouped by where they sit in the system."
        />

        <Reveal className="mb-12">
          <TechLogos />
        </Reveal>

        <div className="divide-y divide-line border-y border-line">
          {resume.skills.map((group, i) => (
            <Reveal as="div" key={group.label} delay={i * 0.04}>
              <div className="grid gap-4 py-5 md:grid-cols-12 md:gap-8">
                <p className="flex items-center gap-2.5 font-mono text-[13px] text-muted md:col-span-3 md:pt-0.5">
                  <span
                    className="inline-block size-1.5 rounded-full"
                    style={{ backgroundColor: ACCENTS[group.accent] }}
                  />
                  {group.label}
                </p>
                <ul className="flex flex-wrap gap-2 md:col-span-9">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-line bg-surface-2/60 px-3 py-1 text-[13px] text-fg/85"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
