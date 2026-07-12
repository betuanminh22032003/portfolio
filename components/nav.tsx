import { resume } from "@/content/resume";
import { Container } from "./section";

const links = [
  { label: "Focus", href: "#focus" },
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#work" },
  { label: "Stack", href: "#stack" },
];

export function Nav() {
  const initials = resume.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/70 backdrop-blur-md">
      <Container>
        <nav className="flex h-16 items-center justify-between gap-4">
          <a
            href="#top"
            className="group flex items-center gap-2.5"
            aria-label={`${resume.name}, back to top`}
          >
            <span className="grid size-8 place-items-center rounded-[8px] border border-line-strong bg-surface-2 font-mono text-[13px] font-semibold text-accent">
              {initials}
            </span>
            <span className="hidden font-mono text-sm text-muted transition-colors group-hover:text-fg sm:block">
              {resume.name.toLowerCase().replace(/\s+/g, "-")}
            </span>
          </a>

          <div className="hidden items-center gap-7 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-muted transition-colors hover:text-fg"
              >
                {l.label}
              </a>
            ))}
          </div>

          <a
            href="#contact"
            className="rounded-[10px] border border-accent/30 bg-accent-soft px-3.5 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
          >
            Get in touch
          </a>
        </nav>
      </Container>
    </header>
  );
}
