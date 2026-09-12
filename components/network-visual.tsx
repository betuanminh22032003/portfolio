"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

const ServiceMeshCanvas = dynamic(
  () => import("./service-mesh-canvas").then((module) => module.ServiceMeshCanvas),
  { ssr: false },
);

function StaticMesh() {
  return (
    <svg className="absolute inset-0 size-full" viewBox="0 0 640 520" role="img" aria-label="Distributed service mesh illustration">
      <g className="mesh-lines" fill="none">
        <path d="M80 270 175 125 316 202 465 105 560 260 435 405 285 430 135 385Z" />
        <path d="m80 270 240 5 240-15M175 125l145 150 145-170M135 385l185-110 115 130M285 430l35-155" />
      </g>
      <g className="mesh-nodes">
        {[[80,270],[175,125],[316,202],[465,105],[560,260],[435,405],[285,430],[135,385]].map(([x,y], i) => (
          <circle key={i} cx={x} cy={y} r="10" />
        ))}
        <circle className="mesh-core" cx="320" cy="275" r="28" />
        <circle className="mesh-orbit" cx="320" cy="275" r="50" fill="none" />
      </g>
    </svg>
  );
}

export function NetworkVisual() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection;
    let nearViewport = false;
    const update = () => {
      const allow = nearViewport && !motion.matches && !connection?.saveData && "WebGLRenderingContext" in window;
      setEnabled(allow);
      if (!allow) setReady(false);
    };
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      nearViewport = entry.isIntersecting;
      update();
    }, { rootMargin: "200px" });
    if (stageRef.current) observer.observe(stageRef.current);
    motion.addEventListener("change", update);
    connection?.addEventListener("change", update);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", update);
      connection?.removeEventListener("change", update);
    };
  }, []);

  const onStatus = useCallback((status: "loading" | "ready" | "unavailable") => {
    setReady(status === "ready");
  }, []);

  return (
    <div ref={stageRef} className="network-stage" role="img" aria-label="Illustrative distributed service mesh; animated data moves between connected services.">
      <div className={`network-fallback ${ready ? "opacity-0" : "opacity-100"}`}><StaticMesh /></div>
      {enabled ? <ServiceMeshCanvas onStatus={onStatus} /> : null}
      <div className="network-vignette" aria-hidden="true" />
      <div className="network-label network-label-a"><span /> identity.gateway</div>
      <div className="network-label network-label-b"><span /> event.backbone</div>
      <div className="network-label network-label-c"><span /> read.projection</div>
      <div className="network-telemetry" aria-hidden="true">
        <span>SYSTEM STUDY</span><span>18 ROUTES</span><span>ILLUSTRATIVE</span>
      </div>
    </div>
  );
}
