/**
 * 模型服务端的地址，以及它大概在哪儿。
 *
 * Spotlight 把日志片段或集群概况发给使用者自己配置的模型。模型可能跑在
 * 集群内（Ollama / vLLM），也可能是外部 SaaS（OpenAI / Anthropic…）。
 * 产品不对模型部署位置设硬约束，所以界面要**按当前配置**说清楚内容
 * 发去了哪里 —— 写死一句「数据会发给第三方」在自托管场景下是假的，
 * 写死一句「都在内网」在 SaaS 场景下是危险的。
 *
 * 判定的是**地址的形状**，不是事实。split-horizon DNS、跨网段的私网
 * IP 都是反例，所以界面上的措辞是「看起来在……」，不是断言。
 */
export interface ModelEndpoint {
  /** 展示用的地址（host[:port]）；没有配置时为 null */
  host: string | null
  /** 看起来在不在自己的网络里 */
  local: boolean
  /** local=false 且没有地址时：走 LiteLLM 的默认路由 */
  defaultRoute: boolean
}

/**
 * 会解析到本地网络的名字。
 *
 * `.local` / `.internal` / `.lan` / `.home.arpa` 是私网 DNS 的约定后缀；
 * 不带点的名字（`ollama`）只有集群 DNS 或 hosts 文件能解析——公网根
 * 域不会返回单标签名字的记录，所以它必然在某个内部 DNS 上。
 */
const INTERNAL_SUFFIXES = ['.local', '.internal', '.lan', '.home.arpa', '.localhost']

/** LiteLLM 里默认端点在本机的 provider 类型。 */
const LOCAL_PROVIDER_TYPES = /ollama|lmstudio|lm-?studio|vllm|llama-?cpp|localai|text-generation/i

function isIpv4Private(host: string): boolean {
  return (
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
    /^169\.254\./.test(host)
  )
}

function isIpv6Private(host: string): boolean {
  // 去掉 zone id（fe80::1%en0）
  const h = host.split('%')[0].toLowerCase()
  if (h === '::1') return true
  // fc00::/7 唯一本地地址（ULA）
  if (/^f[cd][0-9a-f]{2}:/.test(h)) return true
  // fe80::/10 链路本地
  if (/^fe[89ab][0-9a-f]:/.test(h)) return true
  return false
}

/**
 * 这个 host 看起来在自己的网络里吗？
 *
 * 分三类：回环/私网 IP、约定的私网域名后缀、不带点的单标签名字。
 */
function looksInternal(hostname: string): boolean {
  const h = hostname.toLowerCase()
  if (!h) return false
  if (h === 'localhost') return true
  if (INTERNAL_SUFFIXES.some((s) => h.endsWith(s))) return true
  if (isIpv4Private(h) || isIpv6Private(h)) return true
  // 单标签名字（没有点）：只有内部 DNS 能解析。
  // IPv6 地址不含点，但它们是地址不是名字，别套这条规则。
  if (h.includes(':')) return false
  return !h.includes('.')
}

function hostOf(apiBase: string | null | undefined): { host: string | null; hostname: string | null } {
  if (!apiBase) return { host: null, hostname: null }
  const raw = apiBase.trim()
  if (!raw) return { host: null, hostname: null }
  // 带协议就解析 URL，否则当成 host[:port]
  try {
    const u = new URL(raw.includes('://') ? raw : `http://${raw}`)
    // hostname 不含端口，也把 IPv6 的方括号去掉 —— 按 ':' 切分会把
    // ::1 切成空串，于是回环地址会被判成外部。
    const hostname = u.hostname.replace(/^\[|\]$/g, '') || null
    return { host: u.host || hostname, hostname }
  } catch {
    const bare = raw.split('/')[0] || null
    if (!bare) return { host: null, hostname: null }
    // 形如 [::1]:11434 / host:port
    const hostname = bare.replace(/^\[|\]$/g, '').replace(/:\d+$/, '') || null
    return { host: bare, hostname }
  }
}

/**
 * @param apiBase 配置里的地址（可空）
 * @param providerType provider 的**类型**（"ollama" / "openai"…），
 *   不是使用者给它起的名字。名字是随便写的——一个叫「本地模型」的
 *   openai provider 照样连的是厂商 API，所以这里必须看类型。
 */
export function modelEndpoint(
  apiBase: string | null | undefined,
  providerType?: string | null,
): ModelEndpoint {
  const { host, hostname } = hostOf(apiBase)
  if (!host || !hostname) {
    // 没有专用地址时 LiteLLM 按 provider 类型路由到默认端点。
    // Ollama 这类本地 provider 的默认端点就在本机。
    const p = (providerType ?? '').toLowerCase()
    const localDefault = LOCAL_PROVIDER_TYPES.test(p)
    return { host: null, local: localDefault, defaultRoute: !localDefault }
  }
  return { host, local: looksInternal(hostname), defaultRoute: false }
}
