import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  EnhancedArray,
  EnhancedMap,
  collect,
  collectMap,
  mapToObject,
  objectToMap,
} from '../../src/collections'

const plain = (rows: Iterable<Iterable<unknown>>) =>
  Array.from(rows, (row) => Array.from(row))

describe('EnhancedArray (comparison)', () => {
  it('isEquivalent() compares with an array or another collection', () => {
    const items = collect([1, 2, 3])
    expect(items.isEquivalent([1, 2, 3])).toBe(true)
    expect(items.isEquivalent(collect([1, 2, 3]))).toBe(true)
    expect(items.isEquivalent([1, 2])).toBe(false)
  })
})

describe('EnhancedArray.rotate()', () => {
  it('moves the first items to the end', () => {
    expect([...collect([1, 2, 3, 4]).rotate(1)]).toEqual([2, 3, 4, 1])
  })

  it('rotates the other way with a negative number', () => {
    expect([...collect([1, 2, 3, 4]).rotate(-1)]).toEqual([4, 1, 2, 3])
  })

  it('returns a copy for a multiple of the length', () => {
    const items = collect([1, 2, 3, 4])
    const rotated = items.rotate(4)
    expect([...rotated]).toEqual([1, 2, 3, 4])
    expect(rotated).not.toBe(items)
  })

  it('returns an empty collection for an empty one', () => {
    expect([...new EnhancedArray<number>().rotate(2)]).toEqual([])
  })
})

describe('EnhancedArray.chunkWhile()', () => {
  it('starts a new chunk when the predicate fails', () => {
    const chunks = collect([1, 2, 5, 1, 2]).chunkWhile((n) => n < 3)
    expect(plain(chunks)).toEqual([
      [1, 2],
      [5, 1, 2],
    ])
  })

  it('returns an empty collection for an empty one', () => {
    expect(new EnhancedArray<number>().chunkWhile(() => true)).toHaveLength(0)
  })
})

describe('EnhancedArray.transpose()', () => {
  it('swaps rows and columns', () => {
    expect(
      plain(
        collect([
          [1, 2],
          [3, 4],
        ]).transpose(),
      ),
    ).toEqual([
      [1, 3],
      [2, 4],
    ])
  })

  it('fills the missing cells of ragged rows with null', () => {
    expect(plain(collect([[1, 2, 3], [4]]).transpose())).toEqual([
      [1, 4],
      [2, null],
      [3, null],
    ])
  })

  it('treats a value that is not an array as a one-cell row', () => {
    expect(plain(collect<unknown>([[1, 2], 5]).transpose())).toEqual([
      [1, 5],
      [2, null],
    ])
  })

  it('returns an empty collection for an empty one', () => {
    expect(new EnhancedArray<number[]>().transpose()).toHaveLength(0)
  })
})

describe('EnhancedArray.isSorted() and hasDuplicates()', () => {
  it('isSorted() is true for an ordered, empty or single-item collection', () => {
    expect(collect([1, 2, 3]).isSorted()).toBe(true)
    expect(collect([1]).isSorted()).toBe(true)
    expect(new EnhancedArray<number>().isSorted()).toBe(true)
  })

  it('isSorted() is false for an unordered collection', () => {
    expect(collect([3, 1, 2]).isSorted()).toBe(false)
  })

  it('isSorted() uses the comparison function when given', () => {
    const descending = (a: number, b: number) => b - a
    expect(collect([3, 2, 1]).isSorted(descending)).toBe(true)
    expect(collect([1, 2, 3]).isSorted(descending)).toBe(false)
  })

  it('hasDuplicates() looks at the items', () => {
    expect(collect([1, 2, 1]).hasDuplicates()).toBe(true)
    expect(collect([1, 2, 3]).hasDuplicates()).toBe(false)
  })

  it('hasDuplicates() looks at a key of the items', () => {
    expect(collect([{ id: 1 }, { id: 2 }, { id: 1 }]).hasDuplicates('id')).toBe(
      true,
    )
    expect(collect([{ id: 1 }, { id: 2 }]).hasDuplicates('id')).toBe(false)
  })
})

