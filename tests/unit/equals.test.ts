import { describe, expect, it } from 'vitest'
import { diff, isEqual } from '../../src/equals'

describe('isEqual', () => {
  it('NaN equals NaN', () => {
    expect(isEqual(NaN, NaN)).toBe(true)
    expect(isEqual(NaN, 1)).toBe(false)
  })

  it('returns false for different constructors', () => {
    class A {}
    class B {}
    expect(isEqual(new A(), new B())).toBe(false)
  })

  it('compares Maps by key/value pairs', () => {
    expect(isEqual(new Map([['a', 1]]), new Map([['a', 1]]))).toBe(true)
    expect(isEqual(new Map([['a', 1]]), new Map([['a', 2]]))).toBe(false)
    expect(
      isEqual(
        new Map([['a', 1]]),
        new Map([
          ['a', 1],
          ['b', 2],
        ])
      )
    ).toBe(false)
  })

  it('compares Sets by membership', () => {
    expect(isEqual(new Set([1, 2]), new Set([1, 2]))).toBe(true)
    expect(isEqual(new Set([1, 2]), new Set([1, 3]))).toBe(false)
    expect(isEqual(new Set([1]), new Set([1, 2]))).toBe(false)
  })

  it('compares RegExp by source and flags', () => {
    expect(isEqual(/abc/i, /abc/i)).toBe(true)
    expect(isEqual(/abc/i, /abc/g)).toBe(false)
    expect(isEqual(/abc/, /def/)).toBe(false)
  })

  it('compares Dates via valueOf()', () => {
    const d1 = new Date('2024-01-01')
    const d2 = new Date('2024-01-01')
    const d3 = new Date('2024-12-31')
    expect(isEqual(d1, d2)).toBe(true)
    expect(isEqual(d1, d3)).toBe(false)
  })

  it('returns false for objects with different key counts', () => {
    expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false)
  })

  it('returns false when key missing from second object', () => {
    expect(isEqual({ a: 1, b: 2 }, { a: 1, c: 2 })).toBe(false)
  })
})

describe('diff', () => {
  it('returns empty object when objects are equal', () => {
    expect(diff({ a: 1 }, { a: 1 })).toEqual({})
  })

  it('returns current value when original is not an object', () => {
    expect(diff(null, { a: 1 })).toEqual({ a: 1 })
  })

  it('returns empty object when current is not an object', () => {
    expect(diff({ a: 1 }, null)).toEqual({})
  })

  it('includes keys present only in current', () => {
    expect(diff({ a: 1 }, { a: 1, b: 2 })).toEqual({ b: 2 })
  })

  it('handles array changes without deep recursion', () => {
    expect(diff({ a: [1, 2] }, { a: [1, 3] })).toEqual({ a: [1, 3] })
  })

  it('recurses into nested objects', () => {
    expect(diff({ a: { b: 1, c: 2 } }, { a: { b: 1, c: 99 } })).toEqual({ a: { c: 99 } })
  })
})
