"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import styles from "./architecture-diagram.module.css";

type FlowKind = "sync" | "event" | "projection" | "retry" | "deploy";
type NodeTone = "neutral" | "cyan" | "purple" | "amber" | "green";
type NodeVariant = "standard" | "compact" | "service" | "rail";
type MobileView = "runtime" | "events" | "platform";

type NodeDefinition = {
  id: string;
  title: string;
  detail?: string;
  meta?: string;
  tooltip: string;
  tone?: NodeTone;
};

const NODES = {
  web: {
    id: "web",
    title: "Web App",
    tooltip: "Browser client using OAuth 2.0 authorization code flow with PKCE.",
  },
  mobile: {
    id: "mobile",
    title: "Mobile App",
    tooltip: "Native client using OIDC and PKCE without a client secret.",
  },
  admin: {
    id: "admin",
    title: "Admin Portal",
    tooltip: "Privileged operations remain isolated behind policy-aware access controls.",
  },
  edge: {
    id: "edge",
    title: "CDN / WAF",
    detail: "TLS edge · bot control",
    tooltip: "Terminates public traffic, caches safe content, and filters abusive requests.",
    tone: "cyan",
  },
  bff: {
    id: "bff",
    title: "BFF Portals",
    detail: "web · mobile · admin",
    tooltip: "Purpose-built backends shape APIs for each client experience.",
  },
  gateway: {
    id: "gateway",
    title: "YARP API Gateway",
    detail: "JWT validation · rate limit",
    meta: "request routing",
    tooltip: "Validates tokens, applies quotas, and routes requests without touching service data.",
    tone: "cyan",
  },
  identity: {
    id: "identity",
    title: "Identity Service",
    detail: "OIDC · SSO · PKCE",
    meta: "own store · PostgreSQL",
    tooltip: "Owns identities, sessions, and authorization policy data.",
  },
  learning: {
    id: "learning",
    title: "Learning Service",
    detail: "curriculum · progress",
    meta: "own store · PostgreSQL",
    tooltip: "Owns curricula, enrollments, and learner progress transactions.",
  },
  assessment: {
    id: "assessment",
    title: "Assessment Service",
    detail: "exams · scoring",
    meta: "own store · SQL Server",
    tooltip: "Owns exam lifecycle and deterministic scoring state.",
  },
  ranking: {
    id: "ranking",
    title: "Ranking Service",
    detail: "leaderboard · aggregation",
    meta: "own store · PostgreSQL",
    tooltip: "Builds domain-owned ranking state from scoring events.",
  },
  ai: {
    id: "ai",
    title: "AI Writing Service",
    detail: "async AI workloads",
    meta: "own store · PostgreSQL",
    tooltip: "Queues long-running writing evaluations outside synchronous request paths.",
  },
  notification: {
    id: "notification",
    title: "Notification Service",
    detail: "email · push · in-app",
    meta: "own store · PostgreSQL",
    tooltip: "Owns delivery preferences, templates, and notification history.",
  },
  "service-db": {
    id: "service-db",
    title: "Service-owned database",
    detail: "PostgreSQL / SQL Server",
    tooltip: "Each service commits only to its own database boundary.",
    tone: "purple",
  },
  outbox: {
    id: "outbox",
    title: "Transactional Outbox",
    detail: "business data + event row",
    tooltip: "Business state and its pending event are committed in one local transaction.",
    tone: "purple",
  },
  debezium: {
    id: "debezium",
    title: "Debezium CDC",
    detail: "database log tailing",
    meta: "outbox event relay",
    tooltip: "Reads committed outbox records from the database log and publishes them to Kafka.",
    tone: "purple",
  },
  kafka: {
    id: "kafka",
    title: "Kafka event backbone",
    detail: "topics · partitions",
    meta: "consumer groups",
    tooltip: "Carries versioned domain events across independently scalable consumers.",
    tone: "cyan",
  },
  schema: {
    id: "schema",
    title: "Schema Registry",
    detail: "compatible contracts",
    tooltip: "Governs event schema evolution independently from producer deployments.",
    tone: "cyan",
  },
  saga: {
    id: "saga",
    title: "Saga Orchestrator",
    detail: "consume · compensate · emit",
    tooltip: "Coordinates long-running workflows using events and compensating actions.",
    tone: "cyan",
  },
  projections: {
    id: "projections",
    title: "CQRS Projection Workers",
    detail: "event → read model",
    tooltip: "Transforms immutable domain events into query-optimized projections.",
    tone: "purple",
  },
  "notification-consumer": {
    id: "notification-consumer",
    title: "Notification Consumers",
    detail: "email · push · in-app",
    tooltip: "Consumes notification intents idempotently and records delivery outcomes.",
    tone: "cyan",
  },
  analytics: {
    id: "analytics",
    title: "Analytics Pipeline",
    detail: "stream aggregation",
    tooltip: "Builds analytical datasets without coupling reporting to write databases.",
    tone: "cyan",
  },
  "cache-worker": {
    id: "cache-worker",
    title: "Cache Invalidation",
    detail: "event-driven expiry",
    tooltip: "Expires cached records only after the source transaction is committed.",
    tone: "cyan",
  },
  redis: {
    id: "redis",
    title: "Redis Cache",
    tooltip: "Serves hot query paths and is invalidated from committed domain events.",
    tone: "purple",
  },
  mongo: {
    id: "mongo",
    title: "MongoDB Read Model",
    tooltip: "Stores denormalized documents shaped for learner and portal queries.",
    tone: "purple",
  },
  search: {
    id: "search",
    title: "OpenSearch",
    tooltip: "Indexes searchable learning content and assessment metadata asynchronously.",
    tone: "purple",
  },
  views: {
    id: "views",
    title: "Materialized Views",
    tooltip: "Precomputes relational query models from the event stream.",
    tone: "purple",
  },
  actions: {
    id: "actions",
    title: "GitHub Actions",
    detail: "automated CI",
    tooltip: "Builds and tests artifacts, publishes images, and proposes manifest changes.",
    tone: "green",
  },
  registry: {
    id: "registry",
    title: "Container Registry",
    detail: "immutable image",
    tooltip: "Stores the versioned image produced by CI; it does not deploy the cluster.",
    tone: "green",
  },
  gitops: {
    id: "gitops",
    title: "GitOps Repository",
    detail: "desired state",
    tooltip: "Tracks reviewed Helm values and Kubernetes manifests as the source of truth.",
    tone: "green",
  },
  argo: {
    id: "argo",
    title: "Argo CD",
    detail: "pull reconciliation",
    tooltip: "Pulls desired state from Git and continuously reconciles Kubernetes.",
    tone: "green",
  },
  helm: {
    id: "helm",
    title: "Helm",
    detail: "rendered release",
    tooltip: "Renders environment-specific Kubernetes resources from reviewed values.",
    tone: "green",
  },
  k8s: {
    id: "k8s",
    title: "Kubernetes",
    detail: "rolling · canary · HPA",
    meta: "zero-downtime delivery",
    tooltip: "Runs horizontally scaled workloads with rolling or canary release strategies.",
    tone: "green",
  },
  otel: {
    id: "otel",
    title: "OpenTelemetry Collector",
    detail: "metrics · logs · traces",
    meta: "correlation ID",
    tooltip: "Receives, enriches, batches, and routes service telemetry to specialized backends.",
    tone: "cyan",
  },
  prometheus: {
    id: "prometheus",
    title: "Prometheus",
    detail: "metrics · SLOs",
    tooltip: "Stores operational metrics and evaluates service-level indicators.",
  },
  loki: {
    id: "loki",
    title: "Loki",
    detail: "structured logs",
    tooltip: "Indexes correlated logs without forcing services into a shared datastore.",
  },
  tempo: {
    id: "tempo",
    title: "Tempo",
    detail: "distributed traces",
    tooltip: "Stores end-to-end traces linked by trace and correlation identifiers.",
  },
  grafana: {
    id: "grafana",
    title: "Grafana",
    detail: "SLO monitoring",
    tooltip: "Queries metrics, logs, and traces in one operational workspace.",
    tone: "cyan",
  },
} as const satisfies Record<string, NodeDefinition>;

