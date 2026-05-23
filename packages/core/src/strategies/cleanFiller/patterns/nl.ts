import type { FillerPattern } from '../types.js'

export const NL_FILLER_PATTERNS: FillerPattern[] = [
  { id: 'nl-please', pattern: /(?<![\p{L}])(alsjeblieft|alstublieft)(?![\p{L}])/giu, replace: '' },
  {
    id: 'nl-thanks-advance',
    pattern: /(?<![\p{L}])(bij voorbaat dank|alvast bedankt)(?![\p{L}])/giu,
    replace: '',
  },
  {
    id: 'nl-could-you',
    pattern: /(?<![\p{L}])zou (je|u) (alsjeblieft |alstublieft )?kunnen(?![\p{L}])/giu,
    replace: '',
  },
  {
    id: 'nl-if-possible',
    pattern: /(?<![\p{L}])(indien mogelijk|als het mogelijk is)(?![\p{L}])/giu,
    replace: '',
  },
  { id: 'nl-would-like', pattern: /(?<![\p{L}])ik zou graag( willen)?(?![\p{L}])/giu, replace: '' },
  { id: 'nl-feel-free', pattern: /(?<![\p{L}])voel je vrij om(?![\p{L}])/giu, replace: '' },
  { id: 'nl-dont-hesitate', pattern: /(?<![\p{L}])aarzel niet om(?![\p{L}])/giu, replace: '' },
  { id: 'nl-asap', pattern: /(?<![\p{L}])zo snel mogelijk(?![\p{L}])/giu, replace: '' },
  { id: 'nl-greet', pattern: /^(hallo|hoi|hé|hey)[,!]?\s*/giu, replace: '' },
  { id: 'nl-actually', pattern: /(?<![\p{L}])eigenlijk(?![\p{L}])/giu, replace: '' },
  { id: 'nl-just', pattern: /(?<![\p{L}])gewoon(?![\p{L}])/giu, replace: '' },
]
