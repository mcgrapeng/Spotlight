import { getCurrentScope, onScopeDispose, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from '@/utils/dayjs'

// ponytail: 一个全站共享的心跳，让「相对时间」自己会走。
//
// 之前 formatRel 读 Date.now()，而 Date.now() 不是响应式的 —— 相对时间
// 只在组件**因为别的原因**重渲染时才重算。一个什么都不动的页面，
// 「更新于 几秒前」会一直显示「几秒前」，事件列表里的「3 小时前」也
// 一直是「3 小时前」。这不是显示得慢，是显示在说假话：这个页面唯一的
// 新鲜度信号，停在了它最后一次被渲染的那一刻。
//
// 心跳只做一件事：每 30 秒把 now 推进一步。读 now.value 的组件会跟着
// 重渲染，formatRel 里的 60s 桶随之失效，值就重算了。
const now = ref(Date.now())

let timer: ReturnType<typeof setInterval> | null = null
let users = 0

function acquire() {
  users += 1
  if (timer === null) {
    timer = setInterval(() => { now.value = Date.now() }, 30_000)
  }
  // 组件卸载时把计数还回去，最后一个用户走了就把定时器停掉 —— 一个
  // 30 秒一次的定时器在测试里会变成「测试没有结束」的红灯。
  if (getCurrentScope()) onScopeDispose(release)
}

function release() {
  users = Math.max(0, users - 1)
  if (users === 0 && timer !== null) {
    clearInterval(timer)
    timer = null
  }
}

/**
 * One relative-time formatter for the whole app.
 *
 * The same `formatRel` was written three times — DashboardView (memoized),
 * EventsView and PodDetailView (not memoized) — and they drifted: the two
 * plain copies re-parse the timestamp for every row, and none of them
 * re-render on a locale switch unless the caller happens to read
 * `locale.value`.
 *
 * This version memoizes per (locale, 60s bucket, timestamp), so a 500-row
 * event list costs one dayjs parse per distinct timestamp per minute, and a
 * language switch invalidates the cache by construction.
 */
export function useRelativeTime() {
  const { locale } = useI18n()
  const cache = new Map<string, string>()
  acquire()

  function formatRel(iso: string | null | undefined): string {
    if (!iso) return '—'
    // 读 now.value 建立依赖：组件渲染时读它，心跳推进时它就跟着重渲染。
    // 桶仍然按分钟算 —— 「几秒前」在一分钟之内本来就是同一句话。
    const bucket = Math.floor(now.value / 60_000)
    const key = `${locale.value}:${bucket}:${iso}`
    let v = cache.get(key)
    if (v === undefined) {
      v = dayjs(iso).fromNow()
      cache.set(key, v)
      if (cache.size > 1000) cache.clear()
    }
    return v
  }

  return { formatRel }
}
