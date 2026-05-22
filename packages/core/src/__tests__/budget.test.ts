import { describe, test, expect } from 'vitest'
import { computeBudgetETA, computeBudgetPct, getDailyAverage } from '../utils/budget.js'
import type { DailyStats } from '../utils/budget.js'

const makeDailyStats = (costs: number[]): DailyStats[] =>
  costs.map((cost, i) => ({
    date: `2026-05-${String(22 - i).padStart(2, '0')}`,
    cost,
    saved: cost * 0.1,
    tokens: cost * 1000,
  }))

describe('Given a monthly budget and current spending', () => {
  describe('When computeBudgetETA is called with normal values', () => {
    test('Then it returns the number of days before budget is exhausted', () => {
      // $15 spent of $30, daily avg = $1 → 15 days left
      const daily = makeDailyStats([1, 1, 1, 1, 1, 1, 1])
      const avg = getDailyAverage(daily)
      const eta = computeBudgetETA(15, 30, avg)
      expect(eta).toBe(15)
    })

    test('Then it returns 0 when budget is already exceeded', () => {
      expect(computeBudgetETA(35, 30, 1)).toBe(0)
    })

    test('Then it returns 999 when daily average is zero', () => {
      expect(computeBudgetETA(5, 30, 0)).toBe(999)
    })
  })

  describe('When computeBudgetPct is called', () => {
    test('Then it returns the percentage of budget used', () => {
      expect(computeBudgetPct(15, 30)).toBe(50)
    })

    test('Then it caps at 100% when over budget', () => {
      expect(computeBudgetPct(45, 30)).toBe(100)
    })

    test('Then it returns 0 when budget is 0', () => {
      expect(computeBudgetPct(10, 0)).toBe(0)
    })
  })

  describe('When getDailyAverage is called with 7 days of data', () => {
    test('Then it returns the mean cost per day', () => {
      const daily = makeDailyStats([1, 2, 3, 4, 5, 6, 7])
      expect(getDailyAverage(daily)).toBe(4) // (1+2+3+4+5+6+7)/7 = 28/7 = 4
    })

    test('Then it returns 0 when stats array is empty', () => {
      expect(getDailyAverage([])).toBe(0)
    })
  })
})
