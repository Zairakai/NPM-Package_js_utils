import { describe, expect, it } from 'vitest'
import {
  array_chunk,
  array_column,
  array_count_values,
  array_diff,
  array_filter,
  array_flip,
  array_intersect,
  array_key_exists,
  array_keys,
  array_map,
  array_merge,
  array_pop,
  array_product,
  array_push,
  array_rand,
  array_reduce,
  array_reverse,
  array_search,
  array_shift,
  array_slice,
  array_splice,
  array_sum,
  array_unique,
  array_unshift,
  php_array,
  range,
  rsort,
  shuffle,
  sort,
  uasort,
  uksort,
  usort,
} from '../../src/php-arrays'

describe('array_chunk()', () => {
  it('splits array into chunks', () => {
    expect(array_chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  })

  it('returns empty array for size <= 0', () => {
    expect(array_chunk([1, 2, 3], 0)).toEqual([])
    expect(array_chunk([1, 2, 3], -1)).toEqual([])
  })
})

describe('array_filter()', () => {
  it('filters falsy values without callback', () => {
    expect(array_filter([0, 1, false, 2, null, 3, undefined, ''])).toEqual([1, 2, 3])
  })

  it('filters with callback', () => {
    expect(array_filter([1, 2, 3, 4], (v) => v % 2 === 0)).toEqual([2, 4])
  })
})

describe('array_map()', () => {
  it('maps values with callback', () => {
    expect(array_map((v) => v * 2, [1, 2, 3])).toEqual([2, 4, 6])
  })
})

describe('array_reduce()', () => {
  it('reduces array to single value', () => {
    expect(array_reduce([1, 2, 3, 4], (carry, item) => carry + item, 0)).toBe(10)
  })
})

describe('array_merge()', () => {
  it('merges multiple arrays', () => {
    expect(array_merge([1, 2], [3, 4], [5])).toEqual([1, 2, 3, 4, 5])
  })
})

describe('array_unique()', () => {
  it('removes duplicate values', () => {
    expect(array_unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
  })
})

describe('array_reverse()', () => {
  it('reverses array without mutating original', () => {
    const original = [1, 2, 3]
    const reversed = array_reverse(original)
    expect(reversed).toEqual([3, 2, 1])
    expect(original).toEqual([1, 2, 3])
  })
})

describe('array_slice()', () => {
  it('slices from offset', () => {
    expect(array_slice([1, 2, 3, 4, 5], 1, 3)).toEqual([2, 3, 4])
  })

  it('handles negative offset', () => {
    expect(array_slice([1, 2, 3, 4, 5], -2)).toEqual([4, 5])
  })

  it('handles no length', () => {
    expect(array_slice([1, 2, 3], 1)).toEqual([2, 3])
  })
})

describe('array_splice()', () => {
  it('removes elements', () => {
    expect(array_splice([1, 2, 3, 4], 1, 2)).toEqual([1, 4])
  })

  it('replaces elements', () => {
    expect(array_splice([1, 2, 3, 4], 1, 2, 10, 20)).toEqual([1, 10, 20, 4])
  })
})

describe('array_keys()', () => {
  it('returns array of indices', () => {
    expect(array_keys(['a', 'b', 'c'])).toEqual([0, 1, 2])
  })
})

describe('array_search()', () => {
  it('returns index when found', () => {
    expect(array_search(2, [1, 2, 3])).toBe(1)
  })

  it('returns false when not found', () => {
    expect(array_search(9, [1, 2, 3])).toBe(false)
  })
})

describe('array_key_exists()', () => {
  it('returns true for valid index', () => {
    expect(array_key_exists(0, [1, 2, 3])).toBe(true)
    expect(array_key_exists(2, [1, 2, 3])).toBe(true)
  })

  it('returns false for out-of-bounds', () => {
    expect(array_key_exists(3, [1, 2, 3])).toBe(false)
    expect(array_key_exists(-1, [1, 2, 3])).toBe(false)
  })
})

describe('array_pop()', () => {
  it('returns last element', () => {
    expect(array_pop([1, 2, 3])).toBe(3)
  })

  it('returns undefined for empty array', () => {
    expect(array_pop([])).toBeUndefined()
  })
})

describe('array_push()', () => {
  it('appends values', () => {
    expect(array_push([1, 2], 3, 4)).toEqual([1, 2, 3, 4])
  })
})

describe('array_shift()', () => {
  it('returns first element', () => {
    expect(array_shift([1, 2, 3])).toBe(1)
  })

  it('returns undefined for empty array', () => {
    expect(array_shift([])).toBeUndefined()
  })
})

describe('array_unshift()', () => {
  it('prepends values', () => {
    expect(array_unshift([3, 4], 1, 2)).toEqual([1, 2, 3, 4])
  })
})

describe('array_sum()', () => {
  it('sums numbers', () => {
    expect(array_sum([1, 2, 3, 4])).toBe(10)
  })

  it('returns 0 for empty array', () => {
    expect(array_sum([])).toBe(0)
  })
})

describe('array_product()', () => {
  it('multiplies numbers', () => {
    expect(array_product([1, 2, 3, 4])).toBe(24)
  })

  it('returns 1 for empty array', () => {
    expect(array_product([])).toBe(1)
  })
})

describe('array_rand()', () => {
  it('returns single element by default', () => {
    const result = array_rand([1, 2, 3])
    expect([1, 2, 3]).toContain(result)
  })

  it('returns multiple elements when num > 1', () => {
    const result = array_rand([1, 2, 3, 4], 2) as number[]
    expect(result).toHaveLength(2)
    result.forEach((v) => expect([1, 2, 3, 4]).toContain(v))
  })

  it('returns undefined for empty array with num=1', () => {
    expect(array_rand([], 1)).toBeUndefined()
  })

  it('returns empty array for empty array with num>1', () => {
    expect(array_rand([], 2)).toEqual([])
  })
})

describe('array_flip()', () => {
  it('flips values to keys', () => {
    const result = array_flip(['a', 'b', 'c'])
    expect(result['a']).toBe(0)
    expect(result['b']).toBe(1)
    expect(result['c']).toBe(2)
  })
})

describe('array_count_values()', () => {
  it('counts occurrences', () => {
    const result = array_count_values(['a', 'b', 'a', 'c', 'b', 'a'])
    expect(result['a']).toBe(3)
    expect(result['b']).toBe(2)
    expect(result['c']).toBe(1)
  })
})

describe('array_intersect()', () => {
  it('returns common elements', () => {
    expect(array_intersect([1, 2, 3], [2, 3, 4], [3, 4, 5])).toEqual([3])
  })

  it('returns empty for no intersection', () => {
    expect(array_intersect([1, 2], [3, 4])).toEqual([])
  })

  it('returns empty for no arrays', () => {
    expect(array_intersect()).toEqual([])
  })
})

describe('array_diff()', () => {
  it('returns elements not in other arrays', () => {
    expect(array_diff([1, 2, 3, 4], [2, 4])).toEqual([1, 3])
  })
})

describe('array_column()', () => {
  it('extracts column from array of objects', () => {
    const data = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]
    expect(array_column(data, 'name')).toEqual(['Alice', 'Bob'])
  })
})

describe('sort()', () => {
  it('sorts array without mutating original', () => {
    const arr = [3, 1, 4, 1, 5]
    const sorted = sort(arr)
    expect(sorted[0]).toBe(1)
    expect(arr[0]).toBe(3)
  })
})

describe('rsort()', () => {
  it('reverse sorts array', () => {
    expect(rsort([1, 3, 2])[0]).toBe(3)
  })
})

describe('usort()', () => {
  it('sorts with custom comparator', () => {
    expect(usort([3, 1, 2], (a, b) => a - b)).toEqual([1, 2, 3])
  })
})

describe('uasort()', () => {
  it('sorts with custom comparator', () => {
    expect(uasort([3, 1, 2], (a, b) => a - b)).toEqual([1, 2, 3])
  })
})

describe('uksort()', () => {
  it('sorts by key indices with custom comparator', () => {
    const result = uksort(['c', 'a', 'b'], (a, b) => b - a)
    expect(result).toEqual(['b', 'a', 'c'])
  })
})

describe('shuffle()', () => {
  it('returns same elements in possibly different order', () => {
    const arr = [1, 2, 3, 4, 5]
    const shuffled = shuffle(arr)
    expect(shuffled).toHaveLength(arr.length)
    arr.forEach((v) => expect(shuffled).toContain(v))
  })
})

describe('range()', () => {
  it('generates ascending range', () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('generates range with step', () => {
    expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8, 10])
  })

  it('generates descending range with negative step', () => {
    expect(range(5, 1, -1)).toEqual([5, 4, 3, 2, 1])
  })

  it('returns empty for zero step', () => {
    expect(range(1, 5, 0)).toEqual([])
  })
})

