import type { TrimlyEvent } from '@trimly/core'

export function useEvents(source: Ref<string>, days?: Ref<number | undefined>) {
  return useFetch<TrimlyEvent[]>('/api/events', {
    query: computed(() => ({
      source: source.value !== 'all' ? source.value : undefined,
      days: days?.value,
      limit: 200,
    })),
    watch: [source, ...(days ? [days] : [])],
  })
}
