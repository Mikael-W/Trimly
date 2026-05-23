import type { FillerPattern } from '../types.js'

export const PL_FILLER_PATTERNS: FillerPattern[] = [
  { id: 'pl-please', pattern: /(?<![\p{L}])proszę(?![\p{L}])/giu, replace: '' },
  { id: 'pl-thanks-advance', pattern: /(?<![\p{L}])z góry dziękuję(?![\p{L}])/giu, replace: '' },
  {
    id: 'pl-could-you',
    pattern: /(?<![\p{L}])czy (mógłbyś|mogłabyś|moglibyście)(?![\p{L}])/giu,
    replace: '',
  },
  {
    id: 'pl-if-possible',
    pattern: /(?<![\p{L}])(jeśli to możliwe|w miarę możliwości)(?![\p{L}])/giu,
    replace: '',
  },
  { id: 'pl-would-like', pattern: /(?<![\p{L}])(chciałbym|chciałabym)(?![\p{L}])/giu, replace: '' },
  { id: 'pl-dont-hesitate', pattern: /(?<![\p{L}])nie wahaj się(?![\p{L}])/giu, replace: '' },
  { id: 'pl-asap', pattern: /(?<![\p{L}])jak najszybciej(?![\p{L}])/giu, replace: '' },
  { id: 'pl-greet', pattern: /^(cześć|witaj|dzień dobry|hej)[,!]?\s*/giu, replace: '' },
  { id: 'pl-actually', pattern: /(?<![\p{L}])właściwie(?![\p{L}])/giu, replace: '' },
  { id: 'pl-just', pattern: /(?<![\p{L}])po prostu(?![\p{L}])/giu, replace: '' },
  { id: 'pl-really', pattern: /(?<![\p{L}])naprawdę(?![\p{L}])/giu, replace: '' },
]
