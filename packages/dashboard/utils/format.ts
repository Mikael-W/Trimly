export function fmtCost(n: number): string {
  return `$${n.toFixed(4)}`
}

export function fmtCost5(n: number): string {
  return `$${n.toFixed(5)}`
}

export function fmtTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

export function fmtRelTime(ts: number, now = Date.now()): string {
  const diff = now - ts
  const m = Math.floor(diff / 60_000)
  if (m < 1) return '< 1m'
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

export function fmtDateTime(ts: number): string {
  return new Date(ts).toLocaleString()
}
