import { BG_FILLER_PATTERNS } from './patterns/bg.js'
import { CS_FILLER_PATTERNS } from './patterns/cs.js'
import { DA_FILLER_PATTERNS } from './patterns/da.js'
import { DE_FILLER_PATTERNS } from './patterns/de.js'
import { EL_FILLER_PATTERNS } from './patterns/el.js'
import { EN_FILLER_PATTERNS } from './patterns/en.js'
import { ES_FILLER_PATTERNS } from './patterns/es.js'
import { ET_FILLER_PATTERNS } from './patterns/et.js'
import { FI_FILLER_PATTERNS } from './patterns/fi.js'
import { FR_FILLER_PATTERNS } from './patterns/fr.js'
import { GA_FILLER_PATTERNS } from './patterns/ga.js'
import { HR_FILLER_PATTERNS } from './patterns/hr.js'
import { HU_FILLER_PATTERNS } from './patterns/hu.js'
import { IT_FILLER_PATTERNS } from './patterns/it.js'
import { LT_FILLER_PATTERNS } from './patterns/lt.js'
import { LV_FILLER_PATTERNS } from './patterns/lv.js'
import { MT_FILLER_PATTERNS } from './patterns/mt.js'
import { NL_FILLER_PATTERNS } from './patterns/nl.js'
import { PL_FILLER_PATTERNS } from './patterns/pl.js'
import { PT_FILLER_PATTERNS } from './patterns/pt.js'
import { RO_FILLER_PATTERNS } from './patterns/ro.js'
import { SK_FILLER_PATTERNS } from './patterns/sk.js'
import { SL_FILLER_PATTERNS } from './patterns/sl.js'
import { SV_FILLER_PATTERNS } from './patterns/sv.js'
import type {
  CleanFillerOptions,
  CleanFillerResult,
  FillerPattern,
  SupportedLanguage,
} from './types.js'

const PATTERNS_BY_LANG: Record<SupportedLanguage, FillerPattern[]> = {
  fr: FR_FILLER_PATTERNS,
  en: EN_FILLER_PATTERNS,
  es: ES_FILLER_PATTERNS,
  de: DE_FILLER_PATTERNS,
  it: IT_FILLER_PATTERNS,
  pt: PT_FILLER_PATTERNS,
  nl: NL_FILLER_PATTERNS,
  pl: PL_FILLER_PATTERNS,
  sv: SV_FILLER_PATTERNS,
  da: DA_FILLER_PATTERNS,
  cs: CS_FILLER_PATTERNS,
  ro: RO_FILLER_PATTERNS,
  hr: HR_FILLER_PATTERNS,
  sk: SK_FILLER_PATTERNS,
  sl: SL_FILLER_PATTERNS,
  hu: HU_FILLER_PATTERNS,
  fi: FI_FILLER_PATTERNS,
  et: ET_FILLER_PATTERNS,
  lv: LV_FILLER_PATTERNS,
  lt: LT_FILLER_PATTERNS,
  ga: GA_FILLER_PATTERNS,
  mt: MT_FILLER_PATTERNS,
  el: EL_FILLER_PATTERNS,
  bg: BG_FILLER_PATTERNS,
}

const LANG_KEYWORDS: Record<SupportedLanguage, RegExp> = {
  fr: /\b(le|la|les|de|du|est|sont|avec|pour|dans|sur|je|tu|vous|nous)\b/i,
  en: /\b(the|is|are|with|for|in|on|I|you|we|they|it|that|this)\b/i,
  es: /\b(el|la|los|las|de|del|es|son|con|para|en|yo|tú|usted)\b/i,
  de: /\b(der|die|das|ist|sind|mit|für|in|ich|du|Sie|wir)\b/i,
  it: /\b(il|la|le|di|del|è|sono|con|per|in|io|tu|Lei)\b/i,
  pt: /\b(o|a|os|as|de|do|é|são|com|para|em|eu|você|nós)\b/i,
  nl: /\b(het|een|en|van|ik|je|dat|niet|met|voor|zijn|deze)\b/i,
  pl: /\b(się|że|jest|nie|oraz|dla|jak|który|tylko|ależ)\b/i,
  sv: /\b(och|att|är|det|som|jag|för|inte|med|den|ett)\b/i,
  da: /\b(og|er|det|jeg|ikke|med|for|den|som|til|på)\b/i,
  cs: /\b(jsem|není|se|že|na|pro|jako|který|ale|tady)\b/i,
  ro: /\b(și|este|de|la|cu|un|nu|pe|să|pentru|într)\b/i,
  hr: /\b(je|se|da|za|su|ne|kao|koji|ali|ovo)\b/i,
  sk: /\b(som|nie|sa|že|na|pre|ako|ktorý|ale|tu)\b/i,
  sl: /\b(je|se|da|za|so|ne|kot|kateri|ampak|to)\b/i,
  hu: /\b(az|és|van|nem|hogy|egy|ez|már|csak|vagy)\b/i,
  fi: /\b(ja|on|ei|että|joka|kuin|ole|niin|mutta|tämä)\b/i,
  et: /\b(ja|on|ei|see|et|kui|oli|nii|aga|kõik)\b/i,
  lv: /\b(un|ir|ar|par|tas|to|no|kas|bet|šis)\b/i,
  lt: /\b(ir|yra|su|kad|tai|dėl|kaip|bet|šis|tik)\b/i,
  ga: /\b(agus|sa|le|go|tá|ní|ar|seo|nó|ach)\b/i,
  mt: /\b(il|li|hu|ma|dan|kif|biex|imma|jew|qed)\b/i,
  el: /(και|είναι|με|για|να|θα|το|σε|δεν|που|αυτό)/i,
  bg: /(и|на|се|да|то|за|са|не|че|това|като)/i,
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

  preserve.forEach((word, i) => {
    const placeholder = `__TRIMLY_PRESERVE_${i}__`
    placeholders.set(placeholder, word)
    guarded = guarded.replace(
      new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      placeholder,
    )
  })

  const patternsMatched: string[] = []
  let result = guarded

  for (const p of patterns) {
    const before = result
    result = result.replace(p.pattern, p.replace)
    if (result !== before) patternsMatched.push(p.id)
  }

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