type NodeId = keyof typeof NODES;

const CLIENTS = ["web", "mobile", "admin"] as const satisfies readonly NodeId[];
const SERVICES = [
  "identity",
  "learning",
  "assessment",
  "ranking",
  "ai",
  "notification",
] as const satisfies readonly NodeId[];
const CONSUMERS = [
  "saga",
  "projections",
  "notification-consumer",
  "analytics",
  "cache-worker",
] as const satisfies readonly NodeId[];
const READ_STORES = ["redis", "mongo", "search", "views"] as const satisfies readonly NodeId[];
const TELEMETRY_BACKENDS = ["prometheus", "loki", "tempo"] as const satisfies readonly NodeId[];

const DEPENDENCIES = [
  ["web", "edge"],
  ["mobile", "edge"],
  ["admin", "edge"],
  ["edge", "bff"],
  ["bff", "gateway"],
  ...SERVICES.map((service) => ["gateway", service] as const),
  ...SERVICES.map((service) => [service, "service-db"] as const),
  ["service-db", "outbox"],
  ["outbox", "debezium"],
  ["debezium", "kafka"],
  ["schema", "kafka"],
  ...CONSUMERS.map((consumer) => ["kafka", consumer] as const),
  ["saga", "kafka"],
  ...READ_STORES.map((store) => ["projections", store] as const),
  ["cache-worker", "redis"],
  ["actions", "registry"],
  ["actions", "gitops"],
  ["gitops", "argo"],
  ["argo", "helm"],
  ["helm", "k8s"],
  ...SERVICES.map((service) => [service, "otel"] as const),
  ...TELEMETRY_BACKENDS.map((backend) => ["otel", backend] as const),
  ...TELEMETRY_BACKENDS.map((backend) => [backend, "grafana"] as const),
] as const satisfies readonly (readonly [NodeId, NodeId])[];

