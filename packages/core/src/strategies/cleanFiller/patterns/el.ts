import type { FillerPattern } from '../types.js'

export const EL_FILLER_PATTERNS: FillerPattern[] = [
  { id: 'el-please', pattern: /(?<![\p{L}])παρακαλώ(?![\p{L}])/giu, replace: '' },
  {
    id: 'el-thanks-advance',
    pattern: /(?<![\p{L}])ευχαριστώ εκ των προτέρων(?![\p{L}])/giu,
    replace: '',
  },
  {
    id: 'el-could-you',
    pattern: /(?<![\p{L}])(θα μπορούσες|θα μπορούσατε)(?![\p{L}])/giu,
    replace: '',
  },
  {
    id: 'el-if-possible',
    pattern: /(?<![\p{L}])(αν είναι δυνατόν|ει δυνατόν)(?![\p{L}])/giu,
    replace: '',
  },
  { id: 'el-would-like', pattern: /(?<![\p{L}])θα ήθελα(?![\p{L}])/giu, replace: '' },
  { id: 'el-dont-hesitate', pattern: /(?<![\p{L}])μη διστάσεις(?![\p{L}])/giu, replace: '' },
  { id: 'el-asap', pattern: /(?<![\p{L}])το συντομότερο δυνατό(?![\p{L}])/giu, replace: '' },
  { id: 'el-greet', pattern: /^(γεια σου|γεια|καλημέρα)[,!]?\s*/giu, replace: '' },
  { id: 'el-actually', pattern: /(?<![\p{L}])στην πραγματικότητα(?![\p{L}])/giu, replace: '' },
  { id: 'el-just', pattern: /(?<![\p{L}])απλώς(?![\p{L}])/giu, replace: '' },
  { id: 'el-really', pattern: /(?<![\p{L}])πραγματικά(?![\p{L}])/giu, replace: '' },
]