describe('EnhancedArray (statistics)', () => {
  it('mode() returns the most frequent values as strings', () => {
    expect([...collect([1, 2, 2, 3, 3]).mode()]).toEqual(['2', '3'])
  })

  it('mode() accepts an accessor', () => {
    const users = collect([
      { role: 'admin' },
      { role: 'user' },
      { role: 'user' },
    ])
    expect([...users.mode((u) => u.role)]).toEqual(['user'])
  })

  it('mode() is empty for an empty collection', () => {
    expect(new EnhancedArray<number>().mode()).toHaveLength(0)
  })

  it('standardDeviation() is the population deviation', () => {
    expect(collect([2, 4, 4, 4, 5, 5, 7, 9]).standardDeviation()).toBe(2)
  })

  it('standardDeviation() accepts an accessor', () => {
    expect(
      collect([
        { n: 2 },
        { n: 4 },
        { n: 4 },
        { n: 4 },
        { n: 5 },
        { n: 5 },
        { n: 7 },
        { n: 9 },
      ]).standardDeviation((r) => r.n),
    ).toBe(2)
  })

  it('standardDeviation() is 0 for an empty collection', () => {
    expect(new EnhancedArray<number>().standardDeviation()).toBe(0)
  })

  it('percentile() picks a value or interpolates between two', () => {
    expect(collect([1, 2, 3, 4, 5]).percentile(50)).toBe(3)
    expect(collect([1, 2, 3, 4, 5]).percentile(25)).toBe(2)
    expect(collect([1, 2, 3, 4]).percentile(50)).toBe(2.5)
  })

  it('percentile() accepts an accessor', () => {
    expect(
      collect([{ n: 10 }, { n: 20 }, { n: 30 }]).percentile(100, (r) => r.n),
    ).toBe(30)
  })

  it('percentile() is null for an empty collection', () => {
    expect(new EnhancedArray<number>().percentile(50)).toBeNull()
  })

  it('frequencies() counts the items, or the values of an accessor', () => {
    expect(collect(['a', 'b', 'a']).frequencies()).toEqual({ a: 2, b: 1 })
    expect(
      collect([{ t: 'x' }, { t: 'x' }, { t: 'y' }]).frequencies((r) => r.t),
    ).toEqual({ x: 2, y: 1 })
  })
})

describe('EnhancedArray (combinations)', () => {
  it('cartesian() returns every combination', () => {
    expect(plain(collect([1, 2]).cartesian(['a', 'b']))).toEqual([
      [1, 'a'],
      [1, 'b'],
      [2, 'a'],
      [2, 'b'],
    ])
  })

  it('interleave() alternates the items and keeps the rest of the longer ones', () => {
    expect([...collect([1, 2, 3]).interleave(['a', 'b'])]).toEqual([
      1,
      'a',
      2,
      'b',
      3,
    ])
  })

  it('sliding() returns the windows', () => {
    expect(plain(collect([1, 2, 3, 4]).sliding(2))).toEqual([
      [1, 2],
      [2, 3],
      [3, 4],
    ])
    expect(plain(collect([1, 2, 3, 4]).sliding(2, 2))).toEqual([
      [1, 2],
      [3, 4],
    ])
  })

  it('sliding() is empty for a size or a step that is not positive', () => {
    expect(collect([1, 2, 3]).sliding(0)).toHaveLength(0)
    expect(collect([1, 2, 3]).sliding(2, 0)).toHaveLength(0)
  })
})

describe('EnhancedArray (navigation)', () => {
  it('at() reads by index', () => {
    expect(collect([10, 20]).at(1)).toBe(20)
    expect(collect([10, 20]).at(5)).toBeUndefined()
  })

  it('before() and after() return the neighbours', () => {
    const items = collect(['a', 'b', 'c'])
    expect(items.before('b')).toBe('a')
    expect(items.after('b')).toBe('c')
  })

  it('before() and after() are undefined at the ends and for an unknown item', () => {
    const items = collect(['a', 'b', 'c'])
    expect(items.before('a')).toBeUndefined()
    expect(items.after('c')).toBeUndefined()
    expect(items.before('z')).toBeUndefined()
    expect(items.after('z')).toBeUndefined()
  })
})

describe('EnhancedArray (transformations)', () => {
  it('chunkBy() groups consecutive items with the same key', () => {
    const rows = collect([{ t: 'a' }, { t: 'a' }, { t: 'b' }, { t: 'a' }])
    expect(chunkSizes(rows.chunkBy('t'))).toEqual([2, 1, 1])
  })

  it('chunkBy() accepts a callback', () => {
    expect(
      plain(collect(['a', 'b', 'cc', 'dd', 'e', 'f']).chunkBy((s) => s.length)),
    ).toEqual([
      ['a', 'b'],
      ['cc', 'dd'],
      ['e', 'f'],
    ])
  })

  it('chunkBy() is empty for an empty collection', () => {
    expect(new EnhancedArray<number>().chunkBy((n) => n)).toHaveLength(0)
  })

  it('filterMap() maps and drops null and undefined, but keeps 0', () => {
    expect([
      ...collect([1, 2, 3, 4]).filterMap((n) => (n % 2 === 0 ? n * 10 : null)),
    ]).toEqual([20, 40])
    expect([
      ...collect([1, 2, 3]).filterMap((n) => (n === 2 ? undefined : n - 1)),
    ]).toEqual([0, 2])
  })

  it('extract() keeps the given keys that exist', () => {
    const rows = collect<{ a: number; b?: number; c?: number }>([
      { a: 1, b: 2, c: 3 },
      { a: 4 },
    ])
    expect([...rows.extract(['a', 'b'])]).toEqual([{ a: 1, b: 2 }, { a: 4 }])
  })

  it('extract() gives an empty object for an item that is not an object', () => {
    expect([...collect<unknown>([1, null]).extract([] as never[])]).toEqual([
      {},
      {},
    ])
  })

  it('recursive() converts the nested arrays, also inside plain objects', () => {
    const converted = collect<unknown>([[1, [2]], { list: [3] }]).recursive()
    const first = converted[0] as EnhancedArray<unknown>
    const second = converted[1] as { list: unknown }
    expect(first).toBeInstanceOf(EnhancedArray)
    expect(first[1]).toBeInstanceOf(EnhancedArray)
    expect(second.list).toBeInstanceOf(EnhancedArray)
  })
})

