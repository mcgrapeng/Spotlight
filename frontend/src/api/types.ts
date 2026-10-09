// Hand-written top-level aliases over the generated OpenAPI types.
// The generated file lives in `types.gen.ts` (refresh with `pnpm types:gen`);
// this shim keeps `import type { PodOut } from '@/api/types'` working.

import type { components } from './types.gen'

type Schemas = components['schemas']

export type AIAnalyzeIn = Schemas['AIAnalyzeIn']
export type AIAnalyzeOut = Schemas['AIAnalyzeOut']
export type AIProviderIn = Schemas['AIProviderIn']
export type AIProviderOut = Schemas['AIProviderOut']
export type ClusterOut = Schemas['ClusterOut']
export type ContainerOut = Schemas['ContainerOut']
export type DashboardOut = Schemas['DashboardOut']
export type EventOut = Schemas['EventOut']
export type FavoriteCreate = Schemas['FavoriteCreate']
export type FavoriteOut = Schemas['FavoriteOut']
export type KubeLoginIn = Schemas['KubeLoginIn']
export type KubeLoginOut = Schemas['KubeLoginOut']
export type LogHistoryOut = Schemas['LogHistoryOut']
export type LogStreamParams = Schemas['LogStreamParams']
export type LoginIn = Schemas['LoginIn']
export type LoginOut = Schemas['LoginOut']
export type NamespaceOut = Schemas['NamespaceOut']
export type NodeOut = Schemas['NodeOut']
export type PodListOut = Schemas['PodListOut']
export type PodOut = Schemas['PodOut']
export type StatusOut = Schemas['StatusOut']

/** Wire name is LogStreamParams; call sites still say LogLineOut. */
export type LogLineOut = LogStreamParams

/** Severity values produced by the backend classifier (LogSeverity enum). */
export type LogSeverity =
  | 'trace'
  | 'debug'
  | 'info'
  | 'notice'
  | 'warn'
  | 'error'
  | 'critical'
  | 'fatal'
  | 'unknown'
