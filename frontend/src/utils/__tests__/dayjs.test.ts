import { describe, expect, it } from 'vitest'
import dayjs, { setDayjsLocale } from '@/utils/dayjs'

describe('dayjs locale', () => {
  // Declared first on purpose: the tests below mutate the global dayjs locale,
  // so only a freshly imported module still proves the *synchronous* default
  // that every view's first render depends on.
  it('renders Chinese on first use without awaiting', () => {
    expect(dayjs().subtract(3, 'minute').fromNow()).toContain('分钟')
  })

  it('renders relative time in English after switching', async () => {
    await setDayjsLocale('en-US')
    expect(dayjs().subtract(3, 'minute').fromNow()).toMatch(/minutes? ago/)
  })

  it('renders relative time in Chinese after switching back', async () => {
    await setDayjsLocale('zh-CN')
    expect(dayjs().subtract(3, 'minute').fromNow()).toContain('分钟')
  })

  it('is safe to call repeatedly', async () => {
    await setDayjsLocale('en-US')
    await setDayjsLocale('en-US')
    expect(dayjs().subtract(1, 'day').fromNow()).toMatch(/day/)
  })
})