"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Progressive scroll reveal. Server output stays visible, so content survives
 * disabled/failed JS. After hydration, only offscreen elements are staged.
 */
export function Reveal({
  children,
  delay = 0,
  y = 20,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [staged, setStaged] = useState(false);

  useEffect(() => {
    const element = ref.current;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!element || reduce || saveData || !("IntersectionObserver" in window)) {
      setStaged(false);
      return;
    }
    if (element.getBoundingClientRect().top <= window.innerHeight * 1.05) return;

    setStaged(true);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStaged(false);
        observer.disconnect();
      }
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [reduce]);

  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={false}
      animate={staged ? { opacity: 0, y } : { opacity: 1, y: 0 }}
      transition={{
        duration: reduce ? 0 : 0.65,
        delay: staged || reduce ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}
