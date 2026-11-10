import { describe, expect, it } from 'vitest'
import { modelEndpoint } from '../modelEndpoint'

describe('model endpoint classification', () => {
  it('recognises a loopback address as local', () => {
    expect(modelEndpoint('http://localhost:11434/v1').local).toBe(true)
    expect(modelEndpoint('http://127.0.0.1:8000/v1').local).toBe(true)
  })

  it('recognises a private-network address as local', () => {
    expect(modelEndpoint('http://10.0.3.7:8080/v1').local).toBe(true)
    expect(modelEndpoint('http://192.168.1.10/v1').local).toBe(true)
    expect(modelEndpoint('http://172.16.4.9/v1').local).toBe(true)
    expect(modelEndpoint('http://vllm.internal/v1').local).toBe(true)
  })

  it('recognises an IPv6 loopback address as local', () => {
    // 按 ':' 切分会把 ::1 切成空串 —— 回环地址会被误判成外部，
    // 而后端明确允许 ::1 走 http。
    expect(modelEndpoint('http://[::1]:11434/v1').local).toBe(true)
  })

  it('recognises an IPv6 private address as local', () => {
    // fc00::/7 唯一本地地址，fe80::/10 链路本地
    expect(modelEndpoint('http://[fd00::1]:8080/v1').local).toBe(true)
    expect(modelEndpoint('http://[fe80::1]:8080/v1').local).toBe(true)
  })

  it('treats a public address as external', () => {
    const e = modelEndpoint('https://api.openai.com/v1')
    expect(e.local).toBe(false)
    expect(e.defaultRoute).toBe(false)
    expect(e.host).toBe('api.openai.com')
  })

  it('treats an IPv6 public address as external', () => {
    const e = modelEndpoint('https://[2606:4700:4700::1111]/v1')
    expect(e.local).toBe(false)
  })

  it('treats a single-label name as internal', () => {
    // 单标签名字（没有点）只有集群 DNS 或 hosts 文件能解析——公网根域
    // 不返回这种记录，所以它必然在某个内部 DNS 上。
    expect(modelEndpoint('http://ollama:11434/v1').local).toBe(true)
    expect(modelEndpoint('http://llm.svc.cluster.local:8080/v1').local).toBe(true)
  })

  it('knows a bare host[:port] without a scheme', () => {
    const e = modelEndpoint('llm.example.com:443')
    expect(e.host).toBe('llm.example.com:443')
    expect(e.local).toBe(false)
  })

  it('reports the default route when no address is configured', () => {
    // 没有 api_base 时 LiteLLM 按 provider 类型路由到默认端点。
    const e = modelEndpoint(null, 'openai')
    expect(e.defaultRoute).toBe(true)
    expect(e.local).toBe(false)
  })

  it('treats a local provider type with no address as local', () => {
    // Ollama 的默认端点就在本机（http://localhost:11434）。
    expect(modelEndpoint('', 'ollama').local).toBe(true)
    expect(modelEndpoint(null, 'Ollama').defaultRoute).toBe(false)
  })

  it('judges by the provider type, not by the name the operator gave it', () => {
    // 名字是随便写的。一个叫「本地模型」的 openai provider 照样连的是
    // 厂商 API；一个叫「OpenAI」的 ollama provider 连的是本机。
    // 判定用类型（provider.provider），不是名字（provider.name）。
    expect(modelEndpoint(null, 'openai').local).toBe(false)
    expect(modelEndpoint(null, 'ollama').local).toBe(true)
  })
})
