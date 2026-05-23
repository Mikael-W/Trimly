export interface CodeBlock {
  tokens: number
  lines: number
  preview: string
}

export interface PromptAnalysis {
  totalTokens: number
  codeBlocks: CodeBlock[]
  codeTokens: number
  codePct: number
  stackTraceLines: number
  looksLikeLog: boolean
  isHeavy: boolean
  heavyReason: 'code' | 'log' | 'volume' | null
  tip: string | null
}

const HEAVY_TOKENS = 500
const HEAVY_CODE_PCT = 40
const LOG_LINE_MIN = 5

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

export function reducePrompt(text: string, analysis: PromptAnalysis): string {
  if (analysis.heavyReason === 'log') {
    return text.replace(
      /((?:[\w]*Error|Exception|Warning|Traceback)[^\n]*\n)((?:[ \t]+at [^\n]*\n?)*)/g,
      (_match, errorLine: string, stackLines: string) => {
        const frames = stackLines.split('\n').filter(Boolean)
        const userFrames = frames.filter(
          (f) =>
            !f.includes('node_modules') && !f.includes('node:internal') && !f.includes('node:'),
        )
        const kept = userFrames.slice(0, 3)
        const removed = frames.length - kept.length
        const suffix = removed > 0 ? `\n    ... (${removed} frames node_modules omises)\n` : '\n'
        return errorLine + kept.join('\n') + suffix
      },
    )
  }

  if (analysis.heavyReason === 'code') {
    return text.replace(/```([\w]*)\n([\s\S]*?)```/g, (_match, lang: string, content: string) => {
      const lines = content.split('\n')
      if (lines.length <= 25) return _match
      const kept = [
        ...lines.slice(0, 20),
        `// ... (${lines.length - 25} lignes supprimées)`,
        ...lines.slice(-5),
      ]
      return `\`\`\`${lang}\n${kept.join('\n')}\`\`\``
    })
  }

  return text
}

export function analyzePrompt(text: string, totalTokens: number): PromptAnalysis {
  const codeBlockMatches = [...text.matchAll(/```[\s\S]*?```/g)]
  const codeBlocks: CodeBlock[] = codeBlockMatches.map((m) => ({
    tokens: estimateTokens(m[0]),
    lines: m[0].split('\n').length,
    preview: m[0].slice(0, 60).replace(/\n/g, '↵'),
  }))
  const codeTokens = codeBlocks.reduce((s, b) => s + b.tokens, 0)
  const codePct = totalTokens > 0 ? Math.round((codeTokens / totalTokens) * 100) : 0

  const lines = text.split('\n')
  const stackTraceLines = lines.filter((l) =>
    /^\s*(at |Error:|TypeError:|ReferenceError:|SyntaxError:|Warning:|Exception|Traceback|\w+Error:|\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/.test(
      l,
    ),
  ).length
  const looksLikeLog = stackTraceLines >= LOG_LINE_MIN

  const isHeavy = totalTokens >= HEAVY_TOKENS

  let heavyReason: PromptAnalysis['heavyReason'] = null
  let tip: string | null = null

  if (codePct >= HEAVY_CODE_PCT && codeTokens > 100) {
    heavyReason = 'code'
    const blockCount = codeBlocks.length
    tip = `${codeTokens} tokens (${codePct}%) sont du code (${blockCount} bloc${blockCount > 1 ? 's' : ''}). Colle uniquement les parties pertinentes.`
  } else if (looksLikeLog) {
    heavyReason = 'log'
    tip = `Stack trace / log détecté (${stackTraceLines} lignes). Colle uniquement les 10 dernières lignes pour économiser des tokens.`
  } else if (isHeavy) {
    heavyReason = 'volume'
    tip = `Prompt lourd (${totalTokens} tokens). Scinde en questions plus courtes pour réduire le contexte envoyé.`
  }

  return {
    totalTokens,
    codeBlocks,
    codeTokens,
    codePct,
    stackTraceLines,
    looksLikeLog,
    isHeavy,
    heavyReason,
    tip,
  }
}
