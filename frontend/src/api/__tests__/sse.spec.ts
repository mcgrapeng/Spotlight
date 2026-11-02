import { describe, expect, it } from 'vitest'
import { readSSE } from '../sse'

function sseResponse(chunks: string[]): Response {
  const encoder = new TextEncoder()
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const c of chunks) controller.enqueue(encoder.encode(c))
      controller.close()
    },
  })
  return new Response(body, { headers: { 'content-type': 'text/event-stream' } })
}

describe('readSSE', () => {
  it('yields one frame per event', async () => {
    const resp = sseResponse([
      'event: delta\ndata: {"text":"hi"}\n\n',
      'event: delta\ndata: {"text":" there"}\n\n',
      'event: done\ndata: [DONE]\n\n',
    ])
    const frames = []
    for await (const f of readSSE(resp)) frames.push(f)
    expect(frames.map((f) => f.event)).toEqual(['delta', 'delta', 'done'])
    expect(frames[0]!.data).toBe('{"text":"hi"}')
  })

  it('handles CRLF frame endings', async () => {
    // sse-starlette terminates frames with CRLF.
    const resp = sseResponse(['event: delta\r\ndata: {"text":"a"}\r\n\r\n'])
    const frames = []
    for await (const f of readSSE(resp)) frames.push(f)
    expect(frames).toHaveLength(1)
    expect(frames[0]!.data).toBe('{"text":"a"}')
  })

  it('reassembles a frame split across chunk boundaries', async () => {
    const resp = sseResponse(['event: del', 'ta\ndata: {"text', '":"split"}\n\n'])
    const frames = []
    for await (const f of readSSE(resp)) frames.push(f)
    expect(frames).toHaveLength(1)
    expect(frames[0]!.event).toBe('delta')
    expect(frames[0]!.data).toBe('{"text":"split"}')
  })

  it('survives a CRLF split across a chunk boundary', async () => {
    const resp = sseResponse(['event: delta\r', '\ndata: {"text":"x"}\r', '\n\r\n'])
    const frames = []
    for await (const f of readSSE(resp)) frames.push(f)
    expect(frames).toHaveLength(1)
    expect(frames[0]!.data).toBe('{"text":"x"}')
  })

  it('ignores frames without data', async () => {
    const resp = sseResponse([': keepalive\n\n', 'event: done\ndata: [DONE]\n\n'])
    const frames = []
    for await (const f of readSSE(resp)) frames.push(f)
    expect(frames).toHaveLength(1)
    expect(frames[0]!.event).toBe('done')
  })
})
