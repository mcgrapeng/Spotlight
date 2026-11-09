import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { InternalAxiosRequestConfig } from 'axios'

// The interceptor re-lists the clusters when the backend answers 409. The
// cluster list itself goes through the same guard, so a session with no
// cluster chosen answered 409 there too — and the interceptor fired again,
// and again, forever.
const { loadClusters } = vi.hoisted(() => ({
  loadClusters: vi.fn(() => Promise.resolve()),
}))
vi.mock('@/stores/cluster', () => ({ useClusterStore: () => ({ loadClusters }) }))

import { http } from '@/api/client'

function answerWith(status: number): string[] {
  const calls: string[] = []
  // axios leaves the settling to the adapter, so the fake one has to reject
  // the error statuses itself — the way the real adapter does.
  http.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
    calls.push(config.url ?? '')
    const response = {
      data: { detail: 'boom' },
      status,
      statusText: 'x',
      headers: {},
      config,
    }
    if (!config.validateStatus || config.validateStatus(status)) return response
    const err: any = new Error(`Request failed with status code ${status}`)
    err.config = config
    err.response = response
    err.isAxiosError = true
    throw err
  }
  return calls
}

describe('the 409 handler', () => {
  beforeEach(() => loadClusters.mockClear())

  it('re-lists the clusters when some other request is what failed', async () => {
    answerWith(409)
    await expect(http.get('/pods')).rejects.toBeTruthy()
    expect(loadClusters).toHaveBeenCalledTimes(1)
  })

  it('does not re-list the clusters when the cluster list itself is what failed', async () => {
    const calls = answerWith(409)
    await expect(http.get('/clusters')).rejects.toBeTruthy()
    expect(loadClusters).not.toHaveBeenCalled()
    expect(calls).toEqual(['/clusters'])
  })
})
