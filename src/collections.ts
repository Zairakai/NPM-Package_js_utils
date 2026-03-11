/**
 * Collection utilities for JavaScript arrays and objects
 * Inspired by Laravel Collections with modern JavaScript features
 */

import { isEqual } from './equals.js'

// Type definitions
/**
 * Generic callback type for collection operations.
 */
export type Callback<T, R> = (item: T, index: number) => R

/**
 * Predicate type for collection filtering and validation.
 */
export type Predicate<T> = (item: T, index: number) => boolean

/**
 * Enhanced Array class with Laravel Collection-like methods.
 * Extends the native Array class with additional utility methods for manipulation,
 * validation, and statistical analysis.
 */
export class EnhancedArray<T> extends Array<T> {
  protected originalItems: T[]

  /**
   * Create a new EnhancedArray instance.
   *
   * @param {...T[]} items The items to initialize the collection with
   */
  constructor(...items: T[]) {
    super(...items)
    Object.setPrototypeOf(this, EnhancedArray.prototype)
    this.originalItems = structuredClone(items)
  }

  /**
   * Determine if the collection has been modified since initialization or last sync.
   *
   * @returns {boolean} True if modified, false otherwise
   */
  isDirty(): boolean {
    return !isEqual(this.originalItems, Array.from(this))
  }

  /**
   * Determine if the collection is clean (not modified).
   *
   * @returns {boolean} True if not modified, false otherwise
   */
  isClean(): boolean {
    return !this.isDirty()
  }

  /**
   * Sync the original items with current items to mark the collection as clean.
   *
   * @returns {this} The collection instance
   */
  syncOriginal(): this {
    this.originalItems = structuredClone(Array.from(this))
    return this
  }

  /**
   * Compare with another array or collection for equality.
   *
   * @param {T[] | EnhancedArray<T>} other The array or collection to compare with
   * @returns {boolean} True if equivalent, false otherwise
   */
  isEquivalent(other: T[] | EnhancedArray<T>): boolean {
    return isEqual(Array.from(this), Array.from(other))
  }

  /**
   * Create an EnhancedArray from an iterable or array-like object.
   *
   * @param {Iterable<T> | ArrayLike<T>} items The items to convert
   * @returns {EnhancedArray<T>} A new EnhancedArray instance
   */
  static from<T>(items: Iterable<T> | ArrayLike<T>): EnhancedArray<T> {
    return new EnhancedArray(...Array.from(items))
  }

  /**
   * Create an EnhancedArray from a variable number of arguments.
   *
   * @param {...T[]} items The items to include
   * @returns {EnhancedArray<T>} A new EnhancedArray instance
   */
  static of<T>(...items: T[]): EnhancedArray<T> {
    return new EnhancedArray(...items)
  }

  // Laravel Collection inspired methods
  /**
   * Create a new collection instance from the current items.
   *
   * @returns {EnhancedArray<T>} A new EnhancedArray instance
   */
  collect(): EnhancedArray<T> {
    return new EnhancedArray(...this)
  }

  /**
   * Pluck an array of values from an array of objects.
   *
   * @param {K} key The key to pluck
   * @returns {EnhancedArray<T[K]>} A new collection of plucked values
   */
  pluck<K extends keyof T>(key: K): EnhancedArray<T[K]> {
    return new EnhancedArray(
      ...(this.map((item) => (item && 'object' === typeof item ? item[key] : undefined)).filter(
        (val) => val !== undefined
      ) as T[K][])
    )
  }

  /**
   * Group the collection's items by a given key or callback.
   *
   * @param {K | Callback<T, string | number>} key The key or callback to group by
   * @returns {Record<string, EnhancedArray<T>>} A record of grouped collections
   */
  groupBy<K extends keyof T>(key: K | Callback<T, string | number>): Record<string, EnhancedArray<T>> {
    const groups: Record<string, EnhancedArray<T>> = {}

    for (let i = 0; i < this.length; i++) {
      const item = this[i]
      const groupKey =
        'function' === typeof key ? String(key(item, i)) : String(item && 'object' === typeof item ? item[key] : item)

      if (!groups[groupKey]) {
        groups[groupKey] = new EnhancedArray<T>()
      }
      groups[groupKey].push(item)
    }

    return groups
  }

