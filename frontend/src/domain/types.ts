export interface ClusterInfo {
  name: string; cluster: string; user: string; namespace: string; is_current: boolean;
}

export type PodPhase = 'Running' | 'Pending' | 'Succeeded' | 'Failed' | 'Unknown'

export interface ContainerInfo {
  name: string; image: string; ready: boolean; restart_count: number;
  state: 'running' | 'waiting' | 'terminated' | 'unknown';
  reason: string | null; message: string | null; started_at: string | null;
}

export interface PodInfo {
  name: string; namespace: string; node: string | null; pod_ip: string | null;
  phase: PodPhase | string; reason: string | null; message: string | null;
  restart_count: number; age: string | null; created_at: string | null;
  labels: Record<string, string>;
  containers: ContainerInfo[];
  owner_kind: string | null; owner_name: string | null;
}

export interface PodListResponse { total: number; items: PodInfo[] }

export type LogSeverity =
  | 'trace' | 'debug' | 'info' | 'notice' | 'warn' | 'error' | 'critical' | 'fatal' | 'unknown';

export interface LogLine {
  timestamp: string; content: string; container: string; severity: LogSeverity;
}

export interface EventInfo {
  name: string; namespace: string; type: 'Normal' | 'Warning' | string;
  reason: string; message: string;
  involved_kind: string; involved_name: string;
  count: number; first_seen: string | null; last_seen: string | null;
}

export interface NodeInfo {
  name: string; status: string; roles: string[]; version: string; os_image: string;
  kubelet_version: string;
  cpu_capacity: string; memory_capacity: string;
  cpu_allocatable: string; memory_allocatable: string;
  pod_count: number; age: string | null;
}

export interface DashboardStats {
  total_pods: number; running: number; pending: number; failed: number; succeeded: number;
  warning_events: number; nodes_total: number; nodes_ready: number;
  namespaces_count: number;
  restart_top: { pod: string; restarts: number }[];
  // Inlined from /events by the backend so DashboardView can render the
  // recent-activity list without a second K8s round-trip.
  recent_warns: EventInfo[];
}

export interface NamespaceInfo {
  name: string; status: string; labels: Record<string, string>; age: string | null;
}

export interface Favorite {
  id: number; resource_type: 'pod' | 'node' | 'namespace';
  name: string; namespace: string; cluster: string; note: string; created_at: string;
}

export interface AIProvider {
  id: number; name: string; provider: string; model: string;
  api_base: string | null; temperature: number; max_tokens: number;
  is_default: boolean; enabled: boolean;
  extra: Record<string, string>;
  api_key_masked: string;
}

export interface AIProviderInput {
  name: string; provider: string; model: string;
  api_key?: string; api_base?: string | null;
  temperature?: number; max_tokens?: number;
  is_default?: boolean; enabled?: boolean;
  extra?: Record<string, string>;
}

export interface AIAnalysisResult {
  answer: string; model: string; latency_ms: number;
  input_tokens: number | null; output_tokens: number | null;
}
