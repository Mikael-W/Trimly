export function countTokensMistral(text: string): number {
  if (!text) return 0
  return Math.ceil(text.length / 3.5)
}
