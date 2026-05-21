import type { FillerPattern } from '../types.js'

export const DE_FILLER_PATTERNS: FillerPattern[] = [
  { id: 'de-please-1', pattern: /\bbitte\b/gi, replace: '' },
  { id: 'de-please-2', pattern: /\bwenn möglich\b/gi, replace: '' },
  { id: 'de-thanks-advance', pattern: /\bvielen Dank im Voraus\b/gi, replace: '' },
  { id: 'de-could-you-1', pattern: /\bkönntest du\b/gi, replace: '' },
  { id: 'de-could-you-2', pattern: /\bkönnten Sie\b/gi, replace: '' },
  { id: 'de-wondering', pattern: /\bich frage mich, ob\b/gi, replace: '' },
  { id: 'de-greet', pattern: /^(hallo|guten tag|guten morgen|guten abend)[,!]?\s*/gi, replace: '' },
  { id: 'de-basically', pattern: /\beigentlich\b/gi, replace: '' },
  { id: 'de-actually', pattern: /\bim Grunde\b/gi, replace: '' },
  { id: 'de-filler-1', pattern: /\bsozusagen\b/gi, replace: '' },
  { id: 'de-filler-2', pattern: /\birgendwie\b/gi, replace: '' },
  { id: 'de-dont-hesitate', pattern: /\bzögere nicht\b/gi, replace: '' },
  { id: 'de-hope', pattern: /\bich hoffe, das hilft\b/gi, replace: '' },
  { id: 'de-kindly', pattern: /\bfreundlicherweise\b/gi, replace: '' },
  { id: 'de-if-possible', pattern: /\bfalls möglich\b/gi, replace: '' },
]
