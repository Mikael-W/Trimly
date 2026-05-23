import type { FillerPattern } from '../types.js'

export const MT_FILLER_PATTERNS: FillerPattern[] = [
  { id: 'mt-please', pattern: /(?<![\p{L}])jekk jogħġbok(?![\p{L}])/giu, replace: '' },
  { id: 'mt-thanks-advance', pattern: /(?<![\p{L}])grazzi bil-quddiem(?![\p{L}])/giu, replace: '' },
  { id: 'mt-could-you', pattern: /(?<![\p{L}])tista'(?![\p{L}])/giu, replace: '' },
  { id: 'mt-if-possible', pattern: /(?<![\p{L}])jekk possibbli(?![\p{L}])/giu, replace: '' },
  { id: 'mt-would-like', pattern: /(?<![\p{L}])nixtieq(?![\p{L}])/giu, replace: '' },
  { id: 'mt-asap', pattern: /(?<![\p{L}])malajr kemm jista' jkun(?![\p{L}])/giu, replace: '' },
  { id: 'mt-greet', pattern: /^(bonġu|ħello)[,!]?\s*/giu, replace: '' },
  { id: 'mt-actually', pattern: /(?<![\p{L}])fil-fatt(?![\p{L}])/giu, replace: '' },
  { id: 'mt-just', pattern: /(?<![\p{L}])biss(?![\p{L}])/giu, replace: '' },
  { id: 'mt-really', pattern: /(?<![\p{L}])tassew(?![\p{L}])/giu, replace: '' },
]
