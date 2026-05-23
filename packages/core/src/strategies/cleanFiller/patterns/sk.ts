import type { FillerPattern } from '../types.js'

export const SK_FILLER_PATTERNS: FillerPattern[] = [
  { id: 'sk-please', pattern: /(?<![\p{L}])prosím(?![\p{L}])/giu, replace: '' },
  { id: 'sk-thanks-advance', pattern: /(?<![\p{L}])vopred ďakujem(?![\p{L}])/giu, replace: '' },
  {
    id: 'sk-could-you',
    pattern: /(?<![\p{L}])(mohol by si|mohla by si|mohli by ste)(?![\p{L}])/giu,
    replace: '',
  },
  { id: 'sk-if-possible', pattern: /(?<![\p{L}])ak je to možné(?![\p{L}])/giu, replace: '' },
  {
    id: 'sk-would-like',
    pattern: /(?<![\p{L}])(chcel by som|chcela by som)(?![\p{L}])/giu,
    replace: '',
  },
  { id: 'sk-dont-hesitate', pattern: /(?<![\p{L}])neváhaj(te)?(?![\p{L}])/giu, replace: '' },
  { id: 'sk-asap', pattern: /(?<![\p{L}])čo najskôr(?![\p{L}])/giu, replace: '' },
  { id: 'sk-greet', pattern: /^(ahoj|dobrý deň|čau)[,!]?\s*/giu, replace: '' },
  { id: 'sk-actually', pattern: /(?<![\p{L}])vlastne(?![\p{L}])/giu, replace: '' },
  { id: 'sk-just', pattern: /(?<![\p{L}])jednoducho(?![\p{L}])/giu, replace: '' },
  { id: 'sk-really', pattern: /(?<![\p{L}])naozaj(?![\p{L}])/giu, replace: '' },
]
