import type { FillerPattern } from '../types.js'

export const LV_FILLER_PATTERNS: FillerPattern[] = [
  { id: 'lv-please', pattern: /(?<![\p{L}])lūdzu(?![\p{L}])/giu, replace: '' },
  {
    id: 'lv-thanks-advance',
    pattern: /(?<![\p{L}])paldies jau iepriekš(?![\p{L}])/giu,
    replace: '',
  },
  { id: 'lv-could-you', pattern: /(?<![\p{L}])vai tu varētu(?![\p{L}])/giu, replace: '' },
  { id: 'lv-if-possible', pattern: /(?<![\p{L}])ja iespējams(?![\p{L}])/giu, replace: '' },
  { id: 'lv-would-like', pattern: /(?<![\p{L}])es vēlētos(?![\p{L}])/giu, replace: '' },
  { id: 'lv-dont-hesitate', pattern: /(?<![\p{L}])nevilcinies(?![\p{L}])/giu, replace: '' },
  { id: 'lv-asap', pattern: /(?<![\p{L}])pēc iespējas ātrāk(?![\p{L}])/giu, replace: '' },
  { id: 'lv-greet', pattern: /^(sveiki|čau|labdien)[,!]?\s*/giu, replace: '' },
  { id: 'lv-actually', pattern: /(?<![\p{L}])patiesībā(?![\p{L}])/giu, replace: '' },
  { id: 'lv-just', pattern: /(?<![\p{L}])vienkārši(?![\p{L}])/giu, replace: '' },
  { id: 'lv-really', pattern: /(?<![\p{L}])tiešām(?![\p{L}])/giu, replace: '' },
]
