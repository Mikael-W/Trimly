import type { FillerPattern } from '../types.js'

export const HR_FILLER_PATTERNS: FillerPattern[] = [
  { id: 'hr-please', pattern: /(?<![\p{L}])(molim vas|molim te|molim)(?![\p{L}])/giu, replace: '' },
  { id: 'hr-thanks-advance', pattern: /(?<![\p{L}])unaprijed hvala(?![\p{L}])/giu, replace: '' },
  { id: 'hr-could-you', pattern: /(?<![\p{L}])(možeš li|možete li)(?![\p{L}])/giu, replace: '' },
  { id: 'hr-if-possible', pattern: /(?<![\p{L}])ako je moguće(?![\p{L}])/giu, replace: '' },
  {
    id: 'hr-would-like',
    pattern: /(?<![\p{L}])(želio bih|željela bih)(?![\p{L}])/giu,
    replace: '',
  },
  { id: 'hr-dont-hesitate', pattern: /(?<![\p{L}])ne ustručavaj se(?![\p{L}])/giu, replace: '' },
  { id: 'hr-asap', pattern: /(?<![\p{L}])što je prije moguće(?![\p{L}])/giu, replace: '' },
  { id: 'hr-greet', pattern: /^(bok|pozdrav|dobar dan)[,!]?\s*/giu, replace: '' },
  { id: 'hr-actually', pattern: /(?<![\p{L}])zapravo(?![\p{L}])/giu, replace: '' },
  { id: 'hr-just', pattern: /(?<![\p{L}])jednostavno(?![\p{L}])/giu, replace: '' },
  { id: 'hr-really', pattern: /(?<![\p{L}])stvarno(?![\p{L}])/giu, replace: '' },
]
