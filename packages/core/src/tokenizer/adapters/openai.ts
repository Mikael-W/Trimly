import { getEncoding, type TiktokenEncoding } from 'js-tiktoken'

const _encodings = new Map<string, ReturnType<typeof getEncoding>>()

function getEncoding_(model: string): ReturnType<typeof getEncoding> {
  const enc: TiktokenEncoding = model.startsWith('gpt-4o') ? 'o200k_base' : 'cl100k_base'
  if (!_encodings.has(enc)) {
    _encodings.set(enc, getEncoding(enc))
  }
  return _encodings.get(enc)!
}

export function countTokensOpenAI(model: string, text: string): number {
  if (!text) return 0
  try {
    const enc = getEncoding_(model)
    return enc.encode(text).length
  } catch {
    return Math.ceil(text.length / 4)
  }
}
