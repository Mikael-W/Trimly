export function buildChartPath(
  pts: { cost: number }[],
  chartW: number,
  chartH: number,
): { line: string; area: string } | null {
  if (pts.length < 2) return null
  const maxV = Math.max(...pts.map((p) => p.cost), 0.00001)
  const coords = pts.map((p, i) => ({
    x: (i / (pts.length - 1)) * chartW,
    y: chartH - (p.cost / maxV) * (chartH - 20) - 10,
  }))
  let prev = coords[0]
  if (!prev) return null
  let line = `M ${prev.x} ${prev.y}`
  for (let i = 1; i < coords.length; i++) {
    const c = coords[i]
    if (!c) continue
    const cpx = (prev.x + c.x) / 2
    line += ` C ${cpx} ${prev.y} ${cpx} ${c.y} ${c.x} ${c.y}`
    prev = c
  }
  const area = `${line} L ${prev.x} ${chartH} L 0 ${chartH} Z`
  return { line, area }
}