const SPECIAL_FLOWS: Partial<Record<NodeId, readonly NodeId[]>> = {
  outbox: ["service-db", "outbox", "debezium", "kafka"],
  kafka: [
    ...SERVICES,
    "service-db",
    "outbox",
    "debezium",
    "kafka",
    "schema",
    ...CONSUMERS,
  ],
  argo: ["actions", "registry", "gitops", "argo", "helm", "k8s"],
  otel: [...SERVICES, "otel", ...TELEMETRY_BACKENDS, "grafana"],
};

const MOBILE_VIEWS: readonly { id: MobileView; label: string }[] = [
  { id: "runtime", label: "Runtime" },
  { id: "events", label: "Event flow" },
  { id: "platform", label: "Delivery & observability" },
];

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

type InteractionProps = {
  activeId: NodeId | null;
  activeSet: ReadonlySet<NodeId>;
  pinnedId: NodeId | null;
  setHoveredId: (id: NodeId | null) => void;
  setFocusedId: (id: NodeId | null) => void;
  togglePinnedId: (id: NodeId) => void;
};

function ArchitectureNode({
  id,
  variant = "standard",
  activeId,
  activeSet,
  pinnedId,
  setHoveredId,
  setFocusedId,
  togglePinnedId,
}: { id: NodeId; variant?: NodeVariant } & InteractionProps) {
  const node = NODES[id] as NodeDefinition;
  const isCurrent = activeId === id;
  const isRelated = activeId !== null && activeSet.has(id);
  const isMuted = activeId !== null && !isRelated;
  const tone = node.tone ?? "neutral";

  return (
    <button
      type="button"
      className={cx(
        styles.node,
        styles[variant],
        styles[`tone${tone[0].toUpperCase()}${tone.slice(1)}`],
        isCurrent && styles.nodeCurrent,
        isRelated && !isCurrent && styles.nodeRelated,
        isMuted && styles.nodeMuted,
      )}
      aria-label={`${node.title}. ${node.detail ?? ""} ${node.meta ?? ""}. ${node.tooltip}`}
      aria-pressed={pinnedId === id}
      onMouseEnter={() => setHoveredId(id)}
      onMouseLeave={() => setHoveredId(null)}
      onFocus={() => setFocusedId(id)}
      onBlur={() => setFocusedId(null)}
      onClick={() => togglePinnedId(id)}
    >
      <span className={styles.nodeTitle}>{node.title}</span>
      {node.detail ? <span className={styles.nodeDetail}>{node.detail}</span> : null}
      {node.meta ? <span className={styles.nodeMeta}>{node.meta}</span> : null}
      {pinnedId === id ? <span className={styles.pinnedMark}>pinned</span> : null}
    </button>
  );
}