  /**
   * Return only unique items from the collection.
   *
   * @param {K} [key] Optional key to determine uniqueness for objects
   * @returns {EnhancedArray<T>} A new collection of unique items
   */
  unique<K extends keyof T>(key?: K): EnhancedArray<T> {
    if (!key) {
      return new EnhancedArray(...new Set(this))
    }

    const seen = new Set()
    return new EnhancedArray(
      ...this.filter((item) => {
        const value = item && 'object' === typeof item ? item[key] : item
        if (seen.has(value)) {
          return false
        }
        seen.add(value)
        return true
      })
    )
  }

  /**
   * Chunk the collection into smaller collections of a given size.
   *
   * @param {number} size The size of each chunk
   * @returns {EnhancedArray<EnhancedArray<T>>} A collection of chunked collections
   */
  chunk(size: number): EnhancedArray<EnhancedArray<T>> {
    const chunks = new EnhancedArray<EnhancedArray<T>>()
    for (let i = 0; i < this.length; i += size) {
      chunks.push(new EnhancedArray(...this.slice(i, i + size)))
    }
    return chunks
  }

  // Advanced manipulation methods
  /**
   * Flatten a multi-dimensional collection into a single level.
   *
   * @param {number} [depth=Infinity] The depth to flatten to
   * @returns {EnhancedArray<unknown>} A new flattened collection
   */
  deepFlatten(depth: number = Infinity): EnhancedArray<unknown> {
    const flatten = (arr: unknown[], currentDepth: number): unknown[] => {
      const result: unknown[] = []

      for (const item of arr) {
        if (Array.isArray(item) && 0 < currentDepth) {
          result.push(...flatten(item, currentDepth - 1))
        } else {
          result.push(item)
        }
      }

      return result
    }

    return new EnhancedArray(...flatten(this, depth))
  }

  /**
   * Rotate the collection by a given number of positions.
   *
   * @param {number} [positions=1] The number of positions to rotate
   * @returns {EnhancedArray<T>} A new rotated collection
   */
  rotate(positions: number = 1): EnhancedArray<T> {
    if (0 === this.length) {
      return new EnhancedArray<T>()
    }

    const count = this.length
    positions = positions % count

    if (0 === positions) {
      return this.collect()
    }
    if (0 > positions) {
      positions = count + positions
    }

    return new EnhancedArray(...this.slice(positions), ...this.slice(0, positions))
  }

  /**
   * Chunk the collection as long as the given predicate returns true.
   *
   * @param {Predicate<T>} predicate The predicate to check
   * @returns {EnhancedArray<EnhancedArray<T>>} A collection of chunked collections
   */
  chunkWhile(predicate: Predicate<T>): EnhancedArray<EnhancedArray<T>> {
    const chunks = new EnhancedArray<EnhancedArray<T>>()
    let currentChunk = new EnhancedArray<T>()

    for (let i = 0; i < this.length; i++) {
      const item = this[i]

      if (0 < currentChunk.length && !predicate(item, i)) {
        chunks.push(currentChunk)
        currentChunk = new EnhancedArray<T>()
      }

      currentChunk.push(item)
    }

    if (0 < currentChunk.length) {
      chunks.push(currentChunk)
    }

    return chunks
  }

  /**
   * Transpose the collection (swap rows and columns).
   *
   * @returns {EnhancedArray<EnhancedArray<unknown>>} A new transposed collection
   */
  transpose(): EnhancedArray<EnhancedArray<unknown>> {
    if (0 === this.length) {
      return new EnhancedArray()
    }

    const maxLength = Math.max(...this.map((row) => (Array.isArray(row) ? row.length : 1)))

    const result = new EnhancedArray<EnhancedArray<unknown>>()

    for (let i = 0; i < maxLength; i++) {
      const column = new EnhancedArray(
        ...this.map((row) => {
          if (Array.isArray(row)) {
            return row[i] ?? null
          }
          return 0 === i ? row : null
        })
      )

      result.push(column)
    }

    return result
  }

