export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const days = query['days'] ? Number(query['days']) : undefined
  const source = typeof query['source'] === 'string' ? query['source'] : undefined

  const storage = await getStorage()
  return storage.getStats({ days, source })
})
