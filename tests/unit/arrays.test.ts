import { describe, expect, it } from 'vitest'
import {
  arrayAdd,
  arrayCollapse,
  arrayDivide,
  arrayDot,
  arrayExcept,
  arrayFirst,
  arrayFlatten,
  arrayGet,
  arrayGroupBy,
  arrayHas,
  arrayOnly,
  arrayPluck,
  arrayUnique,
  arrayWhere,
} from '../../src/arrays'

describe('arrayAdd()', () => {
  it('adds key to plain object', () => {
    const result = arrayAdd({ a: 1 }, 'b', 2)
    expect(result).toEqual({ a: 1, b: 2 })
  })

  it('adds key to array (converted to object)', () => {
    const result = arrayAdd(['x', 'y'], 'newKey', 'z')
    expect(result['newKey']).toBe('z')
  })
})

describe('arrayCollapse()', () => {
  it('flattens one level of nested arrays', () => {
    expect(arrayCollapse([[1, 2], [3, 4], [5]])).toEqual([1, 2, 3, 4, 5])
  })

  it('returns empty for non-array input', () => {
    expect(arrayCollapse(null as any)).toEqual([])
  })
})

describe('arrayDivide()', () => {
  it('returns [keys, values] tuple', () => {
    const [keys, values] = arrayDivide(['a', 'b', 'c'])
    expect(keys).toEqual(['0', '1', '2'])
    expect(values).toEqual(['a', 'b', 'c'])
  })

  it('returns empty tuple for non-array', () => {
    expect(arrayDivide(null as any)).toEqual([[], []])
  })
})

describe('arrayDot()', () => {
  it('flattens nested object to dot notation', () => {
    const result = arrayDot({ user: { name: 'Ada', meta: { id: 1 } } })
    expect(result).toEqual({ 'user.name': 'Ada', 'user.meta.id': 1 })
  })

  it('handles prepend prefix', () => {
    const result = arrayDot({ name: 'Bob' }, 'user')
    expect(result).toEqual({ 'user.name': 'Bob' })
  })

  it('preserves non-object leaf values including arrays', () => {
    const result = arrayDot({ tags: ['a', 'b'] })
    expect(result['tags']).toEqual(['a', 'b'])
  })
})

describe('arrayExcept()', () => {
  it('excludes items at given indices', () => {
    expect(arrayExcept([10, 20, 30, 40], ['1', '3'])).toEqual([10, 30])
  })

  it('returns original for non-array input', () => {
    expect(arrayExcept(null as any, ['0'])).toBeNull()
  })
})

describe('arrayFirst()', () => {
  it('returns first element without callback', () => {
    expect(arrayFirst([1, 2, 3])).toBe(1)
  })

  it('returns default for empty array', () => {
    expect(arrayFirst([], undefined, 99)).toBe(99)
  })

  it('returns first matching element with callback', () => {
    expect(arrayFirst([1, 2, 3, 4], (n) => n > 2)).toBe(3)
  })

  it('returns default when no match found', () => {
    expect(arrayFirst([1, 2], (n) => n > 10, 0)).toBe(0)
  })

  it('returns default for non-array input', () => {
    expect(arrayFirst(null as any, undefined, 42)).toBe(42)
  })
})

describe('arrayFlatten()', () => {
  it('flattens deeply nested arrays', () => {
    expect(arrayFlatten([1, [2, [3, [4]]]])).toEqual([1, 2, 3, 4])
  })

  it('flattens to specified depth', () => {
    expect(arrayFlatten([1, [2, [3]]], 1)).toEqual([1, 2, [3]])
  })

  it('returns empty for non-array input', () => {
    expect(arrayFlatten(null as any)).toEqual([])
  })
})

describe('arrayGet()', () => {
  it('gets value by dot-notation key', () => {
    const source = { user: { profile: { name: 'Ada' } } }
    expect(arrayGet(source, 'user.profile.name')).toBe('Ada')
  })

  it('returns defaultValue for missing key', () => {
    expect(arrayGet({ a: 1 }, 'b.c', 'default')).toBe('default')
  })

  it('returns defaultValue for non-object input', () => {
    expect(arrayGet(null as any, 'key', 'fallback')).toBe('fallback')
  })
})

describe('arrayHas()', () => {
  it('returns true for existing key', () => {
    expect(arrayHas({ a: { b: 1 } }, 'a.b')).toBe(true)
  })

  it('returns false for missing key', () => {
    expect(arrayHas({ a: 1 }, 'b')).toBe(false)
  })

  it('checks multiple keys', () => {
    expect(arrayHas({ a: 1, b: 2 }, ['a', 'b'])).toBe(true)
    expect(arrayHas({ a: 1 }, ['a', 'c'])).toBe(false)
  })

  it('returns false for non-object', () => {
    expect(arrayHas(null as any, 'key')).toBe(false)
  })
})

describe('arrayOnly()', () => {
  it('returns items at specified indices', () => {
    expect(arrayOnly([10, 20, 30, 40], ['0', '2'])).toEqual([10, 30])
  })

  it('returns empty for non-array input', () => {
    expect(arrayOnly(null as any, ['0'])).toEqual([])
  })
})

describe('arrayWhere()', () => {
  it('filters array with callback', () => {
    expect(arrayWhere([1, 2, 3, 4], (n) => n % 2 === 0)).toEqual([2, 4])
  })

  it('returns empty for non-array input', () => {
    expect(arrayWhere(null as any, () => true)).toEqual([])
  })
})

describe('arrayPluck()', () => {
  it('extracts property from array of objects', () => {
    const data = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ]
    expect(arrayPluck(data, 'name')).toEqual(['Alice', 'Bob'])
  })

  it('returns empty for non-array input', () => {
    expect(arrayPluck(null as any, 'name')).toEqual([])
  })
})

describe('arrayGroupBy()', () => {
  it('groups by object key', () => {
    const data = [
      { role: 'admin', name: 'Alice' },
      { role: 'user', name: 'Bob' },
      { role: 'admin', name: 'Carol' },
    ]
    const groups = arrayGroupBy(data, 'role')
    expect(groups['admin']).toHaveLength(2)
    expect(groups['user']).toHaveLength(1)
  })

  it('groups by callback', () => {
    const data = [1, 2, 3, 4]
    const groups = arrayGroupBy(data, (n) => (n % 2 === 0 ? 'even' : 'odd'))
    expect(groups['even']).toEqual([2, 4])
    expect(groups['odd']).toEqual([1, 3])
  })

  it('returns empty for non-array input', () => {
    expect(arrayGroupBy(null as any, 'key')).toEqual({})
  })
})

describe('arrayUnique()', () => {
  it('removes primitives duplicates', () => {
    expect(arrayUnique([1, 1, 2, 3])).toEqual([1, 2, 3])
  })

  it('removes duplicates by object key', () => {
    expect(arrayUnique([{ id: 1 }, { id: 1 }, { id: 2 }], 'id')).toEqual([{ id: 1 }, { id: 2 }])
  })

  it('returns empty for non-array input', () => {
    expect(arrayUnique(null as any)).toEqual([])
  })
})