  // Validation methods
  /**
   * Check if the collection is sorted.
   *
   * @param {Function} [compareFn] Optional comparison function
   * @returns {boolean} True if sorted, false otherwise
   */
  isSorted(compareFn?: (a: T, b: T) => number): boolean {
    if (1 >= this.length) {
      return true
    }

    for (let i = 1; i < this.length; i++) {
      const prev = this[i - 1]
      const current = this[i]

      if (compareFn) {
        if (0 < compareFn(prev, current)) {
          return false
        }
      } else {
        if (prev > current) {
          return false
        }
      }
    }

    return true
  }

  /**
   * Check if the collection contains duplicate items.
   *
   * @param {K} [key] Optional key to check for uniqueness in objects
   * @returns {boolean} True if duplicates found, false otherwise
   */
  hasDuplicates<K extends keyof T>(key?: K): boolean {
    if (key) {
      const seen = new Set()
      for (const item of this) {
        const value = item && 'object' === typeof item ? item[key] : item
        if (seen.has(value)) {
          return true
        }
        seen.add(value)
      }
      return false
    }

    return this.length !== new Set(this).size
  }

  // Statistical methods
  /**
   * Calculate the median value of the collection.
   *
   * @param {Callback<T, number>} [accessor] Optional accessor for non-numeric items
   * @returns {number | null} The median value or null if collection is empty
   */
  median(accessor?: Callback<T, number>): number | null {
    if (0 === this.length) {
      return null
    }

    const values = accessor ? this.map(accessor) : (this as unknown as number[])
    const sorted = [...values].sort((a, b) => (a as number) - (b as number))
    const count = sorted.length

    if (0 === count % 2) {
      return ((sorted[count / 2 - 1] as number) + (sorted[count / 2] as number)) / 2
    }

    return sorted[Math.floor(count / 2)] as number
  }

  /**
   * Calculate the mode (most frequent values) of the collection.
   *
   * @param {Callback<T, unknown>} [accessor] Optional accessor for the values
   * @returns {EnhancedArray<unknown>} A collection of mode values
   */
  mode(accessor?: Callback<T, unknown>): EnhancedArray<unknown> {
    if (0 === this.length) {
      return new EnhancedArray()
    }

    const frequencies = this.frequencies(accessor)
    const maxFrequency = Math.max(...Object.values(frequencies))

    return new EnhancedArray(...Object.keys(frequencies).filter((key) => frequencies[key] === maxFrequency))
  }

  /**
   * Calculate the standard deviation of the collection.
   *
   * @param {Callback<T, number>} [accessor] Optional accessor for non-numeric items
   * @returns {number} The standard deviation
   */
  standardDeviation(accessor?: Callback<T, number>): number {
    if (0 === this.length) {
      return 0
    }

    const values = accessor ? this.map(accessor) : (this as unknown as number[])
    const mean = (values as number[]).reduce((sum, val) => (sum as number) + (val as number), 0) / values.length
    const sumSquaredDifferences = (values as number[]).reduce(
      (sum, val) => (sum as number) + Math.pow((val as number) - mean, 2),
      0
    )

    return Math.sqrt((sumSquaredDifferences as number) / values.length)
  }

  /**
   * Calculate a specific percentile of the collection.
   *
   * @param {number} percentile The percentile to calculate (0-100)
   * @param {Callback<T, number>} [accessor] Optional accessor for non-numeric items
   * @returns {number | null} The percentile value or null if collection is empty
   */
  percentile(percentile: number, accessor?: Callback<T, number>): number | null {
    if (0 === this.length) {
      return null
    }

    const values = accessor ? this.map(accessor) : (this as unknown as number[])
    const sorted = [...values].sort((a, b) => (a as number) - (b as number))
    const index = (percentile / 100) * (sorted.length - 1)
    const lower = Math.floor(index)
    const upper = Math.ceil(index)

    if (lower === upper) {
      return sorted[lower] as number
    }

    const weight = index - lower
    return (sorted[lower] as number) * (1 - weight) + (sorted[upper] as number) * weight
  }

