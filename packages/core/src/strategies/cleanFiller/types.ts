export type SupportedLanguage = 'fr' | 'en' | 'es' | 'de' | 'it' | 'pt'

export interface FillerPattern {
  id: string
  pattern: RegExp
  replace: string
}

export interface CleanFillerOptions {
  languages?: SupportedLanguage[]
  mode?: 'detect' | 'apply'
  preserve?: string[]
  customPatterns?: FillerPattern[]
}

export interface CleanFillerResult {
  text: string
  applied: boolean
  tokensSaved: number
  patternsMatched: string[]
}
