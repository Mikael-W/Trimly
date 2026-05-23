import type { FillerPattern } from '../types.js'

export const DA_FILLER_PATTERNS: FillerPattern[] = [
  { id: 'da-please', pattern: /(?<![\p{L}])venligst(?![\p{L}])/giu, replace: '' },
  { id: 'da-thanks-advance', pattern: /(?<![\p{L}])på forhånd tak(?![\p{L}])/giu, replace: '' },
  { id: 'da-could-you', pattern: /(?<![\p{L}])kunne du(?![\p{L}])/giu, replace: '' },
  { id: 'da-if-possible', pattern: /(?<![\p{L}])hvis muligt(?![\p{L}])/giu, replace: '' },
  { id: 'da-would-like', pattern: /(?<![\p{L}])jeg vil gerne(?![\p{L}])/giu, replace: '' },
  { id: 'da-dont-hesitate', pattern: /(?<![\p{L}])tøv ikke med at(?![\p{L}])/giu, replace: '' },
  { id: 'da-asap', pattern: /(?<![\p{L}])hurtigst muligt(?![\p{L}])/giu, replace: '' },
  { id: 'da-greet', pattern: /^(hej|hallo|halløj|dav)[,!]?\s*/giu, replace: '' },
  { id: 'da-actually', pattern: /(?<![\p{L}])faktisk(?![\p{L}])/giu, replace: '' },
  { id: 'da-just', pattern: /(?<![\p{L}])bare(?![\p{L}])/giu, replace: '' },
  { id: 'da-really', pattern: /(?<![\p{L}])virkelig(?![\p{L}])/giu, replace: '' },
]
