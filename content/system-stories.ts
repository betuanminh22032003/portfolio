import { resume } from "./resume";

export type SystemNode = {
  id: string;
  label: string;
  kind: "client" | "identity" | "service" | "queue" | "data";
  detail: string;
};

export type SystemStep = {
  from: string;
  to: string;
  title: string;
  description: string;
  packet: string;
};

export type SystemStory = {
  id: string;
  label: string;
  title: string;
  color: string;
  projectIndex: number;
  responsibility: string;
  nodes: readonly SystemNode[];
  steps: readonly SystemStep[];
};

/**
 * Conceptual walkthroughs of public portfolio capabilities, not exact employer
 * deployment topologies. Career claims below are read directly from resume.ts.
 * Node order is shared by the SSR diagram and the progressively loaded 3D scene.
 */
export const systemStories: readonly SystemStory[] = [
  {
    id: "identity",
    label: "SSO",
    title: "One identity. Across products.",
    color: "#54e4f7",
    projectIndex: 0,
    responsibility: resume.projects[0].bullets[0],
    nodes: [
      { id: "browser", label: "Browser", kind: "client", detail: "Starts sign-in" },
      { id: "identity", label: "Identity provider", kind: "identity", detail: "Authenticates the user" },
      { id: "callback", label: "App callback", kind: "service", detail: "Completes the code flow" },
      { id: "api", label: ".NET API", kind: "service", detail: "Checks access" },
    ],
    steps: [
      { from: "browser", to: "identity", title: "Start a shared sign-in", description: "The application redirects the browser to the identity provider with a PKCE challenge.", packet: "Authorize + challenge" },
      { from: "identity", to: "callback", title: "Return an authorization code", description: "After sign-in, the provider redirects the browser back to the application's callback with a code.", packet: "Authorization code" },
      { from: "callback", to: "identity", title: "Exchange the code with PKCE", description: "The application presents the code and its matching verifier to obtain tokens from the identity provider.", packet: "Code + verifier" },
      { from: "callback", to: "api", title: "Authorize the API request", description: "The application sends an access token. The API validates it and applies its authorization policy.", packet: "Access token" },
    ],
  },
  {
    id: "ranking",
    label: "Ranking",
    title: "From scores to a stable leaderboard.",
    color: "#c7f36b",
    projectIndex: 0,
    responsibility: resume.projects[0].bullets[2],
    nodes: [
      { id: "scores", label: "Scores", kind: "data", detail: "Competition results" },
      { id: "aggregation", label: "Aggregation", kind: "service", detail: "Combines result data" },
      { id: "ordering", label: "Ordering", kind: "service", detail: "Deterministic rules" },
      { id: "leaderboard", label: "Leaderboard", kind: "client", detail: "Delivers ranked results" },
    ],
    steps: [
      { from: "scores", to: "aggregation", title: "Aggregate the score data", description: "Competition results become the inputs for ranking. Aggregation brings the relevant score data together.", packet: "Score records" },
      { from: "aggregation", to: "ordering", title: "Apply deterministic ordering", description: "Explicit ranking rules give the same input a stable order, including when scores are tied.", packet: "Aggregated scores" },
      { from: "ordering", to: "leaderboard", title: "Deliver the ranked results", description: "The leaderboard presents the ordered results to users. This is the delivery side of the IOE and IOM ranking work.", packet: "Ordered results" },
    ],
  },
  {
    id: "events",
    label: "Events",
    title: "Independent services. Connected work.",
    color: "#ae94ff",
    projectIndex: 1,
    responsibility: resume.projects[1].bullets[0],
    nodes: [
      { id: "producer", label: ".NET service", kind: "service", detail: "Produces a domain event" },
      { id: "broker", label: "RabbitMQ", kind: "queue", detail: "Routes messages" },
      { id: "consumer", label: "Consumer", kind: "service", detail: "Processes asynchronously" },
      { id: "read-model", label: "Read model", kind: "data", detail: "Supports queries" },
    ],
    steps: [
      { from: "producer", to: "broker", title: "Publish the domain event", description: "A service publishes an event through RabbitMQ so downstream work can happen asynchronously.", packet: "Domain event" },
      { from: "broker", to: "consumer", title: "Process outside the request path", description: "A consumer receives the message and performs its own work, decoupled from the original request.", packet: "Message delivery" },
      { from: "consumer", to: "read-model", title: "Update the query side", description: "A CQRS read model catches up as events are processed. Reads can briefly lag behind writes: eventual consistency.", packet: "Projection update" },
    ],
  },
];
