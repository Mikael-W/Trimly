import { DE_FILLER_PATTERNS } from './patterns/de.js'
import { EN_FILLER_PATTERNS } from './patterns/en.js'
import { ES_FILLER_PATTERNS } from './patterns/es.js'
import { FR_FILLER_PATTERNS } from './patterns/fr.js'
import { IT_FILLER_PATTERNS } from './patterns/it.js'
import { PT_FILLER_PATTERNS } from './patterns/pt.js'
import type { CleanFillerOptions, CleanFillerResult, FillerPattern, SupportedLanguage } from './types.js'

const PATTERNS_BY_LANG: Record<SupportedLanguage, FillerPattern[]> = {
  fr: FR_FILLER_PATTERNS,
  en: EN_FILLER_PATTERNS,
  es: ES_FILLER_PATTERNS,
  de: DE_FILLER_PATTERNS,
  it: IT_FILLER_PATTERNS,
  pt: PT_FILLER_PATTERNS,
}

const LANG_KEYWORDS: Record<SupportedLanguage, RegExp> = {
  fr: /\b(le|la|les|de|du|est|sont|avec|pour|dans|sur|je|tu|vous|nous)\b/i,
  en: /\b(the|is|are|with|for|in|on|I|you|we|they|it|that|this)\b/i,
  es: /\b(el|la|los|las|de|del|es|son|con|para|en|yo|tú|usted)\b/i,
  de: /\b(der|die|das|ist|sind|mit|für|in|ich|du|Sie|wir)\b/i,
  it: /\b(il|la|le|di|del|è|sono|con|per|in|io|tu|Lei)\b/i,
  pt: /\b(o|a|os|as|de|do|é|são|com|para|em|eu|você|nós)\b/i,
}

function detectLanguage(text: string): SupportedLanguage {
  const scores: [SupportedLanguage, number][] = (
    Object.entries(LANG_KEYWORDS) as [SupportedLanguage, RegExp][]
  ).map(([lang, re]) => {
    const matches = text.match(new RegExp(re.source, 'gi'))
    return [lang, matches?.length ?? 0]
  })
  scores.sort((a, b) => b[1] - a[1])
  return scores[0]?.[0] ?? 'en'
}

function normalizeWhitespace(text: string): string {
  return text
    .replace(/ {2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^ +| +$/gm, '')
    .trim()
}

/**
 * Detect or remove filler words from a text.
 * Does NOT modify the text when mode='detect' (default for plugin).
 */
export function cleanFiller(text: string, options: CleanFillerOptions = {}): CleanFillerResult {
  if (!text) {
    return { text, applied: false, tokensSaved: 0, patternsMatched: [] }
  }

  const mode = options.mode ?? 'apply'
  const langs = options.languages ?? [detectLanguage(text)]
  const patterns: FillerPattern[] = [
    ...langs.flatMap((l) => PATTERNS_BY_LANG[l] ?? []),
    ...(options.customPatterns ?? []),
  ]

  const preserve = options.preserve ?? []
  const placeholders = new Map<string, string>()
  let guarded = text

  // Protect preserved strings
  preserve.forEach((word, i) => {
    const placeholder = `__TRIMLY_PRESERVE_${i}__`
    placeholders.set(placeholder, word)
    guarded = guarded.replace(new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), placeholder)
  })

  const patternsMatched: string[] = []
  let result = guarded

  for (const p of patterns) {
    const before = result
    result = result.replace(p.pattern, p.replace)
    if (result !== before) patternsMatched.push(p.id)
  }

  // Restore preserved strings
  for (const [placeholder, original] of placeholders) {
    result = result.replace(new RegExp(placeholder, 'g'), original)
  }

  result = normalizeWhitespace(result)

  const tokensSaved = Math.max(0, Math.floor((text.length - result.length) / 4))
  const applied = result !== text

  return {
    text: mode === 'detect' ? text : result,
    applied,
    tokensSaved,
    patternsMatched,
  }
}

export { detectLanguage }
export type { CleanFillerOptions, CleanFillerResult, SupportedLanguage }
