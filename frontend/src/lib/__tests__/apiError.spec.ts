import { describe, expect, it } from 'vitest'
import { readApiError, apiErrorMessage } from '../apiError'

/** axios 的错误形状：response.data.detail。 */
function err(status: number, detail?: unknown) {
  return { response: { status, data: detail === undefined ? {} : { detail } } }
}

describe('readApiError', () => {
  it('reads a plain sentence', () => {
    // 大多数业务错误：后端给一句话
    const e = readApiError(err(404, 'Pod 或容器不存在'))
    expect(e.status).toBe(404)
    expect(e.message).toBe('Pod 或容器不存在')
    expect(e.permission).toBeNull()
  })

  it('reads the permission denial shape', () => {
    // 权限拒绝是一个对象。直接把它塞进界面会渲染出原始 JSON。
    const e = readApiError(
      err(403, { code: 'forbidden', permission: 'pods.logs', message: '没有权限：pods.logs' }),
    )
    expect(e.status).toBe(403)
    expect(e.message).toBe('没有权限：pods.logs')
    expect(e.permission).toBe('pods.logs')
  })

  it('reads FastAPI validation errors', () => {
    const e = readApiError(err(422, [{ loc: ['body', 'x'], msg: 'field required', type: 'x' }]))
    expect(e.status).toBe(422)
    expect(e.message).toBe('field required')
  })

  it('survives an error with no response at all', () => {
    // 网络断了：没有 status，没有 detail
    const e = readApiError(new Error('Network Error'))
    expect(e.status).toBeNull()
    expect(e.message).toBeNull()
    expect(e.permission).toBeNull()
  })

  it('does not invent a permission code', () => {
    const e = readApiError(err(500, '内部错误'))
    expect(e.permission).toBeNull()
  })
})

describe('apiErrorMessage', () => {
  it('prefers the backend sentence', () => {
    expect(apiErrorMessage(err(404, 'Pod 或容器不存在'), '加载失败')).toBe('Pod 或容器不存在')
  })

  it('falls back to the status code', () => {
    // 重复一遍「加载失败」等于什么都没说，但 403 至少告诉读者该找谁。
    expect(apiErrorMessage(err(500), '加载失败')).toBe('HTTP 500')
  })

  it('falls back to the local wording when there is nothing else', () => {
    expect(apiErrorMessage(new Error('Network Error'), '加载失败')).toBe('加载失败')
  })
})
