/**
 * Read a Server-Sent Events stream off a fetch response.
 *
 * The browser's `EventSource` is GET-only, and these requests carry a body
 * (the provider id, the question, the context snapshot), so the stream has
 * to be read by hand off `fetch`'s response body.
 *
 * sse-starlette terminates frames with CRLF; the split is done on `\n\n`
 * after normalising, so a chunk boundary that lands between the CR and the
 * LF does not break a frame — the CR stays in the buffer until its LF
 * arrives.
 */
export interface SSEFrame {
  event: string
  data: string
}

function parseFrame(raw: string): SSEFrame | null {
  let event = 'message'
  const data: string[] = []
  for (const line of raw.split('\n')) {
    if (line.startsWith('event:')) event = line.slice(6).trim()
    else if (line.startsWith('data:')) data.push(line.slice(5).replace(/^ /, ''))
  }
  if (!data.length) return null
  return { event, data: data.join('\n') }
}

export async function* readSSE(response: Response): AsyncGenerator<SSEFrame> {
  const reader = response.body?.getReader()
  if (!reader) return
  const decoder = new TextDecoder()
  let buf = ''
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buf += decoder.decode(value, { stream: true })
      buf = buf.replace(/\r\n/g, '\n')
      let idx: number
      while ((idx = buf.indexOf('\n\n')) !== -1) {
        const frame = buf.slice(0, idx)
        buf = buf.slice(idx + 2)
        const parsed = parseFrame(frame)
        if (parsed) yield parsed
      }
    }
  } finally {
    reader.releaseLock()
  }
}
