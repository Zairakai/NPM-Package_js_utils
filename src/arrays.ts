/**
 * Array manipulation and utility functions
 * Inspired by Laravel's array helpers
 */

/**
 * Add an element to an array or record at a specific key.
 *
 * @param {T[] | Record<string, T>} array The source array or record
 * @param {string} key The key to add the value at
 * @param {T} value The value to add
 * @returns {Record<string, unknown>} The resulting record
 */
export const arrayAdd = <T>(array: T[] | Record<string, T>, key: string, value: T): Record<string, unknown> => {
  const result: Record<string, unknown> = Array.isArray(array)
    ? (Object.fromEntries(array.map((v, i) => [i, v])) as Record<string, unknown>)
    : { ...(array as Record<string, T>) }
  result[key] = value
  return result
}

/**
 * Collapse an array of arrays into a single array.
 *
 * @param {T[][]} array The array of arrays to collapse
 * @returns {T[]} The collapsed array
 */
export const arrayCollapse = <T>(array: T[][]): T[] => {
  if (!Array.isArray(array)) {
    return []
  }
  return array.reduce((flat, item) => {
    if (Array.isArray(item)) {
      return flat.concat(item)
    }
    return flat.concat([item as unknown as T])
  }, [] as T[])
}

/**
 * Divide an array into two arrays: one with keys (indices) and one with values.
 *
 * @param {T[]} array The array to divide
 * @returns {[string[], T[]]} A tuple containing keys and values
 */
export const arrayDivide = <T>(array: T[]): [string[], T[]] => {
  if (!Array.isArray(array)) {
    return [[], []]
  }
  const keys = array.map((_, index) => index.toString())
  const values = [...array]
  return [keys, values]
}

/**
 * Flatten a multi-dimensional record into a single-level record using dot notation.
 *
 * @param {Record<string, unknown>} array The record to flatten
 * @param {string} prepend The string to prepend to keys
 * @returns {Record<string, unknown>} The flattened record
 */
export const arrayDot = (array: Record<string, unknown>, prepend = ''): Record<string, unknown> => {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(array)) {
    const newKey = prepend ? `${prepend}.${key}` : key

    if (value && 'object' === typeof value && !Array.isArray(value)) {
      Object.assign(result, arrayDot(value as Record<string, unknown>, newKey))
    } else {
      result[newKey] = value
    }
  }

  return result
}

/**
 * Get all of the given array except for a specified array of keys (indices).
 *
 * @param {T[]} array The source array
 * @param {string[]} keys The keys to exclude
 * @returns {T[]} The filtered array
 */
export const arrayExcept = <T>(array: T[], keys: string[]): T[] => {
  if (!Array.isArray(array) || !Array.isArray(keys)) {
    return array
  }
  return array.filter((_, index) => !keys.includes(index.toString()))
}

/**
 * Return the first element in an array passing a given truth test.
 *
 * @param {T[]} array The source array
 * @param {Function} [callback] Optional callback for truth test
 * @param {T} [defaultValue] Optional default value if no element found
 * @returns {T | undefined} The first matching element or default value
 */
export const arrayFirst = <T>(
  array: T[],
  callback?: (item: T, index: number) => boolean,
  defaultValue?: T
): T | undefined => {
  if (!Array.isArray(array)) {
    return defaultValue
  }

  if (!callback) {
    return 0 < array.length ? array[0] : defaultValue
  }

  for (let i = 0; i < array.length; i++) {
    if (callback(array[i], i)) {
      return array[i]
    }
  }

  return defaultValue
}

/**
 * Flatten a multi-dimensional array into a single level.
 *
 * @param {unknown[]} array The array to flatten
 * @param {number} [depth=Infinity] The depth to flatten to
 * @returns {T[]} The flattened array
 */
export const arrayFlatten = <T>(array: unknown[], depth = Infinity): T[] => {
  if (!Array.isArray(array)) {
    return []
  }

  const flatten = (arr: unknown[], currentDepth: number): T[] => {
    const result: T[] = []

    for (const item of arr) {
      if (Array.isArray(item) && 0 < currentDepth) {
        result.push(...flatten(item, currentDepth - 1))
      } else {
        result.push(item as T)
      }
    }

    return result
  }

  return flatten(array, depth)
}

