/** Normalize whitespace while preserving code block content. */
export function compactWhitespace(text: string): string {
  if (!text) return text

  const CODE_BLOCK = /```[\s\S]*?```/g
  const placeholders = new Map<string, string>()
  let i = 0

  const withPlaceholders = text.replace(CODE_BLOCK, (match) => {
    const key = `__TRIMLY_CODE_${i++}__`
    placeholders.set(key, match)
    return key
  })

  let result = withPlaceholders
    .replace(/ {2,}/g, ' ')
    .replace(/\t/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^ +| +$/gm, '')
    .trim()

  for (const [key, original] of placeholders) {
    result = result.replace(key, original)
  }

  return result
}
