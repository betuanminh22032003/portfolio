import { resume } from "@/content/resume";

/**
 * Core-stack logo strip. Real brand marks from Simple Icons, rendered in a
 * uniform muted tone so the single-accent palette stays calm; each brightens
 * on hover. Plain <img> keeps them out of the Next image pipeline.
 */
export function TechLogos() {
  return (
    <ul className="flex flex-wrap gap-2.5">
      {resume.coreStack.map((tech) => (
        <li
          key={tech.slug}
          className="group flex items-center gap-2 rounded-full border border-line bg-surface-2/70 py-1.5 pl-2.5 pr-3.5"
          title={tech.name}
        >
          <img
            src={`https://cdn.simpleicons.org/${tech.slug}/9aa1ad`}
            alt=""
            aria-hidden="true"
            width={16}
            height={16}
            loading="lazy"
            className="size-4 opacity-80 transition-opacity duration-200 group-hover:opacity-100"
          />
          <span className="font-mono text-[12px] text-muted transition-colors group-hover:text-fg">
            {tech.name}
          </span>
        </li>
      ))}
    </ul>
  );
}
