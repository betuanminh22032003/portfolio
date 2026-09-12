import { IconMenu2 } from "@tabler/icons-react";
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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/75 backdrop-blur-xl">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent">Skip to content</a>
      <Container>
        <nav aria-label="Main navigation" className="flex h-16 items-center justify-between gap-4">
          <a
            href="#top"
            className="group flex items-center gap-2.5"
            aria-label={`${resume.name}, back to top`}
          >
            <span className="grid size-8 place-items-center border border-line-strong bg-surface-2 font-mono text-[12px] font-semibold text-accent">
              {initials.slice(0, 2)}
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

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="hidden border border-line-strong px-3.5 py-1.5 text-sm font-medium text-fg transition-colors hover:border-accent hover:text-accent sm:inline-flex"
            >
              Get in touch
            </a>
            <details className="mobile-nav relative md:hidden">
              <summary className="grid size-10 cursor-pointer list-none place-items-center border border-line-strong bg-surface-2 text-fg" aria-label="Open navigation menu">
                <IconMenu2 className="size-5" stroke={1.7} />
              </summary>
              <div className="absolute right-0 top-12 w-56 border border-line-strong bg-surface/95 p-2 shadow-2xl backdrop-blur-xl">
                {links.map((link) => (
                  <a key={link.href} href={link.href} className="block px-4 py-3 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-fg">
                    {link.label}
                  </a>
                ))}
                <a href="#contact" className="mt-1 block bg-accent px-4 py-3 text-sm font-semibold text-on-accent sm:hidden">Get in touch</a>
              </div>
            </details>
          </div>
        </nav>
      </Container>
    </header>
  );
}
