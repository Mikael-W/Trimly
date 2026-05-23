import type { FillerPattern } from '../types.js'

export const HU_FILLER_PATTERNS: FillerPattern[] = [
  { id: 'hu-please', pattern: /(?<![\p{L}])(kérlek|kérem)(?![\p{L}])/giu, replace: '' },
  { id: 'hu-thanks-advance', pattern: /(?<![\p{L}])előre is köszönöm(?![\p{L}])/giu, replace: '' },
  { id: 'hu-could-you', pattern: /(?<![\p{L}])(tudnál|tudna)(?![\p{L}])/giu, replace: '' },
  {
    id: 'hu-if-possible',
    pattern: /(?<![\p{L}])(ha lehetséges|lehetőség szerint)(?![\p{L}])/giu,
    replace: '',
  },
  { id: 'hu-would-like', pattern: /(?<![\p{L}])szeretnék(?![\p{L}])/giu, replace: '' },
  { id: 'hu-dont-hesitate', pattern: /(?<![\p{L}])ne habozz(?![\p{L}])/giu, replace: '' },
  { id: 'hu-asap', pattern: /(?<![\p{L}])(amint lehetséges|mielőbb)(?![\p{L}])/giu, replace: '' },
  { id: 'hu-greet', pattern: /^(szia|helló|jó napot)[,!]?\s*/giu, replace: '' },
  { id: 'hu-actually', pattern: /(?<![\p{L}])tulajdonképpen(?![\p{L}])/giu, replace: '' },
  { id: 'hu-just', pattern: /(?<![\p{L}])egyszerűen(?![\p{L}])/giu, replace: '' },
  { id: 'hu-really', pattern: /(?<![\p{L}])tényleg(?![\p{L}])/giu, replace: '' },
]
