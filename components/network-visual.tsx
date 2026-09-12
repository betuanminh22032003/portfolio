"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { IconArrowUpRight, IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";
import { resume } from "@/content/resume";
import { systemStories, type SystemStory } from "@/content/system-stories";
import styles from "./network-visual.module.css";

const ServiceMeshCanvas = dynamic(
  () => import("./service-mesh-canvas").then((module) => module.ServiceMeshCanvas),
  { ssr: false },
);

// The static drawing stands on its own; Three.js replaces only its geometry.
const staticCenters = [[130, 118], [390, 118], [390, 285], [130, 285]];
const staticLabels = [[25, 18], [75, 18], [75, 65], [25, 65]];

function StaticFlow({ story }: { story: SystemStory }) {
  return (
    <svg viewBox="0 0 520 355" preserveAspectRatio="none" className={styles.staticSvg} aria-hidden="true">
      <defs>
        <marker id={`arrow-${story.id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 1 L 8 5 L 0 9" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </marker>
      </defs>
      <path className={styles.board} d="M30 85 260 30 490 85 490 310 260 350 30 310Z" />
      {story.steps.map((step, i) => {
        const a = staticCenters[story.nodes.findIndex((node) => node.id === step.from)];
        const b = staticCenters[story.nodes.findIndex((node) => node.id === step.to)];
        const dx = b[0] - a[0]; const dy = b[1] - a[1]; const length = Math.hypot(dx, dy);
        const x1 = a[0] + dx / length * 39; const y1 = a[1] + dy / length * 30;
        const x2 = b[0] - dx / length * 40; const y2 = b[1] - dy / length * 31;
        const bend = (i % 2 ? 1 : -1) * 24;
        return <path key={i} data-route={i} className={styles.staticRoute} d={`M${x1} ${y1} Q${(x1+x2)/2+bend} ${(y1+y2)/2} ${x2} ${y2}`} markerEnd={`url(#arrow-${story.id})`} />;
      })}
      {story.nodes.map((node, i) => {
        const [x, y] = staticCenters[i];
        return (
          <g key={node.id} transform={`translate(${x} ${y})`} className={styles.staticNode}>
            <path d="M-43 10 0-5 43 10 0 27Z" className={styles.nodeBase} />
            {node.kind === "data" ? (
              <g><path d="M-24-16V7C-24 22 24 22 24 7V-16" /><ellipse cy="-16" rx="24" ry="9" /><path d="M-24-4C-24 10 24 10 24-4" /></g>
            ) : node.kind === "client" ? (
              <g><path d="M-25-27H25V3H-25Z" /><path d="M0 3V13M-14 13H14M-20-19H20" /></g>
            ) : node.kind === "queue" ? (
              <g>{[-24, -5, 14].map((dx) => <path key={dx} d={`M${dx}-19h14v32h-14Z`} />)}</g>
            ) : (
              <g><path d="M-25-21 0-30 25-21V10L0 20-25 10ZM0-11V20M-25-21 0-11 25-21" /><path d="M7-1 18-5M7 7 18 3" /></g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function NetworkVisual() {
  const stageRef = useRef<HTMLDivElement>(null);
  const nodeLabels = useRef<Record<string, Array<HTMLButtonElement | null>>>({});
  const [storyIndex, setStoryIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const story = systemStories[storyIndex];

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection;
    let nearViewport = false;
    const update = () => {
      const allow = nearViewport && !motion.matches && !connection?.saveData && "WebGLRenderingContext" in window && "ResizeObserver" in window;
      setEnabled(allow);
      if (!allow) setReady(false);
    };
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      nearViewport = entry.isIntersecting;
      update();
    }, { rootMargin: "120px" });
    if (stageRef.current) observer.observe(stageRef.current);
    motion.addEventListener("change", update);
    connection?.addEventListener("change", update);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", update);
      connection?.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (enabled && ready) return;
    Object.values(nodeLabels.current).forEach((labels) => labels.forEach((label, i) => {
      if (label) { label.style.left = `${staticLabels[i][0]}%`; label.style.top = `${staticLabels[i][1]}%`; }
    }));
  }, [enabled, ready, storyIndex]);

  const onStatus = useCallback((status: "loading" | "ready" | "unavailable") => setReady(status === "ready"), []);
  const onProject = useCallback((positions: Array<{ x: number; y: number }>) => {
    positions.forEach((point, i) => {
      const label = nodeLabels.current[story.id]?.[i];
      if (label) { label.style.left = `${point.x * 100}%`; label.style.top = `${point.y * 100}%`; }
    });
  }, [story.id]);
  const onSelectNode = useCallback((index: number) => {
    const id = story.nodes[index]?.id;
    const stepIndex = story.steps.findIndex((step) => step.to === id);
    setActiveStep(stepIndex < 0 ? 0 : stepIndex);
  }, [story]);

  return (
    <section ref={stageRef} className={styles.explorer} aria-labelledby="system-explorer-title">
      <div className={styles.heading}>
        <div><p className={styles.kicker}>Inside the backend</p><h2 id="system-explorer-title">Follow the work.</h2></div>
        <span className={styles.headingMark} aria-hidden="true">↗</span>
      </div>
      <fieldset className={styles.switcher}>
        <legend className="sr-only">Choose a backend workflow</legend>
        {systemStories.map((item, i) => (
          <div key={item.id}>
            <input type="radio" name="backend-flow" id={`flow-${item.id}`} value={item.id} checked={storyIndex === i} onChange={() => { setStoryIndex(i); setActiveStep(0); setReady(false); }} />
            <label htmlFor={`flow-${item.id}`} style={{ "--story-color": item.color } as CSSProperties}><span>{String(i+1).padStart(2, "0")}</span>{item.label}</label>
          </div>
        ))}
      </fieldset>

      {systemStories.map((item, index) => (
        <div key={item.id} className={styles.panel} data-story={item.id} style={{ "--story-color": item.color } as CSSProperties}>
          <div className={styles.flowTitle}><h3>{item.title}</h3><p>Select a step to trace the request.</p></div>
          <div className={styles.scene}>
            <div className={styles.staticLayer} style={{ opacity: index === storyIndex && ready ? 0 : 1 }}><StaticFlow story={item} /></div>
            {index === storyIndex && enabled ? <ServiceMeshCanvas story={story} activeStep={activeStep} paused={paused} onStatus={onStatus} onProject={onProject} onSelectNode={onSelectNode} /> : null}
            <div className={styles.nodeLabels}>
              {item.nodes.map((node, i) => (
                <button type="button" key={node.id} className={styles.nodeLabel} data-node={i}
                  data-active={item.steps[index === storyIndex ? activeStep : 0].from === node.id || item.steps[index === storyIndex ? activeStep : 0].to === node.id}
                  ref={(element) => { (nodeLabels.current[item.id] ??= [])[i] = element; }}
                  style={{ left: `${staticLabels[i][0]}%`, top: `${staticLabels[i][1]}%` }}
                  onClick={() => onSelectNode(i)} aria-label={`Inspect ${node.label}: ${node.detail}`}>
                  <span>{String(i+1).padStart(2, "0")}</span><strong>{node.label}</strong><small>{node.detail}</small>
                </button>
              ))}
            </div>
            <div className={styles.sceneFooter}>
              <span><i /> Directed data flow</span>
              {enabled && ready && index === storyIndex ? <button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? <IconPlayerPlay size={13} /> : <IconPlayerPause size={13} />}{paused ? "Resume motion" : "Pause motion"}</button> : <span>Conceptual flow</span>}
            </div>
          </div>
          <fieldset className={styles.steps}>
            <legend className="sr-only">Steps in {item.label}</legend>
            {item.steps.map((step, i) => (
              <div key={i}>
                <input type="radio" name={`step-${item.id}`} id={`step-${item.id}-${i}`} checked={index === storyIndex ? activeStep === i : i === 0} onChange={() => setActiveStep(i)} />
                <label htmlFor={`step-${item.id}-${i}`} title={step.title}><span>{i+1}</span><span>{step.packet}</span></label>
              </div>
            ))}
          </fieldset>
          {item.steps.map((step, i) => (
            <div key={i} className={styles.stepDescription} data-step={i}>
              <p className={styles.routeName}>{item.nodes.find((node) => node.id === step.from)?.label}<span aria-label="to">→</span>{item.nodes.find((node) => node.id === step.to)?.label}</p>
              <h4>{step.title}</h4><p>{step.description}</p>
            </div>
          ))}
          <div className={styles.workConnection}>
            <p>My contribution · {resume.projects[item.projectIndex].owner}</p>
            <blockquote>{item.responsibility}</blockquote>
            <a href={`#project-${item.projectIndex+1}`}>Explore {resume.projects[item.projectIndex].name}<IconArrowUpRight size={14} /></a>
          </div>
        </div>
      ))}
      <p className={styles.note}>Conceptual walkthroughs based on the project work below.</p>
    </section>
  );
}
