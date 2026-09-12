"use client";

import { useEffect, useRef } from "react";

type MeshStatus = "loading" | "ready" | "unavailable";

export function ServiceMeshCanvas({ onStatus }: { onStatus: (status: MeshStatus) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let frame = 0;
    let visible = false;
    let pageVisible = !document.hidden;
    let contextLost = false;
    let cleanup = () => {};

    void import("three").then((THREE) => {
      if (disposed) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });
      } catch {
        onStatus("unavailable");
        return;
      }

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(0, 0.35, 8.4);

      const root = new THREE.Group();
      root.rotation.set(-0.12, -0.2, 0.04);
      scene.add(root);

      const palette = [0x53e7ff, 0xff6f7d, 0xc8ff67, 0xa985ff, 0x46ffd2];
      const points = [
        [-2.55, 0.15, -0.4], [-1.4, 1.65, 0.4], [0.1, 1.05, -0.5],
        [1.8, 1.75, 0.15], [2.55, 0.05, -0.2], [1.25, -1.25, 0.55],
        [-0.45, -1.7, -0.15], [-1.85, -1.05, 0.65], [0.15, 0.05, 1.15],
      ].map(([x, y, z]) => new THREE.Vector3(x, y, z));

      const connections = [
        [0, 1], [0, 7], [0, 8], [1, 2], [1, 8], [2, 3], [2, 8],
        [3, 4], [3, 8], [4, 5], [4, 8], [5, 6], [5, 8], [6, 7],
        [6, 8], [7, 8], [2, 5], [1, 6],
      ];

      // Curved, depth-separated routes make the mesh spatial rather than a flat graph.
      const routes = connections.map(([a, b], index) => {
        const control = points[a].clone().lerp(points[b], 0.5);
        control.z += (index % 2 ? 1 : -1) * 0.5;
        const curve = new THREE.QuadraticBezierCurve3(points[a], control, points[b]);
        const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(32));
        const material = new THREE.LineBasicMaterial({
          color: palette[index % palette.length], transparent: true,
          opacity: 0.23, blending: THREE.AdditiveBlending, depthWrite: false,
        });
        root.add(new THREE.Line(geometry, material));
        return curve;
      });

      const nodeGeometry = new THREE.IcosahedronGeometry(0.18, 1);
      const coreGeometry = new THREE.IcosahedronGeometry(0.47, 2);
      const haloGeometry = new THREE.IcosahedronGeometry(0.69, 1);
      const nodes: InstanceType<typeof THREE.Mesh>[] = [];

      points.forEach((position, index) => {
        const color = palette[index % palette.length];
        const material = new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: index === 8 ? 1.1 : 0.65,
          roughness: 0.28,
          metalness: 0.5,
        });
        const node = new THREE.Mesh(index === 8 ? coreGeometry : nodeGeometry, material);
        node.position.copy(position);
        root.add(node);
        nodes.push(node);
      });

      const halo = new THREE.Mesh(
        haloGeometry,
        new THREE.MeshBasicMaterial({ color: 0x53e7ff, wireframe: true, transparent: true, opacity: 0.22 }),
      );
      halo.position.copy(points[8]);
      root.add(halo);

      const orbitGeometry = new THREE.TorusGeometry(2.85, 0.007, 4, 120);
      const orbits = [0, 1, 2].map((index) => {
        const orbit = new THREE.Mesh(orbitGeometry, new THREE.MeshBasicMaterial({
          color: palette[index === 2 ? 3 : index], transparent: true,
          opacity: 0.17, depthWrite: false,
        }));
        orbit.rotation.set(0.65 + index * 0.64, index * 0.7, index * 0.3);
        root.add(orbit);
        return orbit;
      });

      const particleGeometry = new THREE.SphereGeometry(0.045, 8, 8);
      const particles = routes.map((curve, index) => {
        const material = new THREE.MeshBasicMaterial({ color: palette[index % palette.length] });
        const mesh = new THREE.Mesh(particleGeometry, material);
        root.add(mesh);
        return { mesh, curve, offset: index / connections.length };
      });

      const dustGeometry = new THREE.BufferGeometry();
      const dustPositions = new Float32Array(270);
      for (let i = 0; i < dustPositions.length; i += 3) {
        dustPositions[i] = (Math.random() - 0.5) * 7.5;
        dustPositions[i + 1] = (Math.random() - 0.5) * 5.4;
        dustPositions[i + 2] = (Math.random() - 0.5) * 3.5;
      }
      dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
      const dustMaterial = new THREE.PointsMaterial({ color: 0x9eeeff, size: 0.018, transparent: true, opacity: 0.5 });
      root.add(new THREE.Points(dustGeometry, dustMaterial));

      scene.add(new THREE.AmbientLight(0x9bb3c6, 0.85));
      const light = new THREE.PointLight(0x53e7ff, 18, 16);
      light.position.set(1.5, 2.5, 4);
      scene.add(light);
      const coralLight = new THREE.PointLight(0xff6f7d, 12, 12);
      coralLight.position.set(-3, -2, 2);
      scene.add(coralLight);

      const pointer = { x: 0, y: 0 };
      const resize = () => {
        const { width, height } = canvas.getBoundingClientRect();
        if (!width || !height) return;
        const dprCap = width < 640 ? 1.25 : 1.6;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.position.z = Math.max(8.4, 6.7 / camera.aspect);
        camera.updateProjectionMatrix();
      };
      const onPointerMove = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      };
      const onPointerLeave = () => { pointer.x = 0; pointer.y = 0; };
      let previousTime = 0;
      let elapsed = 0;
      const render = (time: number) => {
        if (disposed || contextLost || !visible || !pageVisible) return;
        const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;
        previousTime = time;
        elapsed += delta;
        const t = elapsed * 0.35;
        const ease = 1 - Math.exp(-delta * 3);
        root.rotation.y += (pointer.x * 0.2 + Math.sin(t * 0.35) * 0.3 - 0.2 - root.rotation.y) * ease;
        root.rotation.x += (-pointer.y * 0.12 - 0.12 - root.rotation.x) * ease;
        nodes.forEach((node, index) => {
          const pulse = 1 + Math.sin(t * 5 + index) * 0.08;
          node.scale.setScalar(pulse);
          node.rotation.x += delta * 0.24;
          node.rotation.y += delta * 0.36;
        });
        halo.rotation.x -= delta * 0.18;
        halo.rotation.y += delta * 0.3;
        orbits.forEach((orbit, index) => { orbit.rotation.z += delta * (index % 2 ? -0.04 : 0.03); });
        particles.forEach(({ mesh, curve, offset }, index) => {
          const progress = (t * (0.65 + (index % 4) * 0.08) + offset) % 1;
          curve.getPoint(progress, mesh.position);
          mesh.scale.setScalar(0.6 + Math.sin(progress * Math.PI) * 0.65);
        });
        renderer.render(scene, camera);
        frame = requestAnimationFrame(render);
      };
      const resume = () => {
        cancelAnimationFrame(frame);
        previousTime = 0;
        if (!contextLost && visible && pageVisible) frame = requestAnimationFrame(render);
      };
      const onVisibility = () => {
        pageVisible = !document.hidden;
        resume();
      };
      const intersection = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        resume();
      }, { threshold: 0 });
      const resizeObserver = new ResizeObserver(resize);

      intersection.observe(canvas);
      resizeObserver.observe(canvas);
      document.addEventListener("visibilitychange", onVisibility);
      canvas.addEventListener("pointermove", onPointerMove, { passive: true });
      canvas.addEventListener("pointerleave", onPointerLeave);
      resize();
      renderer.render(scene, camera);
      onStatus("ready");
      resume();

      const onContextLost = (event: Event) => {
        event.preventDefault();
        cancelAnimationFrame(frame);
        contextLost = true;
        onStatus("unavailable");
      };
      const onContextRestored = () => {
        contextLost = false;
        resize();
        renderer.render(scene, camera);
        onStatus("ready");
        resume();
      };
      canvas.addEventListener("webglcontextlost", onContextLost);
      canvas.addEventListener("webglcontextrestored", onContextRestored);

      cleanup = () => {
        cancelAnimationFrame(frame);
        intersection.disconnect();
        resizeObserver.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        canvas.removeEventListener("pointermove", onPointerMove);
        canvas.removeEventListener("pointerleave", onPointerLeave);
        canvas.removeEventListener("webglcontextlost", onContextLost);
        canvas.removeEventListener("webglcontextrestored", onContextRestored);
        const geometries = new Set<InstanceType<typeof THREE.BufferGeometry>>();
        const materials = new Set<InstanceType<typeof THREE.Material>>();
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
            geometries.add(object.geometry);
            const ownedMaterials = Array.isArray(object.material) ? object.material : [object.material];
            ownedMaterials.forEach((material) => materials.add(material));
          }
        });
        geometries.forEach((geometry) => geometry.dispose());
        materials.forEach((material) => material.dispose());
        renderer.dispose();
        renderer.forceContextLoss();
      };
    }).catch(() => { if (!disposed) onStatus("unavailable"); });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [onStatus]);

  return <canvas ref={canvasRef} className="absolute inset-0 size-full" aria-hidden="true" />;
}
