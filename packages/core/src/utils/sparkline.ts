const SPARKS = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'] as const

export function formatSparkline(values: number[]): string {
  if (values.length === 0) return ''
  const max = Math.max(...values)
  if (max === 0) return values.map(() => '▁').join('')
  return values
    .map((v) => SPARKS[Math.min(SPARKS.length - 1, Math.floor((v / max) * (SPARKS.length - 1)))])
    .join('')
}
