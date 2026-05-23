import type { FillerPattern } from '../types.js'

export const CS_FILLER_PATTERNS: FillerPattern[] = [
  { id: 'cs-please', pattern: /(?<![\p{L}])prosím(?![\p{L}])/giu, replace: '' },
  { id: 'cs-thanks-advance', pattern: /(?<![\p{L}])předem děkuji(?![\p{L}])/giu, replace: '' },
  {
    id: 'cs-could-you',
    pattern: /(?<![\p{L}])(mohl bys|mohla bys|mohli byste)(?![\p{L}])/giu,
    replace: '',
  },
  {
    id: 'cs-if-possible',
    pattern: /(?<![\p{L}])(pokud možno|je-li to možné)(?![\p{L}])/giu,
    replace: '',
  },
  {
    id: 'cs-would-like',
    pattern: /(?<![\p{L}])(chtěl bych|chtěla bych)(?![\p{L}])/giu,
    replace: '',
  },
  { id: 'cs-dont-hesitate', pattern: /(?<![\p{L}])neváhej(te)?(?![\p{L}])/giu, replace: '' },
  { id: 'cs-asap', pattern: /(?<![\p{L}])co nejdříve(?![\p{L}])/giu, replace: '' },
  { id: 'cs-greet', pattern: /^(ahoj|dobrý den|čau)[,!]?\s*/giu, replace: '' },
  { id: 'cs-actually', pattern: /(?<![\p{L}])vlastně(?![\p{L}])/giu, replace: '' },
  { id: 'cs-just', pattern: /(?<![\p{L}])prostě(?![\p{L}])/giu, replace: '' },
  { id: 'cs-really', pattern: /(?<![\p{L}])opravdu(?![\p{L}])/giu, replace: '' },
]
