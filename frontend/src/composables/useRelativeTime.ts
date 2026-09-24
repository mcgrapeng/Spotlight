import { computed, type Ref } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

export function useRelativeTime(date: Ref<string | Date | null | undefined>) {
  const rel = computed(() => {
    if (!date.value) return ''
    return dayjs(date.value).fromNow()
  })
  return rel
}