/**
 * Get an item from a record using dot notation.
 *
 * @param {Record<string, unknown>} array The source record
 * @param {string} key The key to retrieve
 * @param {unknown} [defaultValue] The default value if key not found
 * @returns {unknown} The value at the key or default value
 */
export const arrayGet = (array: Record<string, unknown>, key: string, defaultValue?: unknown): unknown => {
  if (!array || 'object' !== typeof array) {
    return defaultValue
  }

  const keys = key.split('.')
  let current: unknown = array

  for (const k of keys) {
    if (
      null === current ||
      current === undefined ||
      'object' !== typeof current ||
      !(k in (current as Record<string, unknown>))
    ) {
      return defaultValue
    }
    current = (current as Record<string, unknown>)[k]
  }

  return current
}

/**
 * Check if an item or items exist in a record using "dot" notation.
 *
 * @param {Record<string, unknown>} array The source record
 * @param {string | string[]} keys The key or keys to check
 * @returns {boolean} True if all keys exist, false otherwise
 */
export const arrayHas = (array: Record<string, unknown>, keys: string | string[]): boolean => {
  if (!array || 'object' !== typeof array) {
    return false
  }

  const keyArray = Array.isArray(keys) ? keys : [keys]

  return keyArray.every((key) => {
    const keyParts = key.split('.')
    let current: unknown = array

    for (const part of keyParts) {
      if (
        null === current ||
        current === undefined ||
        'object' !== typeof current ||
        !(part in (current as Record<string, unknown>))
      ) {
        return false
      }
      current = (current as Record<string, unknown>)[part]
    }

    return true
  })
}

/**
 * Get a subset of the array's elements specified by keys (indices).
 *
 * @param {T[]} array The source array
 * @param {string[]} keys The keys to include
 * @returns {T[]} The filtered array
 */
export const arrayOnly = <T>(array: T[], keys: string[]): T[] => {
  if (!Array.isArray(array) || !Array.isArray(keys)) {
    return []
  }
  return array.filter((_, index) => keys.includes(index.toString()))
}

// Advanced array helpers
/**
 * Filter the array using the given callback.
 *
 * @param {T[]} array The source array
 * @param {Function} callback The callback to use for filtering
 * @returns {T[]} The filtered array
 */
export const arrayWhere = <T>(array: T[], callback: (item: T, index: number) => boolean): T[] => {
  if (!Array.isArray(array)) {
    return []
  }
  return array.filter(callback)
}

/**
 * Pluck an array of values from an array of objects.
 *
 * @param {T[]} array The source array
 * @param {K} key The key to pluck
 * @returns {T[K][]} The plucked values
 */
export const arrayPluck = <T, K extends keyof T>(array: T[], key: K): T[K][] => {
  if (!Array.isArray(array)) {
    return []
  }
  return array
    .map((item) => (item && 'object' === typeof item ? item[key] : undefined))
    .filter((value) => value !== undefined) as T[K][]
}

/**
 * Group an array's items by a given key or callback.
 *
 * @param {T[]} array The source array
 * @param {keyof T | Function} keyOrFn The key or callback to group by
 * @returns {Record<string, T[]>} The grouped items
 */
export const arrayGroupBy = <T>(array: T[], keyOrFn: keyof T | ((item: T) => string | number)): Record<string, T[]> => {
  if (!Array.isArray(array)) {
    return {}
  }

  return array.reduce(
    (groups, item) => {
      const key =
        'function' === typeof keyOrFn
          ? String(keyOrFn(item))
          : String(item && 'object' === typeof item ? item[keyOrFn] : item)

      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(item)

      return groups
    },
    {} as Record<string, T[]>
  )
}

/**
 * Filter the array to only unique elements.
 *
 * @param {T[]} array The source array
 * @param {keyof T} [key] Optional key to use for uniqueness
 * @returns {T[]} The array with unique elements
 */
export const arrayUnique = <T>(array: T[], key?: keyof T): T[] => {
  if (!Array.isArray(array)) {
    return []
  }

  if (!key) {
    return [...new Set(array)]
  }

  const seen = new Set()
  return array.filter((item) => {
    const value = item && 'object' === typeof item ? item[key] : item
    if (seen.has(value)) {
      return false
    }
    seen.add(value)
    return true
  })
}
