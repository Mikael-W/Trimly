export function buildChartPath(
  pts: { cost: number }[],
  chartW: number,
  chartH: number,
): { line: string; area: string } | null {
  if (pts.length < 2) return null
  const maxV = Math.max(...pts.map(p => p.cost), 0.00001)
  const coords = pts.map((p, i) => ({
    x: (i / (pts.length - 1)) * chartW,
    y: chartH - (p.cost / maxV) * (chartH - 20) - 10,
  }))
  let line = `M ${coords[0]!.x} ${coords[0]!.y}`
  for (let i = 1; i < coords.length; i++) {
    const p = coords[i - 1]!
    const c = coords[i]!
    const cpx = (p.x + c.x) / 2
    line += ` C ${cpx} ${p.y} ${cpx} ${c.y} ${c.x} ${c.y}`
  }
  const last = coords[coords.length - 1]!
  const area = `${line} L ${last.x} ${chartH} L 0 ${chartH} Z`
  return { line, area }
}
