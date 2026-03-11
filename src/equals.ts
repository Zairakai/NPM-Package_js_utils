import { GenericRecord } from './types.js'

/**
 * Deep equality and comparison utilities
 */

/**
 * Perform a deep comparison between two values to determine if they are equivalent.
 *
 * @param {unknown} a The first value to compare
 * @param {unknown} b The second value to compare
 * @returns {boolean} True if the values are equivalent, false otherwise
 */
export const isEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) {
    return true
  }

  if (a && b && 'object' === typeof a && 'object' === typeof b) {
    if (a.constructor !== b.constructor) {
      return false
    }

    if (Array.isArray(a)) {
      if (a.length !== (b as unknown[]).length) {
        return false
      }
      for (let i = 0; i < a.length; i++) {
        if (!isEqual(a[i], (b as unknown[])[i])) {
          return false
        }
      }
      return true
    }

    if (a instanceof Map && b instanceof Map) {
      if (a.size !== b.size) {
        return false
      }
      for (const [key, val] of a) {
        if (!b.has(key) || !isEqual(val, b.get(key))) {
          return false
        }
      }
      return true
    }

    if (a instanceof Set && b instanceof Set) {
      if (a.size !== b.size) {
        return false
      }
      for (const val of a) {
        if (!b.has(val)) {
          return false
        }
      }
      return true
    }

    if (a.constructor === RegExp) {
      return (a as RegExp).source === (b as RegExp).source && (a as RegExp).flags === (b as RegExp).flags
    }
    if (a.valueOf !== Object.prototype.valueOf) {
      return a.valueOf() === b.valueOf()
    }
    if (a.toString !== Object.prototype.toString) {
      return a.toString() === b.toString()
    }

    const keys = Object.keys(a)
    if (keys.length !== Object.keys(b).length) {
      return false
    }

    const bObj = b as GenericRecord
    const aObj = a as GenericRecord

    for (const key of keys) {
      if (!Object.prototype.hasOwnProperty.call(bObj, key)) {
        return false
      }
      if (!isEqual(aObj[key], bObj[key])) {
        return false
      }
    }

    return true
  }

  return a !== a && b !== b // Handle NaN
}

/**
 * Find the differences between two objects.
 * Returns an object containing only the keys that differ.
 *
 * @param {unknown} original The original object
 * @param {unknown} current The current object
 * @returns {GenericRecord} An object containing the differences
 */
export const diff = (original: unknown, current: unknown): GenericRecord => {
  const result: GenericRecord = {}

  if (isEqual(original, current)) {
    return result
  }

  if (!original || !current || 'object' !== typeof original || 'object' !== typeof current) {
    return (current as GenericRecord) || {}
  }

  const originalObj = original as GenericRecord
  const currentObj = current as GenericRecord

  const keys = new Set([...Object.keys(originalObj), ...Object.keys(currentObj)])

  for (const key of keys) {
    if (!isEqual(originalObj[key], currentObj[key])) {
      if (
        originalObj[key] &&
        currentObj[key] &&
        'object' === typeof originalObj[key] &&
        'object' === typeof currentObj[key] &&
        !Array.isArray(originalObj[key])
      ) {
        result[key] = diff(originalObj[key], currentObj[key])
      } else {
        result[key] = currentObj[key]
      }
    }
  }

  return result
}
