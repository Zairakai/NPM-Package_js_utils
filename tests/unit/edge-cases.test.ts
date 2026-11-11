import { afterEach, describe, expect, it, vi } from 'vitest'
import { arrayCollapse, arrayGroupBy, arrayPluck, arrayUnique } from '../../src/arrays'
import { EnhancedMap, collect } from '../../src/collections'
import { isEqual } from '../../src/equals'
import { strContainsAny, strStart, strWordCount } from '../../src/formatters'
import { num } from '../../src/number'
import { array_column, php_array } from '../../src/php-arrays'
import { data_set, retry } from '../../src/runtime'
import { str } from '../../src/str'

type Row = { id: number; name?: string }

describe('items that are not objects, when a key is given', () => {
  const mixed = [{ id: 1 }, 7, null, { id: 1 }] as unknown as Row[]

  it('arrayCollapse() keeps an item that is not an array', () => {
    expect(arrayCollapse([[1, 2], 3, [4]] as unknown as number[][])).toEqual([1, 2, 3, 4])
  })

  it('arrayPluck() skips them', () => {
    expect(arrayPluck(mixed, 'id')).toEqual([1, 1])
  })

  it('arrayGroupBy() groups a primitive by its own value', () => {
    expect(arrayGroupBy([1, 1, 2] as unknown as Row[], 'id')).toEqual({ '1': [1, 1], '2': [2] })
  })

  it('arrayUnique() compares a primitive by its own value', () => {
    expect(arrayUnique([1, 1, 2] as unknown as Row[], 'id')).toEqual([1, 2])
  })

  it('EnhancedArray.pluck() skips them', () => {
    expect([...collect(mixed).pluck('id')]).toEqual([1, 1])
  })

  it('EnhancedArray.groupBy() groups a primitive by its own value', () => {
    const groups = collect([1, 1, 2] as unknown as Row[]).groupBy('id')
    expect(Object.keys(groups)).toEqual(['1', '2'])
  })

  it('EnhancedArray.unique() compares a primitive by its own value', () => {
    expect([...collect([1, 1, 2] as unknown as Row[]).unique('id')]).toEqual([1, 2])
  })

  it('EnhancedArray.hasDuplicates() compares a primitive by its own value', () => {
    expect(collect([1, 2, 1] as unknown as Row[]).hasDuplicates('id')).toBe(true)
  })

  it('EnhancedArray.chunkBy() groups a primitive by its own value', () => {
    expect(collect(['a', 'a', 'b'] as unknown as Row[]).chunkBy('id')).toHaveLength(2)
  })

  it('EnhancedMap.pluck() skips them', () => {
    const map = new EnhancedMap<string, unknown>([
      ['a', { id: 1 }],
      ['b', 5],
    ])
    expect([...map.pluck('id' as never)]).toEqual([1])
  })

  it('array_column() skips them', () => {
    expect(array_column(mixed as unknown as Record<string, unknown>[], 'id')).toEqual([1, 1])
  })
})

describe('EnhancedArray.median() with an accessor', () => {
  it('reads the numbers through the accessor', () => {
    expect(collect([{ n: 3 }, { n: 1 }, { n: 2 }]).median((row) => row.n)).toBe(2)
  })
})

describe('EnhancedArray.weightedRandom()', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('falls back to the last item when the random value is beyond the total weight', () => {
    vi.spyOn(Math, 'random').mockReturnValue(2)
    expect(collect(['a', 'b']).weightedRandom([1, 1])).toBe('b')
  })
})

describe('isEqual()', () => {
  it('compares objects that define their own toString() by that string', () => {
    class Label {
      constructor(private text: string) {}
      toString() {
        return this.text
      }
    }
    expect(isEqual(new Label('x'), new Label('x'))).toBe(true)
    expect(isEqual(new Label('x'), new Label('y'))).toBe(false)
  })
})

describe('formatters', () => {
  it('strContainsAny() is false for an empty string or for needles that are not an array', () => {
    expect(strContainsAny('', ['a'])).toBe(false)
    expect(strContainsAny('abc', 'a' as unknown as string[])).toBe(false)
  })

  it('strStart() returns the value when the prefix is empty', () => {
    expect(strStart('abc', '')).toBe('abc')
  })

  it('strWordCount() splits on the given characters as well as on spaces', () => {
    expect(strWordCount('a-b c', '-')).toBe(3)
  })
})

describe('num() and str() without a value', () => {
  it('num() starts from 0', () => {
    expect(num().toNumber()).toBe(0)
    expect(num(null).toNumber()).toBe(0)
  })

  it('str() starts from an empty string', () => {
    expect(str().toString()).toBe('')
    expect(str(null).toString()).toBe('')
  })

  it('slug() makes a URL-friendly string', () => {
    expect(str('Hello World, Ça va ?').slug().toString()).toBe('hello-world-ca-va')
  })
})

describe('php_array() (default arguments)', () => {
  it('rand() returns one item by default', () => {
    expect([1, 2, 3]).toContain(php_array([1, 2, 3]).rand())
  })

  it('column() takes a column of the rows', () => {
    expect([...php_array([{ id: 1 }, { id: 2 }]).column('id')]).toEqual([1, 2])
  })
})

describe('runtime', () => {
  it('data_set() stops when the path goes through a value that is not an object', () => {
    const target = { a: 1 } as Record<string, unknown>
    expect(data_set(target, 'a.b.c', 5)).toBe(target)
  })

  it('retry() wraps a thrown value that is not an Error', async () => {
    await expect(
      retry(1, () => {
        throw 'boom'
      }),
    ).rejects.toThrow('boom')
  })

  it('retry() fails with a message when it is never called', async () => {
    await expect(retry(0, () => 1)).rejects.toThrow('Retry failed after 0 attempts')
  })
})