function FlowConnector({
  kind,
  from,
  to,
  label,
  orientation = "horizontal",
  pulse = false,
  activeId,
  activeSet,
  className,
}: {
  kind: FlowKind;
  from: readonly NodeId[];
  to: readonly NodeId[];
  label?: string;
  orientation?: "horizontal" | "vertical";
  pulse?: boolean;
  className?: string;
  activeId: NodeId | null;
  activeSet: ReadonlySet<NodeId>;
}) {
  const isHot =
    activeId !== null &&
    from.some((id) => activeSet.has(id)) &&
    to.some((id) => activeSet.has(id));
  const isMuted = activeId !== null && !isHot;
  const horizontal = orientation === "horizontal";

  return (
    <div
      className={cx(
        styles.connector,
        styles[kind],
        styles[orientation],
        pulse && styles.connectorPulse,
        isHot && styles.connectorHot,
        isMuted && styles.connectorMuted,
        className,
      )}
      aria-hidden="true"
    >
      {label ? <span className={styles.connectorLabel}>{label}</span> : null}
      <svg
        viewBox={horizontal ? "0 0 38 18" : "0 0 18 30"}
        preserveAspectRatio="none"
        focusable="false"
      >
        <path
          className={styles.connectorPath}
          d={horizontal ? "M2 9 H31" : "M9 2 V23"}
          vectorEffect="non-scaling-stroke"
        />
        <path
          className={styles.connectorArrow}
          d={horizontal ? "M27 4 L34 9 L27 14" : "M4 19 L9 26 L14 19"}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function ResponsiveConnector(props: Omit<Parameters<typeof FlowConnector>[0], "orientation">) {
  return (
    <>
      <FlowConnector {...props} orientation="horizontal" className={styles.wideConnector} />
      <FlowConnector {...props} orientation="vertical" className={styles.narrowConnector} />
    </>
  );
}

function ZoneHeader({ index, title, aside }: { index: string; title: string; aside?: string }) {
  return (
    <header className={styles.zoneHeader}>
      <div className={styles.zoneTitle}>
        <span>{index}</span>
        <h3>{title}</h3>
      </div>
      {aside ? <p>{aside}</p> : null}
    </header>
  );
}

function LegendItem({ kind, children }: { kind: FlowKind; children: string }) {
  return (
    <span className={styles.legendItem}>
      <span className={cx(styles.legendLine, styles[kind])} aria-hidden="true" />
      {children}
    </span>
  );
}

export function ArchitectureDiagram() {
  const [hoveredId, setHoveredId] = useState<NodeId | null>(null);
  const [focusedId, setFocusedId] = useState<NodeId | null>(null);
  const [pinnedId, setPinnedId] = useState<NodeId | null>(null);
  const [mobileView, setMobileView] = useState<MobileView>("runtime");
  const activeId = hoveredId ?? focusedId ?? pinnedId;

  const activeSet = useMemo(() => {
    if (!activeId) return new Set<NodeId>();
    const highlighted = new Set<NodeId>(SPECIAL_FLOWS[activeId] ?? [activeId]);
    if (!SPECIAL_FLOWS[activeId]) {
      for (const [from, to] of DEPENDENCIES) {
        if (from === activeId) highlighted.add(to);
        if (to === activeId) highlighted.add(from);
      }
    }
    return highlighted;
  }, [activeId]);

  const interaction: InteractionProps = {
    activeId,
    activeSet,
    pinnedId,
    setHoveredId,
    setFocusedId,
    togglePinnedId: (id) => setPinnedId((current) => (current === id ? null : id)),
  };

  const connectorState = { activeId, activeSet };
  const activeNode = activeId ? NODES[activeId] : null;

  const handleTabsKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + MOBILE_VIEWS.length) % MOBILE_VIEWS.length;
    setMobileView(MOBILE_VIEWS[nextIndex].id);
    const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button");
    buttons?.[nextIndex]?.focus();
  };

  return (
    <section
      className={styles.diagram}
      aria-labelledby="architecture-title"
      aria-describedby="architecture-description"
      onKeyDown={(event) => {
        if (event.key === "Escape") setPinnedId(null);
      }}
    >
      <p id="architecture-description" className="sr-only">
        A production event-driven learning platform. OAuth-protected clients pass through a CDN,
        backend-for-frontend layer, and YARP gateway into database-per-service workloads running on
        Kubernetes. Service transactions write an outbox that Debezium publishes to Kafka. Sagas,
        idempotent consumers, CQRS projections, retries, and dead-letter handling build cache, search,
        and read models. Argo CD reconciles Git-managed releases, while OpenTelemetry routes metrics,
        logs, and traces to Prometheus, Loki, Tempo, and Grafana.
      </p>

      <header className={styles.diagramHeader}>
        <div>
          <h2 id="architecture-title">Event-driven learning platform</h2>
          <p>Microservices · CQRS · CDC · Saga · GitOps</p>
        </div>
        <div className={styles.inspectPanel} role="status" aria-live="polite">
          <span className={styles.inspectKicker}>
            {pinnedId ? "Pinned dependency" : activeNode ? "Direct dependencies" : "Architecture inspector"}
          </span>
          <span>{activeNode ? `${activeNode.title} — ${activeNode.tooltip}` : "Hover, focus, or tap a component."}</span>
        </div>
      </header>

      <div className={styles.mobileTabs} role="tablist" aria-label="Architecture views">
        {MOBILE_VIEWS.map((view, index) => (
          <button
            key={view.id}
            type="button"
            role="tab"
            aria-selected={mobileView === view.id}
            aria-controls={`architecture-${view.id}`}
            tabIndex={mobileView === view.id ? 0 : -1}
            className={mobileView === view.id ? styles.mobileTabActive : undefined}
            onClick={() => setMobileView(view.id)}
            onKeyDown={(event) => handleTabsKeyDown(event, index)}
          >
            {view.label}
          </button>
        ))}
      </div>

      <section
        id="architecture-runtime"
        className={cx(styles.viewPanel, mobileView !== "runtime" && styles.viewPanelHidden)}
        aria-label="Runtime architecture"
      >
        <div className={styles.zone}>
          <ZoneHeader index="01" title="Edge & access" aside="OAuth 2.0 / OIDC · PKCE" />
          <div className={styles.edgeFlow}>
            <div className={styles.clientGroup}>
              <span className={styles.groupLabel}>Clients</span>
              <div className={styles.clientGrid}>
                {CLIENTS.map((id) => (
                  <ArchitectureNode key={id} id={id} variant="compact" {...interaction} />
                ))}
              </div>
            </div>
            <ResponsiveConnector
              kind="sync"
              from={CLIENTS}
              to={["edge"]}
              label="TLS"
              {...connectorState}
            />
            <ArchitectureNode id="edge" {...interaction} />
            <ResponsiveConnector kind="sync" from={["edge"]} to={["bff"]} {...connectorState} />
            <ArchitectureNode id="bff" {...interaction} />
            <ResponsiveConnector kind="sync" from={["bff"]} to={["gateway"]} {...connectorState} />
            <ArchitectureNode id="gateway" {...interaction} />
          </div>
        </div>

        <div className={cx(styles.zone, styles.clusterZone)}>
          <ZoneHeader
            index="02"
            title="Domain microservices"
            aside="REST / gRPC · JWT validation · request routing"
          />
          <div className={styles.cluster}>
            <div className={styles.clusterHeader}>
              <strong>Kubernetes · Service Mesh · Autoscaling</strong>
              <span>mTLS · zero-trust networking</span>
            </div>
            <div className={styles.syncTrunk} aria-hidden="true">
              <span>solid request path</span>
            </div>
            <div className={styles.serviceGrid}>
              {SERVICES.map((id) => (
                <ArchitectureNode key={id} id={id} variant="service" {...interaction} />
              ))}
            </div>
            <div className={styles.clusterFooter}>
              <span>Database per service</span>
              <span>Horizontal Pod Autoscaling</span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="architecture-events"
        className={cx(styles.viewPanel, mobileView !== "events" && styles.viewPanelHidden)}
        aria-label="Data and event flow"
      >
        <div className={cx(styles.zone, styles.eventZone)}>
          <ZoneHeader
            index="03"
            title="Data & event backbone"
            aside="at-least-once delivery · idempotent processing"
          />

          <div className={styles.eventPrimary}>
            <div className={styles.localTransaction}>
              <span className={styles.groupLabel}>One local transaction</span>
              <ArchitectureNode id="service-db" variant="compact" {...interaction} />
              <div className={styles.atomicCommit} aria-hidden="true">+ atomic commit</div>
              <ArchitectureNode id="outbox" variant="compact" {...interaction} />
            </div>
            <ResponsiveConnector
              kind="projection"
              from={["outbox"]}
              to={["debezium"]}
              label="CDC"
              {...connectorState}
            />
            <ArchitectureNode id="debezium" {...interaction} />
            <ResponsiveConnector
              kind="projection"
              from={["debezium"]}
              to={["kafka"]}
              label="WAL / binlog"
              pulse
              {...connectorState}
            />
            <div className={styles.kafkaGroup}>
              <ArchitectureNode id="kafka" {...interaction} />
              <ArchitectureNode id="schema" variant="compact" {...interaction} />
            </div>
          </div>

          <div
            className={cx(
              styles.fanoutWide,
              activeId !== null && activeSet.has("kafka") && activeSet.has("saga") && styles.connectorHot,
              activeId !== null && (!activeSet.has("kafka") || !activeSet.has("saga")) && styles.connectorMuted,
            )}
            aria-hidden="true"
          >
            <svg viewBox="0 0 700 28" preserveAspectRatio="none" focusable="false">
              <path
                d="M594 1 V9 H70 M70 9 V27 M210 9 V27 M350 9 V27 M490 9 V27 M630 9 V27"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <span>domain events · consumer groups</span>
          </div>
          <FlowConnector
            kind="event"
            from={["kafka"]}
            to={CONSUMERS}
            label="domain events · consumer groups"
            orientation="vertical"
            pulse
            className={styles.fanoutNarrow}
            {...connectorState}
          />

          <div className={styles.consumerGrid}>
            {CONSUMERS.map((id) => (
              <ArchitectureNode key={id} id={id} variant="compact" {...interaction} />
            ))}
          </div>

          <div className={styles.resilienceRail}>
            <span>At-least-once delivery</span>
            <span>Idempotent consumers</span>
            <span>Deduplication</span>
            <span className={styles.retryBadge}>Retry topics ↺ consumers → Dead Letter Queue</span>
          </div>

          <div className={styles.projectionBand} aria-hidden="true">
            <span>CQRS projection updates</span>
          </div>
          <div className={styles.readSide}>
            <span className={styles.groupLabel}>Query-optimized read side</span>
            <div className={styles.readGrid}>
              {READ_STORES.map((id) => (
                <ArchitectureNode key={id} id={id} variant="compact" {...interaction} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="architecture-platform"
        className={cx(styles.viewPanel, mobileView !== "platform" && styles.viewPanelHidden)}
        aria-label="Platform delivery and observability"
      >
        <div className={cx(styles.zone, styles.platformZone)}>
          <ZoneHeader index="04" title="Platform, delivery & observability" />

          <div className={styles.railLabel}>
            <span>GitOps delivery</span>
            <span>CI publishes · Argo CD pulls and reconciles</span>
          </div>
          <div className={styles.deliveryWide}>
            <ArchitectureNode id="actions" variant="rail" {...interaction} />
            <FlowConnector
              kind="deploy"
              from={["actions"]}
              to={["registry"]}
              label="publish image"
              {...connectorState}
            />
            <ArchitectureNode id="registry" variant="rail" {...interaction} />
            <FlowConnector
              kind="deploy"
              from={["actions"]}
              to={["gitops"]}
              label="update tag / PR"
              className={styles.deliveryUpdate}
              {...connectorState}
            />
            <ArchitectureNode id="gitops" variant="rail" {...interaction} />
            <FlowConnector kind="deploy" from={["gitops"]} to={["argo"]} label="pull" {...connectorState} />
            <ArchitectureNode id="argo" variant="rail" {...interaction} />
            <FlowConnector kind="deploy" from={["argo"]} to={["helm"]} {...connectorState} />
            <ArchitectureNode id="helm" variant="rail" {...interaction} />
            <FlowConnector kind="deploy" from={["helm"]} to={["k8s"]} {...connectorState} />
            <ArchitectureNode id="k8s" variant="rail" {...interaction} />
          </div>

          <div className={styles.deliveryNarrow}>
            <ArchitectureNode id="actions" variant="rail" {...interaction} />
            <div className={styles.mobileBranch}>
              <span>publishes immutable image</span>
              <FlowConnector kind="deploy" from={["actions"]} to={["registry"]} orientation="vertical" {...connectorState} />
              <ArchitectureNode id="registry" variant="rail" {...interaction} />
            </div>
            <div className={styles.mobileBranch}>
              <span>updates manifest tag / creates PR</span>
              <FlowConnector kind="deploy" from={["actions"]} to={["gitops"]} orientation="vertical" {...connectorState} />
              <ArchitectureNode id="gitops" variant="rail" {...interaction} />
              <FlowConnector kind="deploy" from={["gitops"]} to={["argo"]} orientation="vertical" {...connectorState} />
              <ArchitectureNode id="argo" variant="rail" {...interaction} />
              <FlowConnector kind="deploy" from={["argo"]} to={["helm"]} orientation="vertical" {...connectorState} />
              <ArchitectureNode id="helm" variant="rail" {...interaction} />
              <FlowConnector kind="deploy" from={["helm"]} to={["k8s"]} orientation="vertical" {...connectorState} />
              <ArchitectureNode id="k8s" variant="rail" {...interaction} />
            </div>
          </div>

          <div className={styles.releaseBadges}>
            <span>GitOps reconciliation</span>
            <span>Rolling deployment</span>
            <span>Canary release</span>
            <span>Horizontal Pod Autoscaling</span>
            <span>Zero-downtime delivery</span>
          </div>

          <div className={styles.railLabel}>
            <span>Telemetry pipeline</span>
            <span>correlation ID · metrics · logs · distributed traces</span>
          </div>
          <div className={styles.observabilityRail}>
            <div className={styles.servicesSource}>
              <strong>Services</strong>
              <span>instrumented SDKs</span>
            </div>
            <ResponsiveConnector kind="sync" from={SERVICES} to={["otel"]} {...connectorState} />
            <ArchitectureNode id="otel" variant="rail" {...interaction} />
            <ResponsiveConnector
              kind="event"
              from={["otel"]}
              to={TELEMETRY_BACKENDS}
              label="export"
              {...connectorState}
            />
            <div className={styles.telemetryBackends}>
              {TELEMETRY_BACKENDS.map((id) => (
                <ArchitectureNode key={id} id={id} variant="rail" {...interaction} />
              ))}
            </div>
            <ResponsiveConnector kind="sync" from={TELEMETRY_BACKENDS} to={["grafana"]} label="query" {...connectorState} />
            <ArchitectureNode id="grafana" variant="rail" {...interaction} />
          </div>
        </div>
      </section>

      <footer className={styles.diagramFooter}>
        <div className={styles.legend} aria-label="Connection legend">
          <LegendItem kind="sync">solid · REST / gRPC</LegendItem>
          <LegendItem kind="event">dashed · domain event</LegendItem>
          <LegendItem kind="projection">dotted · CDC / projection</LegendItem>
          <LegendItem kind="retry">dash-dot · retry / DLQ</LegendItem>
          <LegendItem kind="deploy">green solid · deployment</LegendItem>
        </div>
        <div className={styles.statusBadges}>
          <span>Database per service</span>
          <span>At-least-once</span>
          <span>Idempotent</span>
          <span>Horizontally scalable</span>
          <span>GitOps managed</span>
        </div>
      </footer>
    </section>
  );
}
