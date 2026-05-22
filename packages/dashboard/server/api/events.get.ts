import type { EventSource, EventStatus } from '@trimly/core'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const storage = await getStorage()

  return storage.queryEvents({
    source: query.source as EventSource | undefined,
    status: query.status as EventStatus | undefined,
    days: query.days ? Number(query.days) : undefined,
    limit: query.limit ? Number(query.limit) : 100,
    cursor: query.cursor ? Number(query.cursor) : undefined,
  })
})
