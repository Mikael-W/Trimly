import type { FillerPattern } from '../types.js'

export const BG_FILLER_PATTERNS: FillerPattern[] = [
  { id: 'bg-please', pattern: /(?<![\p{L}])моля(?![\p{L}])/giu, replace: '' },
  {
    id: 'bg-thanks-advance',
    pattern: /(?<![\p{L}])благодаря предварително(?![\p{L}])/giu,
    replace: '',
  },
  { id: 'bg-could-you', pattern: /(?<![\p{L}])(бихте ли|би ли)(?![\p{L}])/giu, replace: '' },
  { id: 'bg-if-possible', pattern: /(?<![\p{L}])ако е възможно(?![\p{L}])/giu, replace: '' },
  { id: 'bg-would-like', pattern: /(?<![\p{L}])(бих искал|бих искала)(?![\p{L}])/giu, replace: '' },
  { id: 'bg-dont-hesitate', pattern: /(?<![\p{L}])не се колебайте(?![\p{L}])/giu, replace: '' },
  { id: 'bg-asap', pattern: /(?<![\p{L}])възможно най-скоро(?![\p{L}])/giu, replace: '' },
  { id: 'bg-greet', pattern: /^(здравей|здравейте|добър ден)[,!]?\s*/giu, replace: '' },
  { id: 'bg-actually', pattern: /(?<![\p{L}])всъщност(?![\p{L}])/giu, replace: '' },
  { id: 'bg-just', pattern: /(?<![\p{L}])просто(?![\p{L}])/giu, replace: '' },
  { id: 'bg-really', pattern: /(?<![\p{L}])наистина(?![\p{L}])/giu, replace: '' },
]
