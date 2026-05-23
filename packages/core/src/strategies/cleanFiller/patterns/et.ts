import type { FillerPattern } from '../types.js'

export const ET_FILLER_PATTERNS: FillerPattern[] = [
  { id: 'et-please', pattern: /(?<![\p{L}])palun(?![\p{L}])/giu, replace: '' },
  {
    id: 'et-thanks-advance',
    pattern: /(?<![\p{L}])(tänan ette|ette tänades)(?![\p{L}])/giu,
    replace: '',
  },
  { id: 'et-could-you', pattern: /(?<![\p{L}])kas sa saaksid(?![\p{L}])/giu, replace: '' },
  { id: 'et-if-possible', pattern: /(?<![\p{L}])kui võimalik(?![\p{L}])/giu, replace: '' },
  { id: 'et-would-like', pattern: /(?<![\p{L}])ma sooviksin(?![\p{L}])/giu, replace: '' },
  { id: 'et-dont-hesitate', pattern: /(?<![\p{L}])ära kõhkle(?![\p{L}])/giu, replace: '' },
  { id: 'et-asap', pattern: /(?<![\p{L}])niipea kui võimalik(?![\p{L}])/giu, replace: '' },
  { id: 'et-greet', pattern: /^(tere|hei)[,!]?\s*/giu, replace: '' },
  { id: 'et-actually', pattern: /(?<![\p{L}])tegelikult(?![\p{L}])/giu, replace: '' },
  { id: 'et-just', pattern: /(?<![\p{L}])lihtsalt(?![\p{L}])/giu, replace: '' },
  { id: 'et-really', pattern: /(?<![\p{L}])tõesti(?![\p{L}])/giu, replace: '' },
]
