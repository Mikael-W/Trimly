import { beforeEach, describe, expect, test } from 'vitest'
import { useTheme } from '../../composables/useTheme'

describe('Given the useTheme composable', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme')
    localStorage.clear()
  })

  describe('When apply is called with "light"', () => {
    test('Then sets data-theme attribute to light on <html>', () => {
      const { apply } = useTheme()
      apply('light')
      expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    })

    test('Then persists the theme in localStorage', () => {
      const { apply } = useTheme()
      apply('light')
      expect(localStorage.getItem('trimly.theme')).toBe('light')
    })

    test('Then updates the reactive theme ref to light', () => {
      const { theme, apply } = useTheme()
      apply('light')
      expect(theme.value).toBe('light')
    })
  })

  describe('When apply is called with "dark"', () => {
    test('Then sets data-theme attribute to dark on <html>', () => {
      const { apply } = useTheme()
      apply('dark')
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    })

    test('Then persists dark in localStorage', () => {
      const { apply } = useTheme()
      apply('dark')
      expect(localStorage.getItem('trimly.theme')).toBe('dark')
    })
  })

  describe('When init is called with "light" saved in localStorage', () => {
    test('Then applies the saved light theme', () => {
      localStorage.setItem('trimly.theme', 'light')
      const { init } = useTheme()
      init()
      expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    })
  })

  describe('When init is called with no saved theme', () => {
    test('Then defaults to dark', () => {
      const { init } = useTheme()
      init()
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    })
  })

  describe('When switching from light back to dark', () => {
    test('Then data-theme reflects the last applied value', () => {
      const { apply } = useTheme()
      apply('light')
      apply('dark')
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
      expect(localStorage.getItem('trimly.theme')).toBe('dark')
    })
  })
})
