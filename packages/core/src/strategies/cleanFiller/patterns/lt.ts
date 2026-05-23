import type { FillerPattern } from '../types.js'

export const LT_FILLER_PATTERNS: FillerPattern[] = [
  { id: 'lt-please', pattern: /(?<![\p{L}])prašau(?![\p{L}])/giu, replace: '' },
  { id: 'lt-thanks-advance', pattern: /(?<![\p{L}])iš anksto dėkoju(?![\p{L}])/giu, replace: '' },
  {
    id: 'lt-could-you',
    pattern: /(?<![\p{L}])(ar galėtum|ar galėtumėte)(?![\p{L}])/giu,
    replace: '',
  },
  { id: 'lt-if-possible', pattern: /(?<![\p{L}])jei įmanoma(?![\p{L}])/giu, replace: '' },
  { id: 'lt-would-like', pattern: /(?<![\p{L}])norėčiau(?![\p{L}])/giu, replace: '' },
  { id: 'lt-dont-hesitate', pattern: /(?<![\p{L}])nedvejok(?![\p{L}])/giu, replace: '' },
  { id: 'lt-asap', pattern: /(?<![\p{L}])kuo greičiau(?![\p{L}])/giu, replace: '' },
  { id: 'lt-greet', pattern: /^(labas|sveiki|laba diena)[,!]?\s*/giu, replace: '' },
  { id: 'lt-actually', pattern: /(?<![\p{L}])iš tikrųjų(?![\p{L}])/giu, replace: '' },
  { id: 'lt-just', pattern: /(?<![\p{L}])tiesiog(?![\p{L}])/giu, replace: '' },
  { id: 'lt-really', pattern: /(?<![\p{L}])tikrai(?![\p{L}])/giu, replace: '' },
]
