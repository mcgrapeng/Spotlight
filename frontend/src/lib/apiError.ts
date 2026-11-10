/**
 * 后端错误说清楚了一件事：这次读取失败，是**什么原因**。
 *
 * 三种成因必须分开，因为它们对读者意味着三件不同的事：
 *   - 403：访问控制把它裁掉了。**不是「数据是空的」。**
 *   - 404：它真的不存在。
 *   - 其它：读失败了，可以重试。
 *
 * 「数据为空」和「没权限读」混成一句话，是关于集群的假事实——值班的人
 * 会以为集群是健康的，转头去做别的检查。
 *
 * 后端的 detail 有三种形状：
 *   - 一句话（大多数业务错误）
 *   - `{code, permission, message}`（权限拒绝）
 *   - FastAPI 的校验错误数组
 * 直接把对象塞进界面会渲染出 JSON，或者 "[object Object]"。
 */
export interface ApiError {
  /** HTTP 状态码；网络层失败时为 null */
  status: number | null
  /** 后端给的那句话（人话）；没有就说 null */
  message: string | null
  /** 缺哪个权限（403 时） */
  permission: string | null
}

function detailOf(data: unknown): { message: string | null; permission: string | null } {
  const detail = (data as { detail?: unknown } | undefined)?.detail
  if (typeof detail === 'string') return { message: detail, permission: null }
  if (Array.isArray(detail)) {
    // FastAPI 的校验错误：[{loc, msg, type}, ...]
    const first = detail[0] as { msg?: string } | undefined
    return { message: first?.msg ?? null, permission: null }
  }
  if (detail && typeof detail === 'object') {
    const d = detail as { message?: unknown; permission?: unknown; msg?: unknown }
    const message = typeof d.message === 'string' ? d.message : typeof d.msg === 'string' ? d.msg : null
    const permission = typeof d.permission === 'string' ? d.permission : null
    return { message, permission }
  }
  return { message: null, permission: null }
}

/** 把 axios 的错误读成 {status, message, permission}。 */
export function readApiError(e: unknown): ApiError {
  const err = e as {
    response?: { status?: number; data?: unknown }
    message?: string
  } | null
  const status = typeof err?.response?.status === 'number' ? err.response.status : null
  const { message, permission } = detailOf(err?.response?.data)
  return { status, message, permission }
}

/**
 * 一句人话，读者读得懂。
 *
 * 后端已经说了原因就用它；没说的话，给状态码（重复一遍「加载失败」等于
 * 什么都没说，但 403 至少告诉读者该找谁要权限）。
 */
export function apiErrorMessage(e: unknown, fallback: string): string {
  const { status, message } = readApiError(e)
  return message ?? (status ? `HTTP ${status}` : fallback)
}
