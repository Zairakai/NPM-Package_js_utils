import { describe, expect, it } from 'vitest'
import { EnhancedArray, EnhancedMap, collect, collectMap } from '../../src/collections'

describe('EnhancedArray', () => {
  it('constructs from items', () => {
    const arr = new EnhancedArray(1, 2, 3)
    expect(arr).toHaveLength(3)
    expect(arr[0]).toBe(1)
  })

  it('EnhancedArray.from()', () => {
    const arr = EnhancedArray.from([1, 2, 3])
    expect(arr).toHaveLength(3)
    expect(arr).toBeInstanceOf(EnhancedArray)
  })

  it('EnhancedArray.of()', () => {
    const arr = EnhancedArray.of(1, 2, 3)
    expect(arr).toBeInstanceOf(EnhancedArray)
    expect(arr).toHaveLength(3)
  })

  it('collect() returns a copy', () => {
    const arr = new EnhancedArray(1, 2, 3)
    const copy = arr.collect()
    expect(copy).toBeInstanceOf(EnhancedArray)
    expect(copy).toHaveLength(3)
  })

  it('pluck() extracts a key from objects', () => {
    const arr = EnhancedArray.from([{ name: 'Alice' }, { name: 'Bob' }])
    const names = arr.pluck('name')
    expect([...names]).toEqual(['Alice', 'Bob'])
  })

  it('groupBy() groups by key', () => {
    const arr = EnhancedArray.from([
      { role: 'admin', name: 'Alice' },
      { role: 'user', name: 'Bob' },
      { role: 'admin', name: 'Carol' },
    ])
    const groups = arr.groupBy('role')
    expect(groups['admin']).toHaveLength(2)
    expect(groups['user']).toHaveLength(1)
  })

  it('groupBy() with callback', () => {
    const arr = EnhancedArray.from([1, 2, 3, 4])
    const groups = arr.groupBy((n) => (0 === n % 2 ? 'even' : 'odd'))
    expect(groups['even']).toHaveLength(2)
    expect(groups['odd']).toHaveLength(2)
  })

  it('unique() removes duplicates', () => {
    const arr = EnhancedArray.from([1, 2, 2, 3, 3, 3])
    expect([...arr.unique()]).toEqual([1, 2, 3])
  })

  it('unique() by key', () => {
    const arr = EnhancedArray.from([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 1, name: 'Alice Duplicate' },
    ])
    expect(arr.unique('id')).toHaveLength(2)
  })

  it('chunk() splits into groups (even split)', () => {
    const arr = EnhancedArray.from([1, 2, 3, 4, 5, 6])
    const chunks = arr.chunk(2)
    expect(chunks).toHaveLength(3)
    expect([...chunks[0]]).toEqual([1, 2])
    expect([...chunks[2]]).toEqual([5, 6])
  })

  it('rotate() rotates elements', () => {
    const arr = EnhancedArray.from([1, 2, 3, 4])
    expect([...arr.rotate(1)]).toEqual([2, 3, 4, 1])
    expect([...arr.rotate(-1)]).toEqual([4, 1, 2, 3])
  })

  it('isSorted() detects sorted arrays', () => {
    expect(EnhancedArray.from([1, 2, 3]).isSorted()).toBe(true)
    expect(EnhancedArray.from([3, 1, 2]).isSorted()).toBe(false)
  })

  it('hasDuplicates() detects duplicates', () => {
    expect(EnhancedArray.from([1, 2, 3]).hasDuplicates()).toBe(false)
    expect(EnhancedArray.from([1, 2, 2]).hasDuplicates()).toBe(true)
  })

  it('median()', () => {
    expect(EnhancedArray.from([1, 2, 3]).median()).toBe(2)
    expect(EnhancedArray.from([1, 2, 3, 4]).median()).toBe(2.5)
    expect(new EnhancedArray<number>().median()).toBeNull()
  })

  it('paginate() returns correct page data', () => {
    const arr = EnhancedArray.from([1, 2, 3, 4, 5])
    const page = arr.paginate(2, 1)
    expect([...page.data]).toEqual([1, 2])
    expect(page.total).toBe(5)
    expect(page.lastPage).toBe(3)
  })

  it('sliding() creates sliding windows', () => {
    const arr = EnhancedArray.from([1, 2, 3, 4])
    const windows = arr.sliding(2)
    expect(windows).toHaveLength(3)
    expect([...windows[0]]).toEqual([1, 2])
  })

  it('extract() picks keys from objects', () => {
    const arr = EnhancedArray.from([{ a: 1, b: 2, c: 3 }])
    const result = arr.extract(['a', 'b'])
    expect(result[0]).toEqual({ a: 1, b: 2 })
  })

  it('deepFlatten() flattens nested arrays', () => {
    const arr = EnhancedArray.from([
      [1, 2],
      [3, [4, 5]],
    ])
    expect([...arr.deepFlatten(1)]).toEqual([1, 2, 3, [4, 5]])
    expect([...arr.deepFlatten(2)]).toEqual([1, 2, 3, 4, 5])
  })

  it('at() returns element at index', () => {
    const arr = EnhancedArray.from([10, 20, 30])
    expect(arr.at(0)).toBe(10)
    expect(arr.at(2)).toBe(30)
  })

  it('before() and after()', () => {
    const arr = EnhancedArray.from([1, 2, 3])
    expect(arr.before(2)).toBe(1)
    expect(arr.after(2)).toBe(3)
    expect(arr.before(1)).toBeUndefined()
    expect(arr.after(3)).toBeUndefined()
  })

  it('filterMap() filters and transforms', () => {
    const arr = EnhancedArray.from([1, 2, 3, 4])
    const result = arr.filterMap((n) => (0 === n % 2 ? n * 10 : null))
    expect([...result]).toEqual([20, 40])
  })

  it('getNth() returns every nth element', () => {
    const arr = EnhancedArray.from([1, 2, 3, 4, 5, 6])
    expect([...arr.getNth(2)]).toEqual([2, 4, 6])
  })

  it('mode() returns most frequent values', () => {
    const arr = EnhancedArray.from([1, 2, 2, 3, 3, 3])
    const mode = arr.mode()
    expect([...mode]).toContain('3')
  })

  it('frequencies() counts occurrences', () => {
    const arr = EnhancedArray.from([1, 2, 2, 3])
    const freq = arr.frequencies()
    expect(freq['2']).toBe(2)
    expect(freq['1']).toBe(1)
  })

  it('standardDeviation() computes std dev', () => {
    const arr = EnhancedArray.from([2, 4, 4, 4, 5, 5, 7, 9])
    const sd = arr.standardDeviation()
    expect(sd).toBeCloseTo(2, 0)
  })

  it('percentile() returns correct percentile', () => {
    const arr = EnhancedArray.from([1, 2, 3, 4, 5])
    expect(arr.percentile(50)).toBe(3)
    expect(arr.percentile(0)).toBe(1)
    expect(arr.percentile(100)).toBe(5)
    expect(new EnhancedArray<number>().percentile(50)).toBeNull()
  })

  it('interleave() interleaves arrays', () => {
    const arr = EnhancedArray.from([1, 3, 5])
    const result = arr.interleave([2, 4, 6])
    expect([...result]).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('weightedRandom() returns an element from the array', () => {
    const arr = EnhancedArray.from([1, 2, 3])
    const result = arr.weightedRandom()
    expect([1, 2, 3]).toContain(result)
  })

  it('weightedRandom() returns undefined for empty array', () => {
    expect(new EnhancedArray<number>().weightedRandom()).toBeUndefined()
  })

  it('chunkWhile() groups consecutive matching items', () => {
    const arr = EnhancedArray.from([1, 2, 4, 9, 10, 11, 12, 15])
    // chunkWhile receives (item, index) — split when consecutive condition fails
    const chunks = arr.chunkWhile((n, i) => 0 < i && n === arr[i - 1] + 1)
    expect(chunks.length).toBeGreaterThan(1)
  })

  it('firstOrPush() returns first or pushes', () => {
    const arr = EnhancedArray.from([10, 20])
    expect(arr.firstOrPush(99)).toBe(10)
    const empty = new EnhancedArray<number>()
    expect(empty.firstOrPush(99)).toBe(99)
    expect(empty).toHaveLength(1)
  })

  it('recursive() converts nested arrays', () => {
    const arr = EnhancedArray.from([
      [1, 2],
      [3, [4, 5]],
    ])
    const result = arr.recursive()
    expect(result[0]).toBeInstanceOf(EnhancedArray)
  })

  it('isSorted() with custom compareFn', () => {
    const desc = EnhancedArray.from([3, 2, 1])
    expect(desc.isSorted((a, b) => b - a)).toBe(true)
    expect(desc.isSorted()).toBe(false)
  })

  it('transpose() transposes 2D array', () => {
    const arr = EnhancedArray.from([
      [1, 2, 3],
      [4, 5, 6],
    ])
    const result = arr.transpose()
    expect(result).toHaveLength(3)
    expect([...result[0]]).toEqual([1, 4])
  })
})

describe('collect() factory', () => {
  it('creates an EnhancedArray', () => {
    const arr = collect([1, 2, 3])
    expect(arr).toBeInstanceOf(EnhancedArray)
    expect(arr).toHaveLength(3)
  })
})

describe('EnhancedMap', () => {
  it('fromObject() creates map from object', () => {
    const map = EnhancedMap.fromObject({ a: 1, b: 2 })
    expect(map.get('a')).toBe(1)
    expect(map.size).toBe(2)
  })

  it('pluck() extracts values by key', () => {
    const map = new EnhancedMap([
      ['x', { name: 'Alice' }],
      ['y', { name: 'Bob' }],
    ])
    const names = map.pluck('name')
    expect([...names]).toEqual(['Alice', 'Bob'])
  })

  it('groupBy() groups entries by accessor', () => {
    const map = new EnhancedMap([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])
    const groups = map.groupBy((v) => (0 === v % 2 ? 'even' : 'odd'))
    expect(groups['even']).toHaveLength(1)
    expect(groups['odd']).toHaveLength(2)
  })

  it('toArray() converts to EnhancedArray of entries', () => {
    const map = EnhancedMap.fromObject({ a: 1, b: 2 })
    const arr = map.toArray()
    expect(arr).toBeInstanceOf(EnhancedArray)
    expect(arr).toHaveLength(2)
  })

  it('toObject() converts to plain object', () => {
    const map = EnhancedMap.fromObject({ x: 10, y: 20 })
    const obj = map.toObject()
    expect(obj).toEqual({ x: 10, y: 20 })
  })
})

describe('collectMap() factory', () => {
  it('creates an EnhancedMap', () => {
    const map = collectMap([
      ['a', 1],
      ['b', 2],
    ])
    expect(map).toBeInstanceOf(EnhancedMap)
    expect(map.size).toBe(2)
  })
})
