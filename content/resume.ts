/**
 * Single source of truth for the portfolio.
 * Keep this file aligned with /public/BeTuanMinh_Resume.pdf.
 */

export type Accent = "cyan" | "pink" | "lime" | "orange" | "violet";

export type Metric = {
  value: string;
  label: string;
  note?: string;
  accent: Accent;
};

export type FocusArea = {
  title: string;
  blurb: string;
  icon: "scale" | "identity" | "ai" | "reliability" | "migration";
  tags: string[];
  accent: Accent;
};

export type Project = {
  name: string;
  owner: string;
  kind: string;
  summary: string;
  bullets: string[];
  metrics: Metric[];
  stack: string[];
  accent: Accent;
  link: string | null;
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  products: string[];
  bullets: string[];
  accent: Accent;
};

export type SkillGroup = {
  label: string;
  items: string[];
  accent: Accent;
};

export type Award = {
  title: string;
  detail: string;
};

export const resume = {
  name: "Be Tuan Minh",
  role: "Senior Backend Engineer",
  discipline: "Distributed platforms, identity & AI-assisted learning",
  intro:
    "I build and modernize .NET platforms that stay reliable at national scale - from identity and ranking to AI-assisted learning.",
  summary:
    "Backend Engineer with 5+ years of experience delivering .NET services for large-scale education and assessment platforms. I own backend work from system design and data modeling through implementation, migration, production rollout, and troubleshooting.",
  location: "Hanoi, Vietnam",
  email: "betuanminh22032003@gmail.com",
  phone: "0975-420-673",
  phoneHref: "+84975420673",
  // Relative URL works both at a custom domain and under /repository-name/ on GitHub Pages.
  cvFile: "BeTuanMinh_Resume.pdf",
  current: "Backend Engineer at VTC Online",

  links: {
    github: "",
    linkedin: "",
  },

  metrics: [
    {
      value: "35M+",
      label: "registered accounts",
      note: "IOE education platform",
      accent: "cyan",
    },
    {
      value: "200K",
      label: "peak concurrent users",
      note: "national-scale production load",
      accent: "pink",
    },
    {
      value: "3,000+",
      label: "concurrent students",
      note: "real-time WebRTC proctoring",
      accent: "lime",
    },
    {
      value: "600 -> 280ms",
      label: "critical API latency",
      note: "SQL tuning + Redis caching",
      accent: "orange",
    },
  ] satisfies Metric[],

  highlights: [
    "Centralized SSO across a multi-product ecosystem with OAuth 2.0/OIDC, PKCE, and secure token lifecycles.",
    "Delivered AI-assisted scoring and skill-level mastery workflows for IELTS learning products.",
    "Built deterministic ranking and high-volume leaderboard delivery for national education platforms.",
    "Modernizing legacy ASP.NET MVC into React + .NET while preserving business rules and production continuity.",
  ],

  focusAreas: [
    {
      title: "National-scale platforms",
      blurb:
        "Backend capabilities across IOE, IOK, IOSTEM, and IOM, including production traffic up to 200K concurrent users.",
      icon: "scale",
      tags: ["35M+ accounts", "ranking", "high-volume delivery"],
      accent: "cyan",
    },
    {
      title: "Identity & security",
      blurb:
        "Centralized sign-on and cross-application session flows with standards-based identity and explicit token controls.",
      icon: "identity",
      tags: ["OAuth 2.0", "OIDC", "PKCE", "JWT", "RBAC"],
      accent: "violet",
    },
    {
      title: "AI-assisted learning",
      blurb:
        "IELTS Mastery and AI Writing workflows with skill-level progress, assisted scoring, and actionable feedback.",
      icon: "ai",
      tags: ["mastery tracking", "AI scoring", "feedback"],
      accent: "pink",
    },
    {
      title: "Distributed reliability",
      blurb:
        "Event-driven services that combine CQRS, messaging, caching, and data patterns to remain predictable under load.",
      icon: "reliability",
      tags: ["RabbitMQ", "Outbox", "Saga", "Redis"],
      accent: "lime",
    },
    {
      title: "Modernization & delivery",
      blurb:
        "Legacy migration, containerized delivery, SQL tuning, observability, and release controls without production disruption.",
      icon: "migration",
      tags: ["React + .NET", "Kubernetes", "Terraform", "Grafana"],
      accent: "orange",
    },
  ] satisfies FocusArea[],

  experience: [
    {
      company: "VTC Online",
      role: "Backend Engineer",
      period: "Mar 2026 - Present",
      location: "Hanoi, Vietnam",
      summary:
        "Building national-scale education platforms, shared identity, AI-assisted learning workflows, and reliability improvements across the VTC Online product ecosystem.",
      products: ["IOE", "IOK", "IOSTEM", "IOM", "IELTS Mastery", "IOE Speak Out 2026"],
      bullets: [
        "Deliver backend capabilities across IOE, IOK, IOSTEM, and IOM; IOE serves 35M+ registered accounts and reaches peak production loads of up to 200K concurrent users.",
        "Implemented centralized SSO using OAuth 2.0/OIDC, PKCE, secure token lifecycles, and cross-application session flows.",
        "Delivered IELTS Mastery and AI Writing workflows with skill-level mastery tracking, AI-assisted scoring, and actionable writing feedback.",
        "Built ranking capabilities for IOE and IOM with score aggregation, deterministic ordering, and high-volume leaderboard delivery.",
        "Modernizing IOE v3 from legacy ASP.NET MVC to React + .NET while preserving business rules and production continuity.",
        "Strengthened reliability through Redis caching, asynchronous processing, SQL tuning, observability, and release controls.",
      ],
      accent: "cyan",
    },
    {
      company: "AvePoint Vietnam",
      role: "Software Engineer",
      period: "Jan 2023 - Mar 2026",
      location: "Hanoi, Vietnam",
      summary:
        "Built and operated .NET microservices for technical education and online assessment, spanning data architecture, event-driven workflows, WebRTC proctoring, Kubernetes, and production observability.",
      products: ["IAS 2.0", "Examena"],
      bullets: [
        "Implemented CQRS and event-driven workflows with RabbitMQ, PostgreSQL read/write replication, and MongoDB sharding.",
        "Reduced inter-service latency by 35% using Redis caching, asynchronous messaging, and integration-flow optimization.",
        "Built real-time WebRTC proctoring with MediaSoup for 3,000+ concurrent students.",
        "Reduced critical API latency from 600 ms to 280 ms through SQL query/index tuning and Redis caching.",
        "Delivered services with Docker, Kubernetes, Helm, Terraform, GitLab CI/CD, and Argo CD, monitored by Grafana and Prometheus.",
      ],
      accent: "violet",
    },
  ] satisfies Experience[],

  projects: [
    {
      name: "IOE Ecosystem & Identity",
      owner: "VTC Online",
      kind: "National-scale education platforms",
      summary:
        "A connected education ecosystem spanning learning, competitions, ranking, shared identity, and AI-assisted feedback for tens of millions of registered accounts.",
      bullets: [
        "Centralized SSO across products with OAuth 2.0/OIDC, PKCE, secure token lifecycles, and cross-application sessions.",
        "Delivered mastery tracking and AI-assisted writing feedback for IELTS learning workflows.",
        "Built score aggregation, deterministic ordering, and high-volume leaderboard delivery for IOE and IOM.",
        "Migrating IOE v3 from legacy ASP.NET MVC to React + .NET with production continuity.",
      ],
      metrics: [
        { value: "35M+", label: "registered accounts", accent: "cyan" },
        { value: "200K", label: "peak concurrency", accent: "pink" },
      ],
      stack: [
        "C#",
        ".NET",
        "ASP.NET Core",
        "React",
        "SQL",
        "Redis",
        "OAuth 2.0",
        "OIDC",
        "PKCE",
        "Observability",
      ],
      accent: "cyan",
      link: null,
    },
    {
      name: "IAS 2.0",
      owner: "AvePoint Vietnam",
      kind: "Technical education platform",
      summary:
        "A distributed education platform built with .NET microservices, event-driven coordination, replicated relational data, and sharded read workloads.",
      bullets: [
        "Implemented CQRS and RabbitMQ workflows for eventual consistency across services.",
        "Built services on PostgreSQL read/write replication and MongoDB sharding.",
        "Optimized Redis caching, asynchronous messaging, and integration flows.",
        "Operated Kubernetes workloads with Grafana and Prometheus for production diagnosis.",
      ],
      metrics: [
        { value: "35%", label: "lower service latency", accent: "violet" },
      ],
      stack: [
        ".NET",
        "CQRS",
        "RabbitMQ",
        "PostgreSQL",
        "MongoDB",
        "Redis",
        "Kubernetes",
        "Grafana",
        "Prometheus",
      ],
      accent: "violet",
      link: null,
    },
    {
      name: "Examena",
      owner: "AvePoint Vietnam",
      kind: "Online assessment & real-time proctoring",
      summary:
        "A high-throughput online assessment platform with real-time WebRTC proctoring, asynchronous cheating signals, and audit-heavy exam workflows.",
      bullets: [
        "Built .NET assessment services and WebRTC proctoring with MediaSoup.",
        "Designed asynchronous cheating-detection signals and high-throughput audit logging.",
        "Tuned SQL queries and indexes, then added Redis caching to cut critical API latency.",
        "Delivered containerized services through GitLab CI/CD and GitOps with Argo CD.",
      ],
      metrics: [
        { value: "3,000+", label: "concurrent students", accent: "lime" },
        { value: "600 -> 280ms", label: "critical API latency", accent: "orange" },
      ],
      stack: [
        ".NET",
        "WebRTC",
        "MediaSoup",
        "SQL",
        "Redis",
        "Docker",
        "Kubernetes",
        "Helm",
        "Terraform",
        "GitLab CI/CD",
        "Argo CD",
      ],
      accent: "lime",
      link: null,
    },
  ] satisfies Project[],

  skills: [
    {
      label: "Backend",
      items: ["C#", ".NET", "ASP.NET Core", "REST APIs", "Dapper", "EF Core", "SQL"],
      accent: "cyan",
    },
    {
      label: "Data",
      items: ["SQL Server", "PostgreSQL", "MongoDB", "Redis", "query/index tuning", "replication", "sharding"],
      accent: "pink",
    },
    {
      label: "Architecture",
      items: ["Microservices", "DDD", "CQRS", "Event-driven systems", "Clean Architecture", "BFF", "API Gateway"],
      accent: "violet",
    },
    {
      label: "Messaging & reliability",
      items: ["RabbitMQ", "MassTransit", "Outbox", "Saga", "distributed locking", "caching"],
      accent: "lime",
    },
    {
      label: "Identity & security",
      items: ["SSO", "OAuth 2.0", "OpenID Connect", "PKCE", "JWT", "RBAC"],
      accent: "orange",
    },
    {
      label: "Cloud & delivery",
      items: ["Docker", "Kubernetes", "Helm", "Terraform", "AWS", "GCP", "GitLab CI/CD", "GitHub Actions", "Argo CD"],
      accent: "cyan",
    },
    {
      label: "Observability & quality",
      items: ["Grafana", "Prometheus", "Elasticsearch", "Loki", "Sentry", "xUnit", "NUnit", "Jest"],
      accent: "pink",
    },
    {
      label: "Frontend collaboration",
      items: ["React", "TypeScript", "JavaScript", "Next.js"],
      accent: "violet",
    },
  ] satisfies SkillGroup[],

  coreStack: [
    { name: ".NET", slug: "dotnet" },
    { name: "PostgreSQL", slug: "postgresql" },
    { name: "MongoDB", slug: "mongodb" },
    { name: "Redis", slug: "redis" },
    { name: "RabbitMQ", slug: "rabbitmq" },
    { name: "Docker", slug: "docker" },
    { name: "Kubernetes", slug: "kubernetes" },
    { name: "Terraform", slug: "terraform" },
    { name: "Argo CD", slug: "argo" },
    { name: "Grafana", slug: "grafana" },
    { name: "Prometheus", slug: "prometheus" },
    { name: "React", slug: "react" },
    { name: "TypeScript", slug: "typescript" },
    { name: "Next.js", slug: "nextdotjs" },
  ],

  education: {
    school: "FPT University",
    degree: "B.Sc. in Software Engineering",
    detail: "GPA 3.3 / 4.0 - 30% Scholarship",
  },

  awards: [
    { title: "Academic Excellence", detail: "Fall 2022" },
    { title: "Honors", detail: "Spring 2023, Fall 2024" },
  ] satisfies Award[],
} as const;

export type Resume = typeof resume;
