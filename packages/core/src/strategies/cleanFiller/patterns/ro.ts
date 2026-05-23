import type { FillerPattern } from '../types.js'

export const RO_FILLER_PATTERNS: FillerPattern[] = [
  { id: 'ro-please', pattern: /(?<![\p{L}])(vă rog|te rog)(?![\p{L}])/giu, replace: '' },
  {
    id: 'ro-thanks-advance',
    pattern: /(?<![\p{L}])(vă mulțumesc anticipat|mulțumesc anticipat)(?![\p{L}])/giu,
    replace: '',
  },
  { id: 'ro-could-you', pattern: /(?<![\p{L}])(ai putea|ați putea)(?![\p{L}])/giu, replace: '' },
  {
    id: 'ro-if-possible',
    pattern: /(?<![\p{L}])(dacă este posibil|dacă se poate)(?![\p{L}])/giu,
    replace: '',
  },
  { id: 'ro-would-like', pattern: /(?<![\p{L}])(aș dori|aș vrea)(?![\p{L}])/giu, replace: '' },
  { id: 'ro-dont-hesitate', pattern: /(?<![\p{L}])nu ezita să(?![\p{L}])/giu, replace: '' },
  { id: 'ro-asap', pattern: /(?<![\p{L}])cât mai curând posibil(?![\p{L}])/giu, replace: '' },
  { id: 'ro-greet', pattern: /^(salut|bună ziua|bună)[,!]?\s*/giu, replace: '' },
  { id: 'ro-actually', pattern: /(?<![\p{L}])de fapt(?![\p{L}])/giu, replace: '' },
  { id: 'ro-just', pattern: /(?<![\p{L}])pur și simplu(?![\p{L}])/giu, replace: '' },
  { id: 'ro-really', pattern: /(?<![\p{L}])chiar(?![\p{L}])/giu, replace: '' },
]
