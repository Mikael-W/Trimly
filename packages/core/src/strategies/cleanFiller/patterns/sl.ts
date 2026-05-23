import type { FillerPattern } from '../types.js'

export const SL_FILLER_PATTERNS: FillerPattern[] = [
  { id: 'sl-please', pattern: /(?<![\p{L}])prosim(?![\p{L}])/giu, replace: '' },
  { id: 'sl-thanks-advance', pattern: /(?<![\p{L}])vnaprej hvala(?![\p{L}])/giu, replace: '' },
  { id: 'sl-could-you', pattern: /(?<![\p{L}])ali bi lahko(?![\p{L}])/giu, replace: '' },
  { id: 'sl-if-possible', pattern: /(?<![\p{L}])če je mogoče(?![\p{L}])/giu, replace: '' },
  { id: 'sl-would-like', pattern: /(?<![\p{L}])(rad bi|rada bi)(?![\p{L}])/giu, replace: '' },
  { id: 'sl-dont-hesitate', pattern: /(?<![\p{L}])ne oklevaj(?![\p{L}])/giu, replace: '' },
  { id: 'sl-asap', pattern: /(?<![\p{L}])čim prej(?![\p{L}])/giu, replace: '' },
  { id: 'sl-greet', pattern: /^(živjo|pozdravljeni|dober dan)[,!]?\s*/giu, replace: '' },
  { id: 'sl-actually', pattern: /(?<![\p{L}])pravzaprav(?![\p{L}])/giu, replace: '' },
  { id: 'sl-just', pattern: /(?<![\p{L}])preprosto(?![\p{L}])/giu, replace: '' },
  { id: 'sl-really', pattern: /(?<![\p{L}])res(?![\p{L}])/giu, replace: '' },
]