  /**
   * Calculate the frequencies of items in the collection.
   *
   * @param {Callback<T, unknown>} [accessor] Optional accessor for the values
   * @returns {Record<string, number>} A record of values and their frequencies
   */
  frequencies(accessor?: Callback<T, unknown>): Record<string, number> {
    const frequencies: Record<string, number> = {}

    for (let i = 0; i < this.length; i++) {
      const item = this[i]
      const key = accessor ? String(accessor(item, i)) : String(item)
      frequencies[key] = (frequencies[key] || 0) + 1
    }

    return frequencies
  }

  // Advanced operations
  /**
   * Calculate the Cartesian product of the collection and other arrays.
   *
   * @param {...U[][]} arrays The arrays to calculate the product with
   * @returns {EnhancedArray<[T, ...U[]]>} A collection of product combinations
   */
  cartesian<U>(...arrays: U[][]): EnhancedArray<[T, ...U[]]> {
    const result = new EnhancedArray<[T, ...U[]]>()

    const allArrays = [this, ...arrays]

    function* cartesianProduct(arrays: unknown[][], index = 0, current: unknown[] = []): Generator<unknown[]> {
      if (index === arrays.length) {
        yield [...current]
        return
      }

      for (const item of arrays[index]) {
        yield* cartesianProduct(arrays, index + 1, [...current, item])
      }
    }

    for (const combination of cartesianProduct(allArrays)) {
      result.push(combination as [T, ...U[]])
    }

    return result
  }

  /**
   * Interleave the collection with other arrays.
   *
   * @param {...U[][]} arrays The arrays to interleave with
   * @returns {EnhancedArray<T | U>} A new interleaved collection
   */
  interleave<U>(...arrays: U[][]): EnhancedArray<T | U> {
    const result = new EnhancedArray<T | U>()
    const allArrays = [this, ...arrays]
    const maxLength = Math.max(...allArrays.map((arr) => arr.length))

    for (let i = 0; i < maxLength; i++) {
      for (const array of allArrays) {
        if (i < array.length) {
          result.push(array[i])
        }
      }
    }

    return result
  }

  /**
   * Get a sliding window of items from the collection.
   *
   * @param {number} [size=2] The size of the window
   * @param {number} [step=1] The step between windows
   * @returns {EnhancedArray<EnhancedArray<T>>} A collection of window collections
   */
  sliding(size: number = 2, step: number = 1): EnhancedArray<EnhancedArray<T>> {
    if (0 >= size || 0 >= step) {
      return new EnhancedArray()
    }

    const windows = new EnhancedArray<EnhancedArray<T>>()

    for (let i = 0; i <= this.length - size; i += step) {
      windows.push(new EnhancedArray(...this.slice(i, i + size)))
    }

    return windows
  }

  // Navigation macros
  /**
   * Get the item at the given index.
   *
   * @param {number} index The index to retrieve
   * @returns {T | undefined} The item at the index or undefined
   */
  at(index: number): T | undefined {
    return this[index]
  }

  /**
   * Get the item before the given item.
   *
   * @param {T} item The item to search for
   * @returns {T | undefined} The item before or undefined
   */
  before(item: T): T | undefined {
    const index = this.indexOf(item)
    return 0 < index ? this[index - 1] : undefined
  }

  /**
   * Get the item after the given item.
   *
   * @param {T} item The item to search for
   * @returns {T | undefined} The item after or undefined
   */
  after(item: T): T | undefined {
    const index = this.indexOf(item)
    return 0 <= index && index < this.length - 1 ? this[index + 1] : undefined
  }

  // Transformation macros
  /**
   * Chunk the collection by a given key or callback when its value changes.
   *
   * @param {K | Callback<T, unknown>} key The key or callback to chunk by
   * @returns {EnhancedArray<EnhancedArray<T>>} A collection of chunked collections
   */
  chunkBy<K extends keyof T>(key: K | Callback<T, unknown>): EnhancedArray<EnhancedArray<T>> {
    if (0 === this.length) {
      return new EnhancedArray()
    }

    const chunks = new EnhancedArray<EnhancedArray<T>>()
    let currentChunk = new EnhancedArray<T>()
    let lastValue: unknown = null

    for (let i = 0; i < this.length; i++) {
      const item = this[i]
      const currentValue =
        'function' === typeof key ? key(item, i) : item && 'object' === typeof item ? item[key] : item

      if (0 === i || currentValue === lastValue) {
        currentChunk.push(item)
      } else {
        chunks.push(currentChunk)
        currentChunk = new EnhancedArray<T>(item)
      }

      lastValue = currentValue
    }

    if (0 < currentChunk.length) {
      chunks.push(currentChunk)
    }

    return chunks
  }

