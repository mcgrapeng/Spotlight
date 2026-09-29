import { http } from './client'
import type {
  AIAnalysisResult, AIProvider, AIProviderInput, ClusterInfo, DashboardStats,
  EventInfo, Favorite, LogLine, NamespaceInfo, NodeInfo, PodInfo, PodListResponse,
} from '@/domain/types'

const ctx = (c?: string | null) => ({ params: { context: c || undefined } })

export interface AuthStatus {
  configured: boolean; available: boolean;
  proxy: string; user: string; cluster: string;
  session_valid: boolean;
}

export interface LoginResult {
  ok: boolean;
  proxy: string;
  user: string;
  cluster: string;
  kube_clusters: string[];
  message: string;
}

export interface KubeLoginResult {
  ok: boolean;
  cluster: string;
  message: string;
}

export const authApi = {
  status: () => http.get<AuthStatus>('/auth/status').then((r) => r.data),
  // Login can take a while when the cluster enforces MFA (we feed password +
  // OTP + wait for tsh to negotiate certs) — override the 30s default with
  // 60s so the user gets a real error rather than an axios timeout.
  login: (password: string, otp = '') =>
    http.post<LoginResult>(
      '/auth/login', { password, otp }, { timeout: 60_000 },
    ).then((r) => r.data),
  kubeLogin: (cluster: string) =>
    http.post<KubeLoginResult>('/auth/kube-login', { cluster }, { timeout: 60_000 })
      .then((r) => r.data),
  kubeClusters: () =>
    http.get<string[]>('/auth/kube-clusters', { timeout: 15_000 }).then((r) => r.data),
  permissions: () =>
    http.get<Record<string, boolean>>('/auth/permissions', { timeout: 15_000 })
      .then((r) => r.data),
}

export const clustersApi = {
  list: () => http.get<ClusterInfo[]>('/clusters').then((r) => r.data),
}

export const namespacesApi = {
  list: (cluster?: string | null) =>
    http.get<NamespaceInfo[]>('/namespaces', { params: { context: cluster || undefined } }).then((r) => r.data),
}

export const podsApi = {
  list: (params: {
    cluster?: string | null; namespace?: string | null;
    status?: string; search?: string; labelSelector?: string;
    signal?: AbortSignal;
  }) =>
    http.get<PodListResponse>('/pods', {
      params: {
        context: params.cluster || undefined,
        namespace: params.namespace || undefined,
        status: params.status, search: params.search,
        label_selector: params.labelSelector,
      },
      signal: params.signal,
    }).then((r) => r.data),
  get: (cluster: string | null, namespace: string, name: string) =>
    http.get<PodInfo>(`/pods/${encodeURIComponent(namespace)}/${encodeURIComponent(name)}`, ctx(cluster)).then((r) => r.data),
  stats: (cluster?: string | null) =>
    http.get<DashboardStats>('/pods/stats', { params: { context: cluster || undefined } }).then((r) => r.data),
  historyLogs: (
    cluster: string | null, namespace: string, name: string,
    container?: string | null, tail = 500, since?: string,
  ) =>
    http.get<{ total: number; items: LogLine[] }>(
      `/pods/${encodeURIComponent(namespace)}/${encodeURIComponent(name)}/logs`,
      { params: {
          context: cluster || undefined,
          container: container || undefined,
          tail_lines: tail,
          since: since || undefined,
      } },
    ).then((r) => r.data),
}

export const logsApi = {
  streamUrl: (
    cluster: string | null | undefined, namespace: string, name: string,
    container?: string | null, tail = 200,
  ) => {
    const qs = new URLSearchParams()
    if (cluster) qs.set('context', cluster)
    if (container) qs.set('container', container)
    qs.set('tail_lines', String(tail))
    return `/api/v1/pods/${encodeURIComponent(namespace)}/${encodeURIComponent(name)}/logs/stream?${qs.toString()}`
  },
}

export const eventsApi = {
  list: (params: { cluster?: string | null; namespace?: string | null; involved?: string; limit?: number }) =>
    http.get<EventInfo[]>('/events', {
      params: {
        context: params.cluster || undefined,
        namespace: params.namespace || undefined,
        involved_name: params.involved || undefined,
        limit: params.limit || 200,
      },
    }).then((r) => r.data),
}

export const nodesApi = {
  list: (cluster?: string | null) =>
    http.get<NodeInfo[]>('/nodes', { params: { context: cluster || undefined } }).then((r) => r.data),
}

export const favoritesApi = {
  list: () => http.get<Favorite[]>('/favorites').then((r) => r.data),
  add: (payload: Omit<Favorite, 'id' | 'created_at'>) =>
    http.post<Favorite>('/favorites', payload).then((r) => r.data),
  remove: (id: number) => http.delete(`/favorites/${id}`),
}

export const aiApi = {
  listProviders: () => http.get<AIProvider[]>('/ai/providers').then((r) => r.data),
  addProvider: (p: AIProviderInput) => http.post<AIProvider>('/ai/providers', p).then((r) => r.data),
  updateProvider: (id: number, p: AIProviderInput) =>
    http.put<AIProvider>(`/ai/providers/${id}`, p).then((r) => r.data),
  deleteProvider: (id: number) => http.delete(`/ai/providers/${id}`),
  setDefault: (id: number) =>
    http.post<AIProvider>(`/ai/providers/${id}/default`).then((r) => r.data),
  analyze: (cluster: string | null, namespace: string, name: string,
             providerId: number, logLines: string[], question: string) =>
    http.post<AIAnalysisResult>(
      `/ai/analyze/${encodeURIComponent(namespace)}/${encodeURIComponent(name)}`,
      { provider_id: providerId, question, log_lines: logLines },
      { params: { cluster: cluster || undefined } },
    ).then((r) => r.data),
}
