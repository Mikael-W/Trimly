import type { FillerPattern } from '../types.js'

export const SV_FILLER_PATTERNS: FillerPattern[] = [
  { id: 'sv-please', pattern: /(?<![\p{L}])(snälla|vänligen)(?![\p{L}])/giu, replace: '' },
  { id: 'sv-thanks-advance', pattern: /(?<![\p{L}])tack på förhand(?![\p{L}])/giu, replace: '' },
  { id: 'sv-could-you', pattern: /(?<![\p{L}])skulle du kunna(?![\p{L}])/giu, replace: '' },
  { id: 'sv-if-possible', pattern: /(?<![\p{L}])om möjligt(?![\p{L}])/giu, replace: '' },
  { id: 'sv-would-like', pattern: /(?<![\p{L}])jag skulle vilja(?![\p{L}])/giu, replace: '' },
  { id: 'sv-dont-hesitate', pattern: /(?<![\p{L}])tveka inte att(?![\p{L}])/giu, replace: '' },
  { id: 'sv-asap', pattern: /(?<![\p{L}])så snart som möjligt(?![\p{L}])/giu, replace: '' },
  { id: 'sv-greet', pattern: /^(hej|hallå|tjena)[,!]?\s*/giu, replace: '' },
  { id: 'sv-actually', pattern: /(?<![\p{L}])faktiskt(?![\p{L}])/giu, replace: '' },
  { id: 'sv-just', pattern: /(?<![\p{L}])bara(?![\p{L}])/giu, replace: '' },
  { id: 'sv-really', pattern: /(?<![\p{L}])verkligen(?![\p{L}])/giu, replace: '' },
]
