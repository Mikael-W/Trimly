/** Remove duplicate sentences within a text block. */
export function deduplicate(text: string): string {
  if (!text) return text

  let sentences: string[]

  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'sentence' })
    sentences = [...segmenter.segment(text)].map((s) => s.segment)
  } else {
    sentences = text.split(/(?<=[.!?])\s+/)
  }

  const seen = new Set<string>()
  const unique: string[] = []

  for (const sentence of sentences) {
    const normalized = sentence.trim().toLowerCase().replace(/\s+/g, ' ')
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized)
      unique.push(sentence)
    }
  }

  return unique.join(' ').trim()
}