  /**
   * Map and filter the collection simultaneously.
   * Items for which the callback returns null or undefined are removed.
   *
   * @param {Function} callback The callback to map items
   * @returns {EnhancedArray<U>} A new mapped and filtered collection
   */
  filterMap<U>(callback: (item: T, index: number) => U | null | undefined): EnhancedArray<U> {
    const result = new EnhancedArray<U>()

    for (let i = 0; i < this.length; i++) {
      const mapped = callback(this[i], i)
      if (null !== mapped && mapped !== undefined) {
        result.push(mapped)
      }
    }

    return result
  }

  /**
   * Extract a subset of properties from each item in the collection.
   *
   * @param {K[]} keys The keys to extract
   * @returns {EnhancedArray<Partial<T>>} A new collection of partial items
   */
  extract<K extends keyof T>(keys: K[]): EnhancedArray<Partial<T>> {
    return new EnhancedArray(
      ...this.map((item) => {
        if (!item || 'object' !== typeof item) {
          return {} as Partial<T>
        }

        const extracted: Partial<T> = {}
        for (const key of keys) {
          if (key in item) {
            extracted[key] = item[key]
          }
        }
        return extracted
      })
    )
  }

  // Utility macros
  /**
   * Get the first item or push a default item if the collection is empty.
   *
   * @param {T} item The default item to push if empty
   * @returns {T} The first item or the pushed item
   */
  firstOrPush(item: T): T {
    if (0 === this.length) {
      this.push(item)
      return item
    }
    return this[0]
  }

  /**
   * Get every n-th item from the collection.
   *
   * @param {number} n The step size
   * @returns {EnhancedArray<T>} A new collection of every n-th item
   */
  getNth(n: number): EnhancedArray<T> {
    const result = new EnhancedArray<T>()
    for (let i = n - 1; i < this.length; i += n) {
      result.push(this[i])
    }
    return result
  }

  /**
   * Get a random item from the collection based on weights.
   *
   * @param {number[]} [weights] Optional weights for each item
   * @returns {T | undefined} A random item or undefined if collection is empty
   */
  weightedRandom(weights?: number[]): T | undefined {
    if (0 === this.length) {
      return undefined
    }

    const effectiveWeights = weights ?? new Array(this.length).fill(1)
    if (effectiveWeights.length !== this.length) {
      throw new Error('Weights array must have same length as collection')
    }

    const totalWeight = effectiveWeights.reduce((sum, weight) => sum + weight, 0)
    const random = Math.random() * totalWeight

    let currentWeight = 0
    for (let i = 0; i < this.length; i++) {
      currentWeight += effectiveWeights[i]
      if (random <= currentWeight) {
        return this[i]
      }
    }

    return this[this.length - 1]
  }

  /**
   * Paginate the collection items.
   *
   * @param {number} perPage Items per page
   * @param {number} [page=1] Current page number
   * @returns {Object} Pagination results
   */
  paginate(
    perPage: number,
    page: number = 1
  ): {
    data: EnhancedArray<T>
    total: number
    perPage: number
    currentPage: number
    lastPage: number
    from: number
    to: number
  } {
    const total = this.length
    const lastPage = Math.ceil(total / perPage)
    const currentPage = Math.max(1, Math.min(page, lastPage))
    const from = (currentPage - 1) * perPage
    const to = Math.min(from + perPage, total)

    return {
      data: new EnhancedArray(...this.slice(from, to)),
      total,
      perPage,
      currentPage,
      lastPage,
      from: from + 1,
      to,
    }
  }

