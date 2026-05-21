import type { FillerPattern } from '../types.js'

export const PT_FILLER_PATTERNS: FillerPattern[] = [
  { id: 'pt-please-1', pattern: /\bpor favor\b/gi, replace: '' },
  { id: 'pt-please-2', pattern: /\bpfv\b/gi, replace: '' },
  { id: 'pt-thanks-advance', pattern: /\bobrigado(a)? antecipadamente\b/gi, replace: '' },
  { id: 'pt-could-you-1', pattern: /\bpoderia(s)?\b/gi, replace: '' },
  { id: 'pt-could-you-2', pattern: /\bpodes\b/gi, replace: '' },
  { id: 'pt-wondering', pattern: /\bestava a perguntar-me se\b/gi, replace: '' },
  { id: 'pt-greet', pattern: /^(olá|oi|bom dia|boa tarde|boa noite)[,!]?\s*/gi, replace: '' },
  { id: 'pt-basically', pattern: /\bbasicamente\b/gi, replace: '' },
  { id: 'pt-actually', pattern: /\bna verdade\b/gi, replace: '' },
  { id: 'pt-filler-1', pattern: /\bpronto\b/gi, replace: '' },
  { id: 'pt-filler-2', pattern: /\bentão\b/gi, replace: '' },
  { id: 'pt-dont-hesitate', pattern: /\bnão hesite em\b/gi, replace: '' },
  { id: 'pt-if-possible', pattern: /\bse possível\b/gi, replace: '' },
  { id: 'pt-kindly', pattern: /\bamavelmente\b/gi, replace: '' },
  { id: 'pt-filler-3', pattern: /\bclaro\b/gi, replace: '' },
]
