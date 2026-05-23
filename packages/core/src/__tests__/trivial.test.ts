import { describe, expect, test } from 'vitest'
import type { TrimlyEvent } from '../types/events.js'
import { typedMock } from '../utils/typedMock.js'

describe('Given the typedMock utility is available', () => {
  describe('When the module is imported', () => {
    test('Then typedMock is defined', () => {
      expect(typedMock).toBeDefined()
    })
  })

  describe('When typedMock is called with partial fields', () => {
    test('Then it casts the partial object to the target type', () => {
      const mock = typedMock<TrimlyEvent>({ id: 'test', tokens_input: 42 })
      expect(mock.id).toBe('test')
      expect(mock.tokens_input).toBe(42)
    })
  })
})
