import type { BrowserEvent, StorageData } from './schema.js'

const MAX_EVENTS = 50_000
const STORAGE_KEY = 'trimly_data'

async function load(): Promise<StorageData> {
  const result = await chrome.storage.local.get(STORAGE_KEY)
  return (result[STORAGE_KEY] as StorageData | undefined) ?? { events: [], version: 1 }
}

async function save(data: StorageData): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: data })
}

export async function addEvent(event: BrowserEvent): Promise<void> {
  const data = await load()
  data.events.unshift(event)
  if (data.events.length > MAX_EVENTS) {
    data.events = data.events.slice(0, MAX_EVENTS)
  }
  await save(data)
}

export async function getEvents(limit = 100): Promise<BrowserEvent[]> {
  const data = await load()
  return data.events.slice(0, limit)
}

export async function getStats(): Promise<{
  todayCount: number
  todayCost: number
  monthCount: number
  monthCost: number
  totalSaved: number
}> {
  const data = await load()
  const now = Date.now()
  const todayStart = new Date().setHours(0, 0, 0, 0)
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime()

  let todayCount = 0
  let todayCost = 0
  let monthCount = 0
  let monthCost = 0
  let totalSaved = 0

  for (const e of data.events) {
    if (e.timestamp >= monthStart && e.timestamp <= now) {
      monthCount++
      monthCost += e.cost_input_usd
      if (e.timestamp >= todayStart) {
        todayCount++
        todayCost += e.cost_input_usd
      }
    }
    totalSaved += e.cost_saved_usd ?? 0
  }

  return { todayCount, todayCost, monthCount, monthCost, totalSaved }
}

export async function exportJson(): Promise<string> {
  const data = await load()
  return JSON.stringify(data.events, null, 2)
}
