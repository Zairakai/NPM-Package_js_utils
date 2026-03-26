import { describe, expect, it } from 'vitest'
import { data_get, data_set, retry, tap, throw_if, throw_unless, value, when } from '../../src/runtime'

describe('tap()', () => {
  it('executes callback for side effects and returns original value', () => {
    let seen: number | undefined
    const result = tap(42, (v) => {
      seen = v
    })
    expect(result).toBe(42)
    expect(seen).toBe(42)
  })
})

describe('when()', () => {
  it('executes onTrue when condition is truthy', () => {
    expect(when(true, () => 'yes')).toBe('yes')
  })

  it('executes onFalse when condition is falsy', () => {
    expect(
      when(
        false,
        () => 'yes',
        () => 'no'
      )
    ).toBe('no')
  })

  it('returns undefined with no onFalse and falsy condition', () => {
    expect(when(false, () => 'yes')).toBeUndefined()
  })

  it('supports function condition', () => {
    expect(
      when(
        () => true,
        () => 'yes'
      )
    ).toBe('yes')
    expect(
      when(
        () => false,
        () => 'yes',
        () => 'no'
      )
    ).toBe('no')
  })
})

describe('value()', () => {
  it('returns value directly if not a function', () => {
    expect(value(42)).toBe(42)
  })

  it('calls function and returns result', () => {
    expect(value(() => 42)).toBe(42)
  })
})

describe('data_get()', () => {
  it('gets a nested value via dot notation', () => {
    expect(data_get({ a: { b: 2 } }, 'a.b')).toBe(2)
  })

  it('returns null default when key is missing', () => {
    expect(data_get({ a: 1 }, 'b')).toBeNull()
  })

  it('returns custom default when traversal hits non-object', () => {
    expect(data_get({ a: 1 }, 'a.b', 'default')).toBe('default')
  })

  it('returns default when target is not an object', () => {
    expect(data_get(null, 'a', 'fallback')).toBe('fallback')
  })

  it('accepts key as array', () => {
    expect(data_get({ a: { b: 3 } }, ['a', 'b'])).toBe(3)
  })

  it('works with array targets', () => {
    expect(data_get([1, 2, 3], '1')).toBe(2)
  })
})

describe('data_set()', () => {
  it('sets a nested value via dot notation', () => {
    const target = { a: { b: 1 } }
    data_set(target, 'a.b', 99)
    expect(target.a.b).toBe(99)
  })

  it('creates intermediate keys when missing', () => {
    const target: Record<string, unknown> = {}
    data_set(target, 'a.b', 'hello')
    expect((target.a as Record<string, unknown>).b).toBe('hello')
  })

  it('accepts key as array', () => {
    const target = { x: { y: 0 } }
    data_set(target, ['x', 'y'], 7)
    expect(target.x.y).toBe(7)
  })

  it('returns target unchanged if not an object', () => {
    const result = data_set(null as unknown as object, 'a', 1)
    expect(result).toBeNull()
  })
})

describe('throw_if()', () => {
  it('throws when condition is an Error object', () => {
    const err = new Error('custom error')
    expect(() => throw_if(true, err)).toThrow('custom error')
  })

  it('does not throw when condition is false', () => {
    expect(() => throw_if(false, 'error')).not.toThrow()
  })

  it('supports function condition', () => {
    expect(() => throw_if(() => true, 'fn error')).toThrow('fn error')
    expect(() => throw_if(() => false, 'fn error')).not.toThrow()
  })
})

describe('throw_unless()', () => {
  it('supports function condition', () => {
    expect(() => throw_unless(() => false, 'fn error')).toThrow('fn error')
    expect(() => throw_unless(() => true, 'fn error')).not.toThrow()
  })

  it('throws an Error object when provided', () => {
    const err = new Error('unless error')
    expect(() => throw_unless(false, err)).toThrow('unless error')
  })
})

describe('retry()', () => {
  it('throws last error after exhausting all attempts', async () => {
    await expect(
      retry(2, () => {
        throw new Error('always fails')
      })
    ).rejects.toThrow('always fails')
  })

  it('retries with a sleep delay', async () => {
    let attempts = 0
    const result = await retry(
      3,
      () => {
        attempts++
        if (3 > attempts) throw new Error('not yet')
        return 'done'
      },
      1
    )
    expect(result).toBe('done')
    expect(attempts).toBe(3)
  })
})
