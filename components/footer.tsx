import { IconArrowUp } from "@tabler/icons-react";
import { resume } from "@/content/resume";
import { Container } from "./section";

export function Footer() {
  const year = 2026;
  return (
    <footer className="border-t border-line py-10">
      <Container>
        <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
          <p className="font-mono text-xs text-faint">
            © {year} {resume.name} · {resume.role}
          </p>
          <a
            href="#top"
            className="inline-flex items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-fg"
          >
            Back to top
            <IconArrowUp stroke={2} className="size-3.5" />
          </a>
        </div>
      </Container>
    </footer>
  );
}