  /**
   * Recursively convert all nested arrays to EnhancedArray instances.
   *
   * @returns {EnhancedArray<unknown>} A new collection with recursive EnhancedArrays
   */
  recursive(): EnhancedArray<unknown> {
    const convert = (item: unknown): unknown => {
      if (Array.isArray(item)) {
        return new EnhancedArray(...item.map(convert))
      }
      if (item && 'object' === typeof item && item.constructor === Object) {
        const converted: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(item)) {
          converted[key] = convert(value)
        }
        return converted
      }
      return item
    }

    return new EnhancedArray(...this.map(convert))
  }
}

// Utility functions for objects and maps
/**
 * Convert a plain object to a Map.
 *
 * @param {Record<string, T>} obj The object to convert
 * @returns {Map<string, T>} A new Map instance
 */
export const objectToMap = <T>(obj: Record<string, T>): Map<string, T> => {
  return new Map(Object.entries(obj))
}

/**
 * Convert a Map to a plain object.
 *
 * @param {Map<string, T>} map The Map to convert
 * @returns {Record<string, T>} A new plain object
 */
export const mapToObject = <T>(map: Map<string, T>): Record<string, T> => {
  return Object.fromEntries(map)
}

/**
 * Enhanced Map class with additional collection-like methods.
 * Extends the native Map class.
 */
export class EnhancedMap<K, V> extends Map<K, V> {
  /**
   * Create an EnhancedMap from a plain object.
   *
   * @param {Record<string, V>} obj The object to convert
   * @returns {EnhancedMap<string, V>} A new EnhancedMap instance
   */
  static fromObject<V>(obj: Record<string, V>): EnhancedMap<string, V> {
    return new EnhancedMap(Object.entries(obj))
  }

  /**
   * Pluck a property from each value in the map.
   *
   * @param {P} key The key to pluck
   * @returns {EnhancedArray<V[P]>} A new collection of plucked values
   */
  pluck<P extends keyof V>(key: P): EnhancedArray<V[P]> {
    return new EnhancedArray(
      ...(Array.from(this.values())
        .map((value) => (value && 'object' === typeof value ? value[key] : undefined))
        .filter((val) => val !== undefined) as V[P][])
    )
  }

  /**
   * Group the map's entries by a given accessor.
   *
   * @param {Function} accessor The accessor to group by
   * @returns {Record<string, EnhancedArray<[K, V]>>} A record of grouped entries
   */
  groupBy(accessor: (value: V, key: K) => string | number): Record<string, EnhancedArray<[K, V]>> {
    const groups: Record<string, EnhancedArray<[K, V]>> = {}

    for (const [key, value] of this) {
      const groupKey = String(accessor(value, key))

      if (!groups[groupKey]) {
        groups[groupKey] = new EnhancedArray<[K, V]>()
      }

      groups[groupKey].push([key, value])
    }

    return groups
  }

  /**
   * Convert the map to an array of entries.
   *
   * @returns {EnhancedArray<[K, V]>} A collection of entries
   */
  toArray(): EnhancedArray<[K, V]> {
    return new EnhancedArray(...this.entries())
  }

  /**
   * Convert the map to a plain object.
   *
   * @returns {Record<string, V>} A plain object representation of the map
   */
  toObject(): Record<string, V> {
    const obj: Record<string, V> = {}
    for (const [key, value] of this) {
      obj[String(key)] = value
    }
    return obj
  }
}

// Factory functions
/**
 * Create a new EnhancedArray from an array of items.
 *
 * @param {T[]} items The items to collect
 * @returns {EnhancedArray<T>} A new EnhancedArray instance
 */
export const collect = <T>(items: T[]): EnhancedArray<T> => {
  return new EnhancedArray(...items)
}

/**
 * Create a new EnhancedMap from an iterable of entries.
 *
 * @param {Iterable<[K, V]>} [entries] Optional entries to initialize the map
 * @returns {EnhancedMap<K, V>} A new EnhancedMap instance
 */
export const collectMap = <K, V>(entries?: Iterable<[K, V]>): EnhancedMap<K, V> => {
  return new EnhancedMap(entries)
}
