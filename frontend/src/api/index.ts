import { http } from './client'
import type {
  ClusterInfo,
  DashboardStats,
  EventInfo,
  Favorite,
  LogLine,
  NamespaceInfo,
  NodeInfo,
  PodInfo,
  PodListResponse,
} from '@/types'

const ctx = (c?: string | null) => ({ params: { context: c || undefined } })

export const clustersApi = {
  list: () => http.get<ClusterInfo[]>('/clusters').then((r) => r.data),
}

export const namespacesApi = {
  list: (cluster?: string | null) =>
    http
      .get<NamespaceInfo[]>('/namespaces', { params: { context: cluster || undefined } })
      .then((r) => r.data),
}

export const podsApi = {
  list: (params: {
    cluster?: string | null
    namespace?: string | null
    status?: string
    search?: string
    labelSelector?: string
  }) =>
    http
      .get<PodListResponse>('/pods', {
        params: {
          context: params.cluster || undefined,
          namespace: params.namespace || undefined,
          status: params.status,
          search: params.search,
          label_selector: params.labelSelector,
        },
      })
      .then((r) => r.data),
  get: (cluster: string | null, namespace: string, name: string) =>
    http
      .get<PodInfo>(`/pods/${encodeURIComponent(namespace)}/${encodeURIComponent(name)}`, ctx(cluster))
      .then((r) => r.data),
  stats: (cluster?: string | null) =>
    http
      .get<DashboardStats>('/pods/stats', { params: { context: cluster || undefined } })
      .then((r) => r.data),
  historyLogs: (
    cluster: string | null,
    namespace: string,
    name: string,
    container?: string,
    tail = 500,
  ) =>
    http
      .get<{ total: number; items: LogLine[] }>(
        `/pods/${encodeURIComponent(namespace)}/${encodeURIComponent(name)}/logs`,
        { params: { context: cluster || undefined, container, tail_lines: tail } },
      )
      .then((r) => r.data),
}

export const logsApi = {
  /** 构造 SSE URL（EventSource 不可拦截 axios，由组件直接 new EventSource） */
  streamUrl(
    cluster: string | null,
    namespace: string,
    name: string,
    container?: string,
    tail = 200,
  ) {
    const qs = new URLSearchParams()
    if (cluster) qs.set('context', cluster)
    if (container) qs.set('container', container)
    qs.set('tail_lines', String(tail))
    return `/api/v1/pods/${encodeURIComponent(namespace)}/${encodeURIComponent(name)}/logs/stream?${qs.toString()}`
  },
}

export const eventsApi = {
  list: (params: { cluster?: string | null; namespace?: string | null; involved?: string; limit?: number }) =>
    http
      .get<EventInfo[]>('/events', {
        params: {
          context: params.cluster || undefined,
          namespace: params.namespace || undefined,
          involved_name: params.involved || undefined,
          limit: params.limit || 200,
        },
      })
      .then((r) => r.data),
}

export const nodesApi = {
  list: (cluster?: string | null) =>
    http
      .get<NodeInfo[]>('/nodes', { params: { context: cluster || undefined } })
      .then((r) => r.data),
}

export const favoritesApi = {
  list: () => http.get<Favorite[]>('/favorites').then((r) => r.data),
  add: (payload: Omit<Favorite, 'id' | 'created_at'>) => http.post<Favorite>('/favorites', payload).then((r) => r.data),
  remove: (id: number) => http.delete(`/favorites/${id}`),
}
