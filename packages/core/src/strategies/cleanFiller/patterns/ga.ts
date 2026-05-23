import type { FillerPattern } from '../types.js'

export const GA_FILLER_PATTERNS: FillerPattern[] = [
  { id: 'ga-please', pattern: /(?<![\p{L}])le do thoil(?![\p{L}])/giu, replace: '' },
  {
    id: 'ga-thanks-advance',
    pattern: /(?<![\p{L}])go raibh maith agat roimh ré(?![\p{L}])/giu,
    replace: '',
  },
  { id: 'ga-could-you', pattern: /(?<![\p{L}])an bhféadfá(?![\p{L}])/giu, replace: '' },
  { id: 'ga-if-possible', pattern: /(?<![\p{L}])más féidir(?![\p{L}])/giu, replace: '' },
  { id: 'ga-would-like', pattern: /(?<![\p{L}])ba mhaith liom(?![\p{L}])/giu, replace: '' },
  { id: 'ga-dont-hesitate', pattern: /(?<![\p{L}])ná bíodh leisce ort(?![\p{L}])/giu, replace: '' },
  { id: 'ga-asap', pattern: /(?<![\p{L}])a luaithe is féidir(?![\p{L}])/giu, replace: '' },
  { id: 'ga-greet', pattern: /^(dia duit|haigh)[,!]?\s*/giu, replace: '' },
  { id: 'ga-really', pattern: /(?<![\p{L}])i ndáiríre(?![\p{L}])/giu, replace: '' },
  { id: 'ga-just', pattern: /(?<![\p{L}])díreach(?![\p{L}])/giu, replace: '' },
]
