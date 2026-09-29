/**
 * Single source of dayjs config (relative time + zh-CN locale).
 * Importing dayjs from here avoids duplicate `extend()` and `locale()` calls
 * across the views.
 */
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

export default dayjs
