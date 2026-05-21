import type { StatsResult } from '@trimly/core'

export function useStats(period: Ref<string>) {
  const days = computed(() => {
    if (period.value === 'today') return 1
    if (period.value === '7d') return 7
    if (period.value === '30d') return 30
    return undefined
  })

  return useFetch<StatsResult>('/api/stats', {
    query: computed(() => ({ days: days.value })),
    watch: [days],
  })
}
