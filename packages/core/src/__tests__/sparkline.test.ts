import { describe, test, expect } from 'vitest'
import { formatSparkline } from '../utils/sparkline.js'

describe('Given an array of numeric values', () => {
  describe('When formatSparkline is called with normal values', () => {
    test('Then it returns a string with one char per value', () => {
      const result = formatSparkline([1, 2, 3, 4, 5])
      expect(result).toHaveLength(5)
    })

    test('Then the last char is the tallest block when max is last', () => {
      const result = formatSparkline([1, 2, 8])
      expect(result[2]).toBe('█')
    })

    test('Then the first char is the lowest block when min is first', () => {
      const result = formatSparkline([0, 5, 10])
      expect(result[0]).toBe('▁')
    })
  })

  describe('When all values are zero', () => {
    test('Then it returns all ▁', () => {
      const result = formatSparkline([0, 0, 0])
      expect(result).toBe('▁▁▁')
    })
  })

  describe('When array is empty', () => {
    test('Then it returns an empty string', () => {
      expect(formatSparkline([])).toBe('')
    })
  })
})
