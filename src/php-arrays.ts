/**
 * PHP-like array functions for JavaScript
 * Provides exact API compatibility between PHP arrays and JavaScript arrays
 */

import { EnhancedArray } from './collections.js'

// PHP array function equivalents
/**
 * Split an array into chunks.
 *
 * @param {T[]} array The array to chunk
 * @param {number} size The size of each chunk
 * @returns {T[][]} An array of chunks
 */
export const array_chunk = <T>(array: T[], size: number): T[][] => {
  if (0 >= size) {
    return []
  }
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * Filter elements of an array using a callback function.
 *
 * @param {T[]} array The array to filter
 * @param {Function} [callback] The callback function to use
 * @returns {T[]} The filtered array
 */
export const array_filter = <T>(array: T[], callback?: (value: T, index: number) => boolean): T[] => {
  if (!callback) {
    return array.filter((item) => Boolean(item))
  }
  return array.filter(callback)
}

/**
 * Apply a callback to the elements of the given arrays.
 *
 * @param {Function} callback The callback function to apply
 * @param {T[]} array The array to map over
 * @returns {U[]} The mapped array
 */
export const array_map = <T, U>(callback: (value: T, index: number) => U, array: T[]): U[] => {
  return array.map(callback)
}

/**
 * Iteratively reduce the array to a single value using a callback function.
 *
 * @param {T[]} array The source array
 * @param {Function} callback The callback function
 * @param {U} initial The initial value
 * @returns {U} The reduced value
 */
export const array_reduce = <T, U>(array: T[], callback: (carry: U, item: T, index: number) => U, initial: U): U => {
  return array.reduce((carry, item, index) => callback(carry, item, index), initial)
}

/**
 * Merge one or more arrays.
 *
 * @param {...T[][]} arrays The arrays to merge
 * @returns {T[]} The merged array
 */
export const array_merge = <T>(...arrays: T[][]): T[] => {
  return arrays.flat()
}

/**
 * Remove duplicate values from an array.
 *
 * @param {T[]} array The source array
 * @returns {T[]} The array with unique values
 */
export const array_unique = <T>(array: T[]): T[] => {
  return [...new Set(array)]
}

/**
 * Return an array with elements in reverse order.
 *
 * @param {T[]} array The source array
 * @param {boolean} [_preserveKeys=false] Whether to preserve keys (ignored for JS arrays)
 * @returns {T[]} The reversed array
 */
export const array_reverse = <T>(array: T[], _preserveKeys: boolean = false): T[] => {
  return [...array].reverse()
}

/**
 * Extract a slice of the array.
 *
 * @param {T[]} array The source array
 * @param {number} offset The starting offset
 * @param {number} [length] The length of the slice
 * @returns {T[]} The sliced portion of the array
 */
export const array_slice = <T>(array: T[], offset: number, length?: number): T[] => {
  const start = 0 > offset ? Math.max(0, array.length + offset) : offset
  const end = length !== undefined ? start + length : undefined
  return array.slice(start, end)
}

/**
 * Remove a portion of the array and replace it with something else.
 *
 * @param {T[]} array The source array
 * @param {number} offset The starting offset
 * @param {number} [length] The number of elements to remove
 * @param {...T[]} replacement The elements to replace with
 * @returns {T[]} The modified array (copy)
 */
export const array_splice = <T>(array: T[], offset: number, length?: number, ...replacement: T[]): T[] => {
  const result = [...array]
  const actualLength = length ?? result.length - offset
  result.splice(offset, actualLength, ...replacement)
  return result
}

/**
 * Return all the keys or a subset of the keys of an array.
 *
 * @param {T[]} array The source array
 * @returns {number[]} The array keys (indices)
 */
export const array_keys = <T>(array: T[]): number[] => {
  return array.map((_, index) => index)
}

/**
 * Search an array for a given value and return the corresponding key if successful.
 *
 * @param {T} needle The value to search for
 * @param {T[]} haystack The array to search in
 * @returns {number | false} The key if found, false otherwise
 */
export const array_search = <T>(needle: T, haystack: T[]): number | false => {
  const index = haystack.indexOf(needle)
  return -1 !== index ? index : false
}

/**
 * Check if the given key or index exists in the array.
 *
 * @param {number} key The key to check
 * @param {T[]} array The source array
 * @returns {boolean} True if the key exists
 */
export const array_key_exists = <T>(key: number, array: T[]): boolean => {
  return 0 <= key && key < array.length
}

/**
 * Pop the element off the end of array.
 *
 * @param {T[]} array The source array
 * @returns {T | undefined} The popped element
 */
export const array_pop = <T>(array: T[]): T | undefined => {
  const result = [...array]
  return result.pop()
}

/**
 * Push one or more elements onto the end of array.
 *
 * @param {T[]} array The source array
 * @param {...T[]} values The values to push
 * @returns {T[]} The modified array (copy)
 */
export const array_push = <T>(array: T[], ...values: T[]): T[] => {
  return [...array, ...values]
}

/**
 * Shift an element off the beginning of array.
 *
 * @param {T[]} array The source array
 * @returns {T | undefined} The shifted element
 */
export const array_shift = <T>(array: T[]): T | undefined => {
  const result = [...array]
  return result.shift()
}

/**
 * Prepend one or more elements to the beginning of an array.
 *
 * @param {T[]} array The source array
 * @param {...T[]} values The values to prepend
 * @returns {T[]} The modified array (copy)
 */
export const array_unshift = <T>(array: T[], ...values: T[]): T[] => {
  return [...values, ...array]
}

/**
 * Calculate the sum of values in an array.
 *
 * @param {number[]} array The source array
 * @returns {number} The sum of values
 */
export const array_sum = (array: number[]): number => {
  return array.reduce((sum, num) => sum + num, 0)
}

/**
 * Calculate the product of values in an array.
 *
 * @param {number[]} array The source array
 * @returns {number} The product of values
 */
export const array_product = (array: number[]): number => {
  return array.reduce((product, num) => product * num, 1)
}

/**
 * Pick one or more random entries out of an array.
 *
 * @param {T[]} array The source array
 * @param {number} [num=1] The number of entries to pick
 * @returns {T | T[] | undefined} The random entry or entries
 */
export const array_rand = <T>(array: T[], num: number = 1): T | T[] | undefined => {
  if (0 === array.length) {
    return 1 === num ? undefined : []
  }

  const shuffled = [...array].sort(() => Math.random() - 0.5)

  if (1 === num) {
    return shuffled[0]
  }

  return shuffled.slice(0, Math.min(num, array.length))
}

/**
 * Exchange all keys with their associated values in an array.
 *
 * @param {T[]} array The source array
 * @returns {Record<string, number>} The flipped record
 */
export const array_flip = <T extends string | number>(array: T[]): Record<string, number> => {
  const result: Record<string, number> = {}
  array.forEach((value, index) => {
    result[String(value)] = index
  })
  return result
}

/**
 * Count all the values of an array.
 *
 * @param {T[]} array The source array
 * @returns {Record<string, number>} A record of values and their counts
 */
export const array_count_values = <T extends string | number>(array: T[]): Record<string, number> => {
  const result: Record<string, number> = {}
  array.forEach((value) => {
    const key = String(value)
    result[key] = (result[key] || 0) + 1
  })
  return result
}

// Advanced PHP array functions
/**
 * Compute the intersection of arrays.
 *
 * @param {...T[][]} arrays The arrays to intersect
 * @returns {T[]} The intersection of the arrays
 */
export const array_intersect = <T>(...arrays: T[][]): T[] => {
  if (0 === arrays.length) {
    return []
  }

  const first = arrays[0]
  return first.filter((item) => arrays.slice(1).every((arr) => arr.includes(item)))
}

/**
 * Compute the difference of arrays.
 *
 * @param {T[]} array1 The array to compare from
 * @param {...T[][]} arrays The arrays to compare against
 * @returns {T[]} The difference of the arrays
 */
export const array_diff = <T>(array1: T[], ...arrays: T[][]): T[] => {
  const otherItems = new Set(arrays.flat())
  return array1.filter((item) => !otherItems.has(item))
}

/**
 * Return the values from a single column in the input array.
 *
 * @param {T[]} array The source array of objects
 * @param {K} column The column to retrieve
 * @returns {T[K][]} The array of column values
 */
export const array_column = <T, K extends keyof T>(array: T[], column: K): T[K][] => {
  return array
    .map((item) => (item && 'object' === typeof item ? item[column] : undefined))
    .filter((value) => value !== undefined) as T[K][]
}

// PHP sorting functions
/**
 * Sort an array.
 *
 * @param {T[]} array The source array
 * @returns {T[]} The sorted array (copy)
 */
export const sort = <T>(array: T[]): T[] => {
  return [...array].sort()
}

/**
 * Sort an array in reverse order.
 *
 * @param {T[]} array The source array
 * @returns {T[]} The sorted array (copy)
 */
export const rsort = <T>(array: T[]): T[] => {
  return [...array].sort().reverse()
}

/**
 * Sort an array with a user-defined comparison function.
 *
 * @param {T[]} array The source array
 * @param {Function} compareFunction The comparison function
 * @returns {T[]} The sorted array (copy)
 */
export const usort = <T>(array: T[], compareFunction: (a: T, b: T) => number): T[] => {
  return [...array].sort(compareFunction)
}

/**
 * Sort an array with a user-defined comparison function and maintain index association.
 *
 * @param {T[]} array The source array
 * @param {Function} compareFunction The comparison function
 * @returns {T[]} The sorted array (copy)
 */
export const uasort = <T>(array: T[], compareFunction: (a: T, b: T) => number): T[] => {
  return [...array].sort(compareFunction)
}

/**
 * Sort an array by keys using a user-defined comparison function.
 *
 * @param {T[]} array The source array
 * @param {Function} compareFunction The comparison function
 * @returns {T[]} The sorted array (copy)
 */
export const uksort = <T>(array: T[], compareFunction: (a: number, b: number) => number): T[] => {
  const indices = Array.from({ length: array.length }, (_, i) => i)
  const sortedIndices = indices.sort(compareFunction)
  return sortedIndices.map((i) => array[i])
}

/**
 * Shuffle an array.
 *
 * @param {T[]} array The source array
 * @returns {T[]} The shuffled array (copy)
 */
export const shuffle = <T>(array: T[]): T[] => {
  const result = [...array]
  for (let i = result.length - 1; 0 < i; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// Range function like PHP
/**
 * Create an array containing a range of elements.
 *
 * @param {number} start First value of the sequence
 * @param {number} end The sequence is stopped when end is reached
 * @param {number} [step=1] The increment used in the range
 * @returns {number[]} The array of elements
 */
export const range = (start: number, end: number, step: number = 1): number[] => {
  const result: number[] = []

  if (0 < step) {
    for (let i = start; i <= end; i += step) {
      result.push(i)
    }
  } else if (0 > step) {
    for (let i = start; i >= end; i += step) {
      result.push(i)
    }
  }

  return result
}

// Create PHP-like array from JavaScript array
/**
 * Create an EnhancedArray with PHP-like methods.
 *
 * @param {T[]} items The source items
 * @returns {EnhancedArray<T>} The enhanced array
 */
export const php_array = <T>(items: T[]): EnhancedArray<T> => {
  const enhanced = new EnhancedArray(...items)

  // Add PHP-like methods
  Object.assign(enhanced, {
    // PHP array functions as methods
    chunk: (size: number) => array_chunk(enhanced, size),
    merge: (...arrays: T[][]) => new EnhancedArray(...array_merge(enhanced, ...arrays)),
    unique: () => new EnhancedArray(...array_unique(enhanced)),
    reverse: (preserveKeys = false) => new EnhancedArray(...array_reverse(enhanced, preserveKeys)),
    search: (needle: T) => array_search(needle, enhanced),
    sum: () => array_sum(enhanced as unknown as number[]),
    product: () => array_product(enhanced as unknown as number[]),
    rand: (num = 1) => array_rand(enhanced, num),
    flip: () => array_flip(enhanced as unknown as (string | number)[]),
    countValues: () => array_count_values(enhanced as unknown as (string | number)[]),
    intersect: (...arrays: T[][]) => new EnhancedArray(...array_intersect(enhanced, ...arrays)),
    diff: (...arrays: T[][]) => new EnhancedArray(...array_diff(enhanced, ...arrays)),
    column: <K extends keyof T>(column: K) =>
      (array_column as (arr: unknown[], col: unknown) => T[K][])(enhanced, column),

    // PHP sorting as methods
    sort: () => new EnhancedArray(...sort(enhanced)),
    rsort: () => new EnhancedArray(...rsort(enhanced)),
    shuffle: () => new EnhancedArray(...shuffle(enhanced)),
    usort: (compareFunction: (a: T, b: T) => number) => new EnhancedArray(...usort(enhanced, compareFunction)),
  })

  return enhanced
}