describe('php_array()', () => {
  it('creates an EnhancedArray with PHP-like methods', () => {
    const arr = php_array([3, 1, 2])
    expect(arr).toHaveLength(3)
    expect(arr.sum()).toBe(6)
  })

  it('chunk() method works', () => {
    const arr = php_array([1, 2, 3, 4])
    expect(JSON.parse(JSON.stringify(arr.chunk(2)))).toEqual([
      [1, 2],
      [3, 4],
    ])
  })

  it('unique() method works', () => {
    const arr = php_array([1, 2, 2, 3])
    expect([...arr.unique()]).toEqual([1, 2, 3])
  })

  it('reverse() method works', () => {
    const arr = php_array([1, 2, 3])
    expect([...arr.reverse()]).toEqual([3, 2, 1])
  })

  it('search() method works', () => {
    const arr = php_array([1, 2, 3])
    expect(arr.search(2)).toBe(1)
    expect(arr.search(9)).toBe(false)
  })

  it('merge() method works', () => {
    const arr = php_array([1, 2])
    expect([...arr.merge([3, 4])]).toEqual([1, 2, 3, 4])
  })

  it('diff() method works', () => {
    const arr = php_array([1, 2, 3, 4])
    expect([...arr.diff([2, 4])]).toEqual([1, 3])
  })

  it('intersect() method works', () => {
    const arr = php_array([1, 2, 3])
    expect([...arr.intersect([2, 3, 4])]).toEqual([2, 3])
  })

  it('sort() method works', () => {
    const arr = php_array([3, 1, 2])
    expect([...arr.sort()][0]).toBe(1)
  })

  it('flip() method works', () => {
    const arr = php_array(['a', 'b', 'c'])
    const flipped = arr.flip()
    expect(flipped['a']).toBe(0)
  })

  it('countValues() method works', () => {
    const arr = php_array(['a', 'b', 'a'])
    const counts = arr.countValues()
    expect(counts['a']).toBe(2)
  })

  it('product() method works', () => {
    const arr = php_array([2, 3, 4])
    expect(arr.product()).toBe(24)
  })
})
