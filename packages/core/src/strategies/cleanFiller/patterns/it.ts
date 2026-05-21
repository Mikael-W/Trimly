import type { FillerPattern } from '../types.js'

export const IT_FILLER_PATTERNS: FillerPattern[] = [
  { id: 'it-please-1', pattern: /\bper favore\b/gi, replace: '' },
  { id: 'it-please-2', pattern: /\bper piacere\b/gi, replace: '' },
  { id: 'it-thanks-advance', pattern: /\bgrazie in anticipo\b/gi, replace: '' },
  { id: 'it-could-you-1', pattern: /\bpotresti\b/gi, replace: '' },
  { id: 'it-could-you-2', pattern: /\bpotrebbe\b/gi, replace: '' },
  { id: 'it-wondering', pattern: /\bmi chiedevo se\b/gi, replace: '' },
  { id: 'it-greet', pattern: /^(ciao|salve|buongiorno|buonasera)[,!]?\s*/gi, replace: '' },
  { id: 'it-basically', pattern: /\bfondamentalmente\b/gi, replace: '' },
  { id: 'it-actually', pattern: /\bin realtà\b/gi, replace: '' },
  { id: 'it-filler-1', pattern: /\binsomma\b/gi, replace: '' },
  { id: 'it-filler-2', pattern: /\bquindi\b/gi, replace: '' },
  { id: 'it-dont-hesitate', pattern: /\bnon esitare a\b/gi, replace: '' },
  { id: 'it-if-possible', pattern: /\bse possibile\b/gi, replace: '' },
  { id: 'it-kindly', pattern: /\bgentilmente\b/gi, replace: '' },
  { id: 'it-filler-3', pattern: /\becco\b/gi, replace: '' },
]
