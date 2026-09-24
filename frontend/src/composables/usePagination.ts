import { computed, ref, watch, type Ref } from 'vue'

export function usePagination(opts: {
  totalItems: Ref<number>
  pageSize: Ref<number>
  resetKey?: Ref<unknown>
}) {
  const page = ref(1)
  const totalPages = computed(() => Math.max(1, Math.ceil(opts.totalItems.value / opts.pageSize.value)))
  function reset() { page.value = 1 }
  function next()    { if (page.value < totalPages.value) page.value++ }
  function prev()    { if (page.value > 1) page.value-- }
  watch([opts.pageSize, opts.resetKey], () => { page.value = 1 })
  watch(totalPages, (max) => { if (page.value > max) page.value = max })
  return { page, totalPages, reset, next, prev }
}
