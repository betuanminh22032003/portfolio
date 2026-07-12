import type { ReactNode } from "react";
import { Reveal } from "./reveal";

/** Page-wide horizontal container. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Section heading. Deliberately eyebrow-free (eyebrow restraint): the headline
 * alone carries the section, with an optional one-line lead beneath it. No
 * section-number labels — those read as an AI tell.
 */
export function SectionHeading({
  id,
  title,
  lead,
}: {
  id?: string;
  title: string;
  lead?: string;
}) {
  return (
    <Reveal className="mb-10 sm:mb-14">
      <div className="border-b border-line pb-5">
        <div className="max-w-2xl">
          <h2
            id={id}
            className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl"
          >
            {title}
          </h2>
          {lead ? (
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{lead}</p>
          ) : null}
        </div>
      </div>
    </Reveal>
  );
}
