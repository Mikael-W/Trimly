import type { FillerPattern } from '../types.js'

export const ES_FILLER_PATTERNS: FillerPattern[] = [
  { id: 'es-please-1', pattern: /\bpor favor\b/gi, replace: '' },
  { id: 'es-please-2', pattern: /\bporfavor\b/gi, replace: '' },
  { id: 'es-thanks-advance', pattern: /\bgracias de antemano\b/gi, replace: '' },
  { id: 'es-could-you-1', pattern: /\b(podrías|podría usted)\b/gi, replace: '' },
  { id: 'es-could-you-2', pattern: /\bpodrías decirme\b/gi, replace: '' },
  { id: 'es-wondering', pattern: /\bme preguntaba si\b/gi, replace: '' },
  {
    id: 'es-greet',
    pattern: /^(hola|buenos días|buenas tardes|buenas noches)[,!]?\s*/gi,
    replace: '',
  },
  { id: 'es-basically', pattern: /\bbásicamente\b/gi, replace: '' },
  { id: 'es-actually', pattern: /\ben realidad\b/gi, replace: '' },
  { id: 'es-if-possible', pattern: /\bsi es posible\b/gi, replace: '' },
  { id: 'es-dont-hesitate', pattern: /\bno dudes en\b/gi, replace: '' },
  { id: 'es-kindly', pattern: /\bamablemente\b/gi, replace: '' },
  { id: 'es-would-like', pattern: /\bquisiera pedirte que\b/gi, replace: '' },
  { id: 'es-filler-1', pattern: /\bo sea\b/gi, replace: '' },
  { id: 'es-filler-2', pattern: /\bbueno,\s/gi, replace: '' },
]
