import type { FillerPattern } from '../types.js'

export const FI_FILLER_PATTERNS: FillerPattern[] = [
  { id: 'fi-thanks-advance', pattern: /(?<![\p{L}])kiitos etukäteen(?![\p{L}])/giu, replace: '' },
  { id: 'fi-could-you', pattern: /(?<![\p{L}])voisitko(?![\p{L}])/giu, replace: '' },
  { id: 'fi-if-possible', pattern: /(?<![\p{L}])jos mahdollista(?![\p{L}])/giu, replace: '' },
  { id: 'fi-would-like', pattern: /(?<![\p{L}])haluaisin(?![\p{L}])/giu, replace: '' },
  { id: 'fi-dont-hesitate', pattern: /(?<![\p{L}])älä epäröi(?![\p{L}])/giu, replace: '' },
  { id: 'fi-asap', pattern: /(?<![\p{L}])mahdollisimman pian(?![\p{L}])/giu, replace: '' },
  { id: 'fi-greet', pattern: /^(hei|moi|terve)[,!]?\s*/giu, replace: '' },
  { id: 'fi-actually', pattern: /(?<![\p{L}])itse asiassa(?![\p{L}])/giu, replace: '' },
  { id: 'fi-just', pattern: /(?<![\p{L}])vain(?![\p{L}])/giu, replace: '' },
  { id: 'fi-really', pattern: /(?<![\p{L}])todella(?![\p{L}])/giu, replace: '' },
]
