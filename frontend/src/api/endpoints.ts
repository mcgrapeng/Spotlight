import { http } from './client'
import type {
  AIAnalyzeOut, AIProviderOut, AIProviderIn, ClusterOut, DashboardOut,
  EventOut, FavoriteOut, LogHistoryOut, LogLineOut,
  NamespaceOut, NodeOut, PodOut, PodListOut,
} from '@/api/types'

const ctx = (c?: string | null) => ({ params: { context: c || undefined } })

// Auth shapes live inline (not in types.gen.ts) because the OpenAPI types
// haven't been regenerated against the T7 plugin-backed endpoints yet.
export interface ProviderField {
  name: string
  label: string
  type: string      // "text" | "password" | "otp"
  required: boolean
}
export interface ProviderInfo {
  id: string
  label: string
  fields: ProviderField[]
}
export interface AuthSessionInfo {
  username: string
}
export interface AuthStatus {
  configured: boolean
  provider: ProviderInfo | null
  auth_required: boolean
  client_session: boolean
  session: AuthSessionInfo | null
}
export interface LoginResult {
  ok: boolean
  kube_clusters: string[]
  message: string
  /** Non-null when enumeration FAILED (not "there are none"). An empty
   * `kube_clusters` together with this set means the UI must NOT continue on
   * the host kubeconfig — that would show the server's cluster, not the
   * user's. */
  clusters_error: string | null
}
export interface ChooseClusterResult {
  ok: boolean
  cluster: string
  context: string
}

export const authApi = {
  status: () => http.get<AuthStatus>('/auth/status').then((r) => r.data),
  // Login can take a while when the cluster enforces MFA — `tsh` negotiates
  // certs, etc. — so override the 30s default with 60s so the user gets a
  // real error rather than an axios timeout.
  login: (username: string, fields: Record<string, string>) =>
    http.post<LoginResult>(
      '/auth/login', { username, fields }, { timeout: 60_000 },
    ).then((r) => r.data),
  chooseCluster: (cluster: string) =>
    http.post<ChooseClusterResult>(
      '/auth/cluster', { cluster }, { timeout: 60_000 },
    ).then((r) => r.data),
  kubeClusters: () =>
    http.get<string[]>('/auth/kube-clusters', { timeout: 15_000 }).then((r) => r.data),
  logout: () => http.post('/auth/logout').then((r) => r.data as { ok: boolean }),
}

export const clustersApi = {
  list: () => http.get<ClusterOut[]>('/clusters').then((r) => r.data),
}

export const namespacesApi = {
  list: (cluster?: string | null) =>
    http.get<NamespaceOut[]>('/namespaces', { params: { context: cluster || undefined } }).then((r) => r.data),
}

export const podsApi = {
  list: (params: {
    cluster?: string | null; namespace?: string | null;
    status?: string; search?: string; labelSelector?: string;
    signal?: AbortSignal;
  }) =>
    http.get<PodListOut>('/pods', {
      params: {
        context: params.cluster || undefined,
        namespace: params.namespace || undefined,
        status: params.status, search: params.search,
        label_selector: params.labelSelector,
      },
      signal: params.signal,
    }).then((r) => r.data),
  get: (cluster: string | null, namespace: string, name: string) =>
    http.get<PodOut>(`/pods/${encodeURIComponent(namespace)}/${encodeURIComponent(name)}`, ctx(cluster)).then((r) => r.data),
  stats: (cluster?: string | null) =>
    http.get<DashboardOut>('/pods/stats', { params: { context: cluster || undefined } }).then((r) => r.data),
  historyLogs: (
    cluster: string | null, namespace: string, name: string,
    container?: string | null, tail = 500, since?: string,
  ) =>
    http.get<LogHistoryOut>(
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
    http.get<EventOut[]>('/events', {
      params: {
        context: params.cluster || undefined,
        namespace: params.namespace || undefined,
        // Wire name is `involved`. `involved_name` is the RESPONSE field, and
        // sending it meant FastAPI dropped it — the filter did nothing.
        involved: params.involved || undefined,
        limit: params.limit || 200,
      },
    }).then((r) => r.data),
}

export const nodesApi = {
  list: (cluster?: string | null) =>
    http.get<NodeOut[]>('/nodes', { params: { context: cluster || undefined } }).then((r) => r.data),
}

export const favoritesApi = {
  list: () => http.get<FavoriteOut[]>('/favorites').then((r) => r.data),
  add: (payload: Omit<FavoriteOut, 'id' | 'created_at'>) =>
    http.post<FavoriteOut>('/favorites', payload).then((r) => r.data),
  remove: (id: number) => http.delete(`/favorites/${id}`),
}

export const aiApi = {
  listProviders: () => http.get<AIProviderOut[]>('/ai/providers').then((r) => r.data),
  addProvider: (p: AIProviderIn) => http.post<AIProviderOut>('/ai/providers', p).then((r) => r.data),
  updateProvider: (id: number, p: AIProviderIn) =>
    http.put<AIProviderOut>(`/ai/providers/${id}`, p).then((r) => r.data),
  deleteProvider: (id: number) => http.delete(`/ai/providers/${id}`),
  setDefault: (id: number) =>
    http.post<AIProviderOut>(`/ai/providers/${id}/default`).then((r) => r.data),
  analyze: (cluster: string | null, namespace: string, name: string,
             providerId: number, logLines: string[], question: string) =>
    http.post<AIAnalyzeOut>(
      `/ai/analyze/${encodeURIComponent(namespace)}/${encodeURIComponent(name)}`,
      { provider_id: providerId, question, log_lines: logLines },
      { params: { context: cluster || undefined } },
    ).then((r) => r.data),
}
