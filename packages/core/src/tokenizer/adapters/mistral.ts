/** Mistral uses a SentencePiece tokenizer — heuristic approximation. */
export function countTokensMistral(text: string): number {
  if (!text) return 0
  // Mistral tokenization is close to ~3.5 chars/token for European text
  return Math.ceil(text.length / 3.5)
}
