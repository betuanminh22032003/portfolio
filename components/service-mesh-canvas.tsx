"use client";

import { useEffect, useRef } from "react";
import type { SystemStory } from "@/content/system-stories";

type MeshStatus = "loading" | "ready" | "unavailable";
type Props = {
  story: SystemStory;
  activeStep: number;
  paused: boolean;
  onStatus: (status: MeshStatus) => void;
  onProject: (positions: Array<{ x: number; y: number }>) => void;
  onSelectNode: (index: number) => void;
};

/** The models share the node order of the accessible HTML diagram. */
export function ServiceMeshCanvas(props: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const live = useRef(props);
  const refresh = useRef<() => void>(() => {});
  live.current = props;

  useEffect(() => { refresh.current(); }, [props.activeStep, props.paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let cleanup = () => {};
    live.current.onStatus("loading");

    void import("three").then((T) => {
      if (disposed) return;
      const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
      const scene = new T.Scene();
      const board = new T.Group();
      scene.add(board);
      const camera = new T.OrthographicCamera(-5, 5, 3.5, -3.5, 0.1, 60);
      camera.position.set(2.6, 7.8, 10);
      camera.lookAt(0, 0.15, 0);
      const accent = new T.Color(props.story.color);
      const body = new T.MeshStandardMaterial({ color: 0x263d4c, roughness: 0.6, metalness: 0.25 });
      const dark = new T.MeshStandardMaterial({ color: 0x101e29, roughness: 0.8 });
      const trim = new T.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 0.25, roughness: 0.45 });
      const screen = new T.MeshBasicMaterial({ color: 0x233f4d });
      const box = (group: InstanceType<typeof T.Group>, w: number, h: number, d: number, x: number, y: number, z: number, material = body) => {
        const mesh = new T.Mesh(new T.BoxGeometry(w, h, d), material);
        mesh.position.set(x, y, z);
        group.add(mesh);
        return mesh;
      };
      box(board, 7.4, 0.12, 5.15, 0, -0.11, 0, dark);
      const points = [new T.Vector3(-2, 0, -1.35), new T.Vector3(2, 0, -1.35), new T.Vector3(2, 0, 1.35), new T.Vector3(-2, 0, 1.35)];
      const nodeGroups: InstanceType<typeof T.Group>[] = [];
      const plinths: InstanceType<typeof T.MeshStandardMaterial>[] = [];
      const anchors: InstanceType<typeof T.Vector3>[] = [];
      props.story.nodes.forEach((node, index) => {
        const group = new T.Group();
        group.position.copy(points[index]);
        group.userData.nodeIndex = index;
        board.add(group);
        nodeGroups.push(group);
        const plinth = body.clone();
        plinths.push(plinth);
        box(group, 1.65, 0.12, 1.25, 0, 0.02, 0, plinth);
        if (node.kind === "client") {
          box(group, 0.62, 0.08, 0.4, 0, 0.16, 0.1);
          box(group, 0.1, 0.36, 0.1, 0, 0.32, 0.1);
          box(group, 1.26, 0.8, 0.13, 0, 0.83, 0);
          const display = new T.Mesh(new T.BoxGeometry(1.1, 0.64, 0.025), screen);
          display.position.set(0, 0.83, 0.08); group.add(display);
          box(group, 0.95, 0.055, 0.03, 0, 1.04, 0.105, trim);
          [0, 1, 2].forEach((row) => box(group, 0.7 - row * 0.12, 0.035, 0.03, -0.1, 0.88 - row * 0.12, 0.105, trim));
        } else if (node.kind === "data") {
          for (let layer = 0; layer < 3; layer++) {
            const drum = new T.Mesh(new T.CylinderGeometry(0.56, 0.56, 0.25, 32), body);
            drum.position.y = 0.26 + layer * 0.3; group.add(drum);
            const rim = new T.Mesh(new T.TorusGeometry(0.55, 0.025, 6, 32), trim);
            rim.rotation.x = Math.PI / 2; rim.position.y = 0.39 + layer * 0.3; group.add(rim);
          }
        } else if (node.kind === "queue") {
          box(group, 1.35, 0.1, 0.72, 0, 0.23, 0);
          box(group, 1.35, 0.55, 0.08, 0, 0.48, -0.32);
          for (let slot = 0; slot < 4; slot++) box(group, 0.06, 0.55, 0.72, -0.66 + slot * 0.44, 0.48, 0);
          for (let slot = 0; slot < 3; slot++) {
            const message = box(group, 0.28, 0.37, 0.12, -0.44 + slot * 0.44, 0.49, 0.04, trim);
            message.rotation.z = -0.08;
          }
        } else if (node.kind === "identity") {
          box(group, 1.04, 1.02, 0.66, 0, 0.63, 0);
          box(group, 0.86, 0.85, 0.05, 0, 0.63, 0.36, dark);
          const lock = new T.Mesh(new T.TorusGeometry(0.17, 0.045, 8, 24, Math.PI), trim);
          lock.position.set(0, 0.76, 0.42); group.add(lock);
          box(group, 0.39, 0.28, 0.1, 0, 0.62, 0.44, trim);
          box(group, 0.045, 0.1, 0.025, 0, 0.64, 0.505, dark);
        } else {
          for (let slab = 0; slab < 3; slab++) {
            box(group, 1.05, 0.22, 0.75, 0, 0.27 + slab * 0.3, 0);
            box(group, 0.1, 0.065, 0.025, -0.34, 0.27 + slab * 0.3, 0.389, trim);
            box(group, 0.46, 0.035, 0.025, 0.12, 0.27 + slab * 0.3, 0.389, dark);
          }
        }
        anchors.push(points[index].clone().add(new T.Vector3(0, 1.62, 0)));
      });
      const routes = props.story.steps.map((step) => {
        const from = props.story.nodes.findIndex((node) => node.id === step.from);
        const to = props.story.nodes.findIndex((node) => node.id === step.to);
        const start = points[from].clone().setY(0.13);
        const end = points[to].clone().setY(0.13);
        const direction = end.clone().sub(start).normalize();
        start.addScaledVector(direction, 0.88); end.addScaledVector(direction, -0.88);
        const curve = new T.LineCurve3(start, end);
        const material = new T.MeshBasicMaterial({ color: 0x39515f, transparent: true, opacity: 0.4 });
        const line = new T.Mesh(new T.TubeGeometry(curve, 1, 0.027, 6, false), material);
        board.add(line);
        return { curve, material, line, from, to, direction };
      });
      const packet = new T.Mesh(new T.BoxGeometry(0.17, 0.12, 0.17), trim);
      board.add(packet);
      const arrow = new T.Mesh(new T.ConeGeometry(0.12, 0.29, 3), trim);
      board.add(arrow);
      scene.add(new T.HemisphereLight(0xd4f2ff, 0x15212c, 2.3));
      const key = new T.DirectionalLight(0xffffff, 2.7); key.position.set(-3, 8, 6); scene.add(key);

      let frame = 0, last = 0, elapsed = 0, visible = true, lost = false, hovered = -1;
      const pointer = new T.Vector2();
      const raycaster = new T.Raycaster();
      let targetRotation = 0;
      let previousProjection = "";
      const draw = (time: number) => {
        frame = 0;
        if (disposed || lost || document.hidden || !visible) { last = 0; return; }
        const delta = last ? Math.min((time - last) / 1000, 0.06) : 0;
        last = time;
        if (!live.current.paused) {
          elapsed += delta;
          board.rotation.y += (targetRotation - board.rotation.y) * (1 - Math.exp(-delta * 8));
        }
        const active = Math.max(0, Math.min(live.current.activeStep, routes.length - 1));
        const route = routes[active];
        routes.forEach((item, index) => {
          const sameConnection = (item.from === route.from && item.to === route.to) || (item.from === route.to && item.to === route.from);
          item.line.visible = index === active || !sameConnection;
          item.material.color.set(index === active ? accent : 0x39515f);
          item.material.opacity = index === active ? 1 : 0.35;
        });
        plinths.forEach((material, index) => {
          material.emissive.copy(accent);
          material.emissiveIntensity = index === hovered ? 0.35 : index === route.from || index === route.to ? 0.14 : 0;
        });
        route.curve.getPoint((elapsed * 0.36) % 1, packet.position);
        route.curve.getPoint(0.78, arrow.position);
        arrow.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), route.direction);
        board.updateMatrixWorld(true);
        camera.updateMatrixWorld(true);
        const positions = anchors.map((anchor) => {
          const projected = board.localToWorld(anchor.clone()).project(camera);
          return { x: (projected.x + 1) / 2, y: (1 - projected.y) / 2 };
        });
        const projectionKey = positions.map((point) => `${point.x.toFixed(4)},${point.y.toFixed(4)}`).join(";");
        if (projectionKey !== previousProjection) { previousProjection = projectionKey; live.current.onProject(positions); }
        renderer.render(scene, camera);
        if (!live.current.paused) frame = requestAnimationFrame(draw);
      };
      const requestDraw = () => { cancelAnimationFrame(frame); last = 0; frame = requestAnimationFrame(draw); };
      refresh.current = requestDraw;
      const resize = () => {
        const { width, height } = canvas.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 640 ? 1.25 : 1.6));
        renderer.setSize(width, height, false);
        const aspect = width / height;
        const halfHeight = Math.max(3.25, 4.8 / aspect);
        camera.left = -halfHeight * aspect; camera.right = halfHeight * aspect;
        camera.top = halfHeight; camera.bottom = -halfHeight;
        camera.updateProjectionMatrix(); requestDraw();
      };
      const hitNode = (event: PointerEvent | MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(nodeGroups, true)[0];
        let object: InstanceType<typeof T.Object3D> | undefined = hit?.object;
        while (object && object.userData.nodeIndex === undefined) object = object.parent ?? undefined;
        return object?.userData.nodeIndex as number | undefined;
      };
      const move = (event: PointerEvent) => {
        hovered = hitNode(event) ?? -1;
        targetRotation = Math.max(-1, Math.min(1, pointer.x)) * 0.025;
        canvas.style.cursor = hovered >= 0 ? "pointer" : "default";
        if (live.current.paused) requestDraw();
      };
      const leave = () => { hovered = -1; targetRotation = 0; canvas.style.cursor = "default"; requestDraw(); };
      const click = (event: MouseEvent) => { const index = hitNode(event); if (index !== undefined) live.current.onSelectNode(index); };
      const visibility = () => { cancelAnimationFrame(frame); requestDraw(); };
      const contextLost = (event: Event) => { event.preventDefault(); lost = true; cancelAnimationFrame(frame); live.current.onStatus("unavailable"); };
      const contextRestored = () => { lost = false; previousProjection = ""; resize(); live.current.onStatus("ready"); };
      const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; requestDraw(); });
      const observer = new ResizeObserver(resize);
      intersection.observe(canvas); observer.observe(canvas);
      canvas.addEventListener("pointermove", move, { passive: true });
      canvas.addEventListener("pointerleave", leave);
      canvas.addEventListener("click", click);
      canvas.addEventListener("webglcontextlost", contextLost);
      canvas.addEventListener("webglcontextrestored", contextRestored);
      document.addEventListener("visibilitychange", visibility);
      cleanup = () => {
        cancelAnimationFrame(frame); refresh.current = () => {};
        intersection.disconnect(); observer.disconnect();
        canvas.removeEventListener("pointermove", move); canvas.removeEventListener("pointerleave", leave); canvas.removeEventListener("click", click);
        canvas.removeEventListener("webglcontextlost", contextLost); canvas.removeEventListener("webglcontextrestored", contextRestored);
        document.removeEventListener("visibilitychange", visibility);
        const geometries = new Set<InstanceType<typeof T.BufferGeometry>>();
        const materials = new Set<InstanceType<typeof T.Material>>([body, dark, trim, screen]);
        scene.traverse((object) => { if (object instanceof T.Mesh) { geometries.add(object.geometry); (Array.isArray(object.material) ? object.material : [object.material]).forEach((material) => materials.add(material)); } });
        geometries.forEach((geometry) => geometry.dispose()); materials.forEach((material) => material.dispose());
        renderer.dispose(); renderer.forceContextLoss();
      };
      resize(); live.current.onStatus("ready");
    }).catch(() => { if (!disposed) { cleanup(); live.current.onStatus("unavailable"); } });
    return () => { disposed = true; cleanup(); };
  }, [props.story]);

  return <canvas ref={canvasRef} className="absolute inset-0 size-full" aria-hidden="true" />;
}
