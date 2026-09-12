const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const ts = require("typescript");
const Three = require("three");

// Execute the actual TS sources in memory; no browser or WebGL is emulated.
function compile(relativePath, dependencies, environment = {}) {
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, "..", relativePath), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(code, { exports: module.exports, module, require: (name) => {
    if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
    return dependencies[name];
  }, ...environment });
  return module.exports;
}
const { resume } = compile("content/resume.ts", {});
const { systemStories } = compile("content/system-stories.ts", { "./resume": { resume } });

test("walkthrough claims use public résumé contributions and every step has valid endpoints", () => {
  assert.equal(systemStories.length, 3);
  for (const story of systemStories) {
    assert(resume.projects[story.projectIndex].bullets.includes(story.responsibility));
    assert.equal(story.nodes.length, 4);
    const ids = new Set(story.nodes.map((node) => node.id));
    assert.equal(ids.size, 4);
    const visited = new Set();
    for (const step of story.steps) {
      assert(ids.has(step.from) && ids.has(step.to));
      assert.notEqual(step.from, step.to);
      assert(step.packet && step.description);
      visited.add(step.from); visited.add(step.to);
    }
    assert.equal(visited.size, 4);
  }
  const sso = systemStories[0];
  assert.equal(sso.steps[1].packet, "Authorization code");
  assert.equal(sso.steps[2].to, "identity");
  assert.equal(sso.steps[3].to, "api");
});

class Events {
  constructor() { this.listeners = new Map(); }
  addEventListener(name, callback) { this.listeners.set(name, callback); }
  removeEventListener(name, callback) { if (this.listeners.get(name) === callback) this.listeners.delete(name); }
  dispatch(name, event = {}) { this.listeners.get(name)?.(event); }
}

async function canvasHarness(story = systemStories[0]) {
  const canvas = new Events();
  canvas.style = {};
  canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width: 320, height: 270 });
  const document = new Events(); document.hidden = false;
  const frames = new Map(); const observers = [];
  const statuses = []; const positions = []; const renderers = [];
  let frameId = 0;
  class Observer {
    constructor(callback) { this.callback = callback; observers.push(this); this.disconnected = false; }
    observe() {}
    disconnect() { this.disconnected = true; }
  }
  class Renderer {
    constructor() { this.renders = 0; renderers.push(this); }
    setPixelRatio(value) { this.dpr = value; }
    setSize() {}
    render(scene) { this.renders++; this.scene = scene; }
    dispose() { this.disposed = true; }
    forceContextLoss() { this.contextReleased = true; }
  }
  let refs = [], effects = [], pending = [], refCursor = 0, effectCursor = 0;
  const react = {
    useRef(value) { const index = refCursor++; return refs[index] ??= { current: index === 0 ? canvas : value }; },
    useEffect(callback, deps) {
      const index = effectCursor++;
      const previous = effects[index];
      if (!previous || deps.some((value, i) => value !== previous.deps[i])) {
        pending.push(() => { previous?.cleanup?.(); effects[index] = { deps, cleanup: callback() }; });
      }
    },
  };
  const { ServiceMeshCanvas } = compile("components/service-mesh-canvas.tsx", {
    react, "react/jsx-runtime": { jsx: () => null }, three: { ...Three, WebGLRenderer: Renderer },
  }, {
    document, window: { devicePixelRatio: 3 }, IntersectionObserver: Observer, ResizeObserver: Observer,
    requestAnimationFrame: (callback) => { frames.set(++frameId, callback); return frameId; },
    cancelAnimationFrame: (id) => frames.delete(id),
  });
  let props = { story, activeStep: 0, paused: false, onStatus: (value) => statuses.push(value), onProject: (value) => positions.push(value), onSelectNode: () => {} };
  async function update(values = {}) {
    props = { ...props, ...values }; refCursor = effectCursor = 0;
    ServiceMeshCanvas(props); const queue = pending; pending = []; queue.forEach((callback) => callback());
    await new Promise(setImmediate);
  }
  function tick(time = 1000) { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach((callback) => callback(time)); }
  const cleanup = () => effects.forEach((effect) => effect.cleanup?.());
  await update();
  return { canvas, document, frames, observers, statuses, positions, renderers, update, tick, cleanup };
}

