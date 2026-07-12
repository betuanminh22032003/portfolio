import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconBrandGithub,
  IconBrandLinkedin,
  IconArrowRight,
} from "@tabler/icons-react";
import { resume } from "@/content/resume";
import { Container } from "./section";
import { Reveal } from "./reveal";

export function Contact() {
  const socials = [
    resume.links.github
      ? { label: "GitHub", href: resume.links.github, Icon: IconBrandGithub }
      : null,
    resume.links.linkedin
      ? { label: "LinkedIn", href: resume.links.linkedin, Icon: IconBrandLinkedin }
      : null,
  ].filter(Boolean) as {
    label: string;
    href: string;
    Icon: typeof IconBrandGithub;
  }[];

  return (
    <section
      id="contact"
      className="scroll-mt-24 border-t border-line py-24 sm:py-32"
    >
      <Container>
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-[13px] text-accent">Open to Senior Backend roles</p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
              Let&apos;s build resilient systems together.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted">
              {resume.summary}
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`mailto:${resume.email}`}
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
                Download CV
              </a>
            </div>

            {/* contact details */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 font-mono text-[13px] text-muted">
              <a
                href={`mailto:${resume.email}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-fg"
              >
                <IconMail stroke={1.75} className="size-4 text-accent" />
                {resume.email}
              </a>
              <a
                href={`tel:${resume.phoneHref}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-fg"
              >
                <IconPhone stroke={1.75} className="size-4 text-accent" />
                {resume.phone}
              </a>
              <span className="inline-flex items-center gap-2">
                <IconMapPin stroke={1.75} className="size-4 text-accent" />
                {resume.location}
              </span>
            </div>

            {socials.length > 0 ? (
              <div className="mt-8 flex items-center justify-center gap-3">
                {socials.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="inline-grid size-10 place-items-center rounded-[10px] border border-line-strong bg-surface-2 text-fg transition-colors hover:border-accent/40 hover:text-accent"
                  >
                    <Icon stroke={1.75} className="size-5" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
