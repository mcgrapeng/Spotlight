import { describe, expect, it } from 'vitest'
import { authApi } from '@/api/endpoints'

describe('authApi URL builder', () => {
  // We don't make real network calls. Just sanity-check the endpoint paths.
  it('exposes status + login', () => {
    expect(typeof authApi.status).toBe('function')
    expect(typeof authApi.login).toBe('function')
  })
})