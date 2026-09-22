import { describe, expect, it } from 'vitest'
import { logsApi } from '@/api/endpoints'

describe('logsApi.streamUrl', () => {
  it('builds SSE URL with cluster + container + tail', () => {
    const url = logsApi.streamUrl('c1', 'default', 'p1', 'app', 200)
    expect(url).toContain('/api/v1/pods/default/p1/logs/stream')
    expect(url).toContain('context=c1')
    expect(url).toContain('container=app')
    expect(url).toContain('tail_lines=200')
  })

  it('omits cluster when null', () => {
    const url = logsApi.streamUrl(null, 'ns', 'p', undefined, 100)
    expect(url).not.toContain('context=')
    expect(url).toContain('tail_lines=100')
  })

  it('encodes namespace and pod name', () => {
    const url = logsApi.streamUrl(null, 'my ns/x', 'pod#1')
    expect(url).toContain(encodeURIComponent('my ns/x'))
    expect(url).toContain(encodeURIComponent('pod#1'))
  })
})