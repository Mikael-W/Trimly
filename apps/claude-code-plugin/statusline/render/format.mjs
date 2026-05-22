const SPARKS = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█']

/** Format a USD cost as € or $ depending on currency */
export function formatCost(usd, currency = 'USD') {
  if (currency === 'EUR') {
    // rough USD→EUR conversion; replaced at runtime by config rate if available
    const eur = usd * 0.92
    return `€${eur < 0.01 && eur > 0 ? eur.toFixed(4) : eur.toFixed(2)}`
  }
  return `$${usd < 0.01 && usd > 0 ? usd.toFixed(4) : usd.toFixed(2)}`
}

/** Compact cost: €0.42 */
export function formatCostShort(usd, currency = 'USD') {
  return formatCost(usd, currency)
}

/** Progress bar: ████░░░░░░ 42% */
export function progressBar(pct, width = 10) {
  const filled = Math.round((pct / 100) * width)
  const empty = width - filled
  return '█'.repeat(filled) + '░'.repeat(empty) + ` ${pct}%`
}

/** Sparkline from array of numbers */
export function sparkline(values) {
  if (!values || values.length === 0) return ''
  const max = Math.max(...values)
  if (max === 0) return values.map(() => '▁').join('')
  return values
    .map((v) => SPARKS[Math.min(SPARKS.length - 1, Math.floor((v / max) * (SPARKS.length - 1)))])
    .join('')
}

/** Tool name icon mapping */
const TOOL_ICONS = {
  Edit: '◐',
  Write: '◐',
  Read: '✓',
  Bash: '⚡',
  Grep: '🔍',
  WebFetch: '🌐',
  WebSearch: '🔍',
  Agent: '🤖',
}

export function toolIcon(name) {
  return TOOL_ICONS[name] ?? '•'
}

/** Format a tool call for the verbose line: "◐ Edit: auth.ts ($0.012)" */
export function formatToolCall(call, currency = 'USD') {
  const icon = toolIcon(call.tool_name)
  const target = call.target ? `: ${call.target.split('/').slice(-1)[0]}` : ''
  const cost = call.cost_usd > 0 ? ` (${formatCost(call.cost_usd, currency)})` : ''
  return `${icon} ${call.tool_name}${target}${cost}`
}