test("pause and step changes redraw without rebuilding the renderer", async () => {
  const h = await canvasHarness();
  h.tick();
  assert(h.frames.size > 0);
  await h.update({ paused: true }); h.tick(1016);
  assert.equal(h.frames.size, 0);
  const before = h.renderers[0].renders;
  await h.update({ activeStep: 2 }); h.tick(1032);
  assert.equal(h.renderers.length, 1);
  assert(h.renderers[0].renders > before);
  assert.equal(h.frames.size, 0);
  assert.equal(h.renderers[0].dpr, 1.25);
  h.cleanup();
});

test("offscreen, hidden-tab and context-loss states suspend and recover", async () => {
  const h = await canvasHarness(); h.tick();
  h.observers[0].callback([{ isIntersecting: false }]); h.tick(1100);
  assert.equal(h.frames.size, 0);
  h.observers[0].callback([{ isIntersecting: true }]); h.tick(1200);
  assert(h.frames.size > 0);
  h.document.hidden = true; h.document.dispatch("visibilitychange"); h.tick(1300);
  assert.equal(h.frames.size, 0);
  h.document.hidden = false; h.document.dispatch("visibilitychange"); h.tick(1400);
  assert(h.frames.size > 0);
  h.canvas.dispatch("webglcontextlost", { preventDefault() {} });
  assert.equal(h.statuses.at(-1), "unavailable"); assert.equal(h.frames.size, 0);
  const projections = h.positions.length;
  h.canvas.dispatch("webglcontextrestored"); h.tick(1500);
  assert.equal(h.statuses.at(-1), "ready");
  assert(h.positions.length > projections, "HTML anchors must be republished after fallback reset");
  h.cleanup();
});

test("switching workflows disposes old resources and listeners; mobile labels fit", async () => {
  const h = await canvasHarness(); h.tick();
  const first = h.renderers[0];
  const positions = h.positions.at(-1);
  for (const point of positions) {
    assert(point.x * 320 > 60 && point.x * 320 < 260, "label horizontal bounds");
    assert(point.y * 270 > 35 && point.y * 270 < 245, "label vertical bounds");
  }
  let geometryDisposed = 0;
  first.scene.traverse((object) => { object.geometry?.addEventListener("dispose", () => geometryDisposed++); });
  await h.update({ story: systemStories[2] }); h.tick(1100);
  assert.equal(h.renderers.length, 2);
  assert(first.disposed && first.contextReleased);
  assert(geometryDisposed > 0);
  h.cleanup();
  assert(h.renderers[1].disposed && h.renderers[1].contextReleased);
  assert.equal(h.canvas.listeners.size, 0); assert.equal(h.document.listeners.size, 0);
  assert(h.observers.every((observer) => observer.disconnected));
  assert.equal(h.frames.size, 0);
});

test("production export preserves native controls, readable fallback, project links and subpath assets", () => {
  const root = path.join(__dirname, "..");
  const html = fs.readFileSync(path.join(root, "out/index.html"), "utf8");
  const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map((match) => match[1]));
  for (const story of systemStories) {
    assert(ids.has(`flow-${story.id}`));
    story.steps.forEach((step, i) => assert(ids.has(`step-${story.id}-${i}`)));
    assert(ids.has(`project-${story.projectIndex+1}`));
    assert(html.includes(story.title));
  }
  assert(!html.includes('style="opacity:0'));
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert(ids.has(match[1]));
  for (const match of html.matchAll(/(?:src|href)="(\/portfolio\/_next\/[^"]+)"/g)) {
    assert(fs.existsSync(path.join(root, "out", match[1].replace("/portfolio/", ""))));
  }
  assert(fs.existsSync(path.join(root, "out/BeTuanMinh_Resume.pdf")));
});
