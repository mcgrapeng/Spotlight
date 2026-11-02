import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { usePagination } from '../usePagination'

describe('usePagination', () => {
  it('counts pages from the item total and never shows zero pages', () => {
    const totalItems = ref(25)
    const pageSize = ref(10)
    const { totalPages } = usePagination({ totalItems, pageSize, resetKey: ref(0) })
    expect(totalPages.value).toBe(3)
    totalItems.value = 0
    expect(totalPages.value).toBe(1)
  })

  it('walks next and prev but stops at both ends', () => {
    const totalItems = ref(25)
    const pageSize = ref(10)
    const { page, prev, next, reset } = usePagination({ totalItems, pageSize, resetKey: ref(0) })
    prev()
    expect(page.value).toBe(1)
    next()
    next()
    next()
    expect(page.value).toBe(3)
    next() // past the end: stays put
    expect(page.value).toBe(3)
    reset()
    expect(page.value).toBe(1)
  })

  it('jumps back to page 1 when the page size or the reset key changes', async () => {
    const totalItems = ref(100)
    const pageSize = ref(10)
    const resetKey = ref('cluster-a')
    const { page, next } = usePagination({ totalItems, pageSize, resetKey })
    next()
    expect(page.value).toBe(2)
    pageSize.value = 25
    await nextTick()
    expect(page.value).toBe(1)
    next()
    resetKey.value = 'cluster-b'
    await nextTick()
    expect(page.value).toBe(1)
  })

  it('clamps the page when the total shrinks below it', async () => {
    const totalItems = ref(100)
    const pageSize = ref(10)
    const { page, totalPages } = usePagination({ totalItems, pageSize, resetKey: ref(0) })
    page.value = 10
    totalItems.value = 20
    await nextTick()
    expect(totalPages.value).toBe(2)
    expect(page.value).toBe(2)
  })
})