describe('EnhancedArray (utilities)', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('firstOrPush() returns the first item, or pushes the default one', () => {
    expect(collect([1, 2]).firstOrPush(9)).toBe(1)
    const empty = new EnhancedArray<number>()
    expect(empty.firstOrPush(9)).toBe(9)
    expect([...empty]).toEqual([9])
  })

  it('getNth() returns every n-th item', () => {
    expect([...collect([1, 2, 3, 4, 5, 6]).getNth(2)]).toEqual([2, 4, 6])
  })

  it('weightedRandom() is undefined for an empty collection', () => {
    expect(new EnhancedArray<number>().weightedRandom()).toBeUndefined()
  })

  it('weightedRandom() refuses weights of another length', () => {
    expect(() => collect([1, 2]).weightedRandom([1])).toThrow(
      'Weights array must have same length as collection',
    )
  })

  it('weightedRandom() follows the random value and the weights', () => {
    const items = collect(['a', 'b'])
    vi.spyOn(Math, 'random').mockReturnValue(0.1)
    expect(items.weightedRandom([1, 1])).toBe('a')
    vi.spyOn(Math, 'random').mockReturnValue(0.99)
    expect(items.weightedRandom([1, 1])).toBe('b')
  })

  it('paginate() slices a page and clamps the page number', () => {
    const items = collect([1, 2, 3, 4, 5])
    const second = items.paginate(3, 2)
    expect([...second.data]).toEqual([4, 5])
    expect(second).toMatchObject({
      total: 5,
      perPage: 3,
      currentPage: 2,
      lastPage: 2,
      from: 4,
      to: 5,
    })

    expect(items.paginate(3, 10).currentPage).toBe(2)
    expect(items.paginate(3, 0).currentPage).toBe(1)
  })

  it('keeps a numeric item when it starts a chunk or is alone on a page', () => {
    expect([...collect([1, 2, 3, 4, 5]).paginate(2, 3).data]).toEqual([5])
    expect(plain(collect([1, 3, 2]).chunkBy((n) => n % 2))).toEqual([
      [1, 3],
      [2],
    ])
  })
})

describe('objectToMap() and mapToObject()', () => {
  it('converts an object to a Map and back', () => {
    const map = objectToMap({ a: 1, b: 2 })
    expect(map).toBeInstanceOf(Map)
    expect(map.get('b')).toBe(2)
    expect(mapToObject(map)).toEqual({ a: 1, b: 2 })
  })
})

describe('EnhancedMap', () => {
  it('collectMap() builds a map from entries', () => {
    const map = collectMap([['a', 1]])
    expect(map).toBeInstanceOf(EnhancedMap)
    expect(map.get('a')).toBe(1)
  })
})

function chunkSizes(chunks: Iterable<Iterable<unknown>>) {
  return plain(chunks).map((chunk) => chunk.length)
}

describe('EnhancedArray (constructor and native methods)', () => {
  it('reads a single number as an item, not as a length', () => {
    expect([...new EnhancedArray(5)]).toEqual([5])
    expect(new EnhancedArray(5)).toHaveLength(1)
    expect([...EnhancedArray.of(0)]).toEqual([0])
    expect([...collect([7])]).toEqual([7])
  })

  it('builds an empty collection without items', () => {
    expect(new EnhancedArray()).toHaveLength(0)
  })

  it('keeps the original items for the dirty tracking', () => {
    const items = new EnhancedArray(5)
    expect(items.isClean()).toBe(true)
    items.push(6)
    expect(items.isDirty()).toBe(true)
  })

  it('map(), filter(), slice() and concat() return collections with the right content', () => {
    const items = collect([1, 2, 3, 4])

    for (const result of [
      items.map((n) => n * 2),
      items.filter((n) => n > 2),
      items.slice(1, 3),
      items.concat([5]),
    ]) {
      expect(result).toBeInstanceOf(EnhancedArray)
    }

    expect([...items.map((n) => n * 2)]).toEqual([2, 4, 6, 8])
    expect([...items.filter((n) => n > 2)]).toEqual([3, 4])
    expect([...items.slice(1, 3)]).toEqual([2, 3])
    expect([...items.concat([5])]).toEqual([1, 2, 3, 4, 5])
  })

  it('filter() with no match is empty, and with a single match keeps that item', () => {
    const items = collect([1, 2, 3])
    expect(items.filter(() => false)).toHaveLength(0)
    expect([...items.filter((n) => n === 3)]).toEqual([3])
    expect([...items.filter((n) => n === 0)]).toEqual([])
  })

  it('map() of a one-item collection keeps the mapped number', () => {
    expect([...collect([4]).map((n) => n + 1)]).toEqual([5])
  })
})
