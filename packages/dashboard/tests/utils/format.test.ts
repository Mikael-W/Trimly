import { describe, expect, test } from 'vitest'
import { fmtRelTime, fmtTokens } from '../../utils/format'

const NOW = new Date('2025-06-01T12:00:00Z').getTime()

describe('Given fmtTokens', () => {
  describe('When called with a number below 1000', () => {
    test('Then returns the number as a plain string', () => {
      expect(fmtTokens(0)).toBe('0')
      expect(fmtTokens(42)).toBe('42')
      expect(fmtTokens(999)).toBe('999')
    })
  })

  describe('When called with a number in the thousands', () => {
    test('Then returns one decimal place with k suffix', () => {
      expect(fmtTokens(1000)).toBe('1.0k')
      expect(fmtTokens(1500)).toBe('1.5k')
      expect(fmtTokens(999_999)).toBe('1000.0k')
    })
  })

  describe('When called with a number in the millions', () => {
    test('Then returns one decimal place with M suffix', () => {
      expect(fmtTokens(1_000_000)).toBe('1.0M')
      expect(fmtTokens(2_500_000)).toBe('2.5M')
    })
  })
})

describe('Given fmtRelTime', () => {
  describe('When the timestamp is less than 1 minute ago', () => {
    test('Then returns "< 1m"', () => {
      expect(fmtRelTime(NOW - 30_000, NOW)).toBe('< 1m')
      expect(fmtRelTime(NOW, NOW)).toBe('< 1m')
    })
  })

  describe('When the timestamp is several minutes ago', () => {
    test('Then returns minutes with m suffix', () => {
      expect(fmtRelTime(NOW - 5 * 60_000, NOW)).toBe('5m')
      expect(fmtRelTime(NOW - 59 * 60_000, NOW)).toBe('59m')
    })
  })

  describe('When the timestamp is several hours ago', () => {
    test('Then returns hours with h suffix', () => {
      expect(fmtRelTime(NOW - 3 * 3_600_000, NOW)).toBe('3h')
      expect(fmtRelTime(NOW - 23 * 3_600_000, NOW)).toBe('23h')
    })
  })

  describe('When the timestamp is several days ago', () => {
    test('Then returns days with d suffix', () => {
      expect(fmtRelTime(NOW - 2 * 86_400_000, NOW)).toBe('2d')
      expect(fmtRelTime(NOW - 30 * 86_400_000, NOW)).toBe('30d')
    })
  })
})
