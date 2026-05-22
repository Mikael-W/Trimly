import { describe, expect, test } from 'vitest'
import { buildChartPath } from '../../utils/chart'

describe('Given buildChartPath', () => {
  describe('When called with an empty array', () => {
    test('Then returns null', () => {
      expect(buildChartPath([], 600, 100)).toBeNull()
    })
  })

  describe('When called with a single point', () => {
    test('Then returns null', () => {
      expect(buildChartPath([{ cost: 1 }], 600, 100)).toBeNull()
    })
  })

  describe('When called with two points', () => {
    test('Then returns an object with line and area strings', () => {
      const result = buildChartPath([{ cost: 1 }, { cost: 2 }], 600, 100)
      expect(result).not.toBeNull()
      expect(typeof result?.line).toBe('string')
      expect(typeof result?.area).toBe('string')
    })

    test('Then the line starts with an M command at x=0', () => {
      const result = buildChartPath([{ cost: 1 }, { cost: 2 }], 600, 100)
      expect(result?.line).toMatch(/^M 0 /)
    })

    test('Then the line ends at chart width', () => {
      const result = buildChartPath([{ cost: 1 }, { cost: 2 }], 600, 100)
      expect(result?.line).toContain('600')
    })

    test('Then the area closes with Z', () => {
      const result = buildChartPath([{ cost: 1 }, { cost: 2 }], 600, 100)
      expect(result?.area).toMatch(/Z$/)
    })
  })

  describe('When all points have the same cost', () => {
    test('Then the path is still generated without NaN', () => {
      const result = buildChartPath([{ cost: 5 }, { cost: 5 }, { cost: 5 }], 600, 100)
      expect(result).not.toBeNull()
      expect(result?.line).not.toContain('NaN')
    })
  })

  describe('When called with many points', () => {
    test('Then the line contains one C command per segment', () => {
      const pts = [1, 2, 3, 4, 5].map((cost) => ({ cost }))
      const result = buildChartPath(pts, 600, 100)
      const segments = result?.line.split(' C ').length ?? 0
      expect(segments).toBe(pts.length)
    })
  })
})
