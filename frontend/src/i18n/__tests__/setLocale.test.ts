import { beforeEach, describe, expect, it } from 'vitest'
import { setLocale } from '@/i18n'
import dayjs from '@/utils/dayjs'

describe('setLocale', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  // Dayjs has no `setDayjsLocale` of its own here — this covers the handoff in
  // `setLocale` itself, which is the whole point of awaiting it.
  it('switches dayjs relative time to match the chosen locale', async () => {
    await setLocale('en-US')
    expect(dayjs().subtract(3, 'minute').fromNow()).toMatch(/minutes? ago/)
  })
})