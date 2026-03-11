import { GenericRecord } from './types.js'

/**
 * Runtime utility functions inspired by Laravel
 */

/**
 * Check if a value is a plain object (Record)
 *
 * @param {unknown} value The value to check
 * @returns {value is GenericRecord} True if the value is a plain object
 */
export function isRecord(value: unknown): value is GenericRecord {
  return null !== value && 'object' === typeof value && !Array.isArray(value)
}

/**
 * Execute a callback and return the given value
 * Useful for side effects in a chain
 *
 * @param {T} value The value to pass to the callback
 * @param {(value: T) => void} callback The callback to execute
 * @returns {T} The original value
 */
export const tap = <T>(value: T, callback: (value: T) => void): T => {
  callback(value)
  return value
}

/**
 * Conditionally execute a callback
 *
 * @param {unknown} condition The condition to check (value or zero-arg function returning boolean)
 * @param {() => R} onTrue The callback to execute if the condition is truthy
 * @param {() => R} [onFalse] The callback to execute if the condition is falsy
 * @returns {R | undefined} The result of the executed callback or undefined
 */
export const when = <R>(condition: unknown, onTrue: () => R, onFalse?: () => R): R | undefined => {
  const shouldExecute = 'function' === typeof condition ? (condition as () => boolean)() : Boolean(condition)

  if (shouldExecute) {
    return onTrue()
  } else if (onFalse) {
    return onFalse()
  }

  return undefined
}

/**
 * Return the first argument if it's truthy, otherwise return the second
 *
 * @param {T | (() => T)} val The value or a function that returns the value
 * @returns {T} The resolved value
 */
export const value = <T>(val: T | (() => T)): T => {
  return 'function' === typeof val ? (val as () => T)() : val
}

/**
 * Get an item from an array or object using dot notation
 *
 * @param {unknown} target The object or array to search
 * @param {string | string[]} key The dot-notated key or an array of keys
 * @param {unknown} [defaultValue=null] The default value to return if the key is not found
 * @returns {unknown} The found value or the default value
 */
export const data_get = (target: unknown, key: string | string[], defaultValue: unknown = null): unknown => {
  if (!isRecord(target) && !Array.isArray(target)) {
    return defaultValue
  }

  const parts = Array.isArray(key) ? key : key.split('.')
  let result: unknown = target

  for (const part of parts) {
    if (!isRecord(result) && !Array.isArray(result)) {
      return defaultValue
    }

    if (part in (result as GenericRecord)) {
      result = (result as GenericRecord)[part]
    } else {
      return defaultValue
    }
  }

  return result
}

/**
 * Set an item in an array or object using dot notation
 *
 * @param {T} target The object or array to modify
 * @param {string | string[]} key The dot-notated key or an array of keys
 * @param {unknown} value The value to set
 * @returns {T} The modified target
 */
export const data_set = <T>(target: T, key: string | string[], value: unknown): T => {
  if (!isRecord(target) && !Array.isArray(target)) {
    return target
  }

  const parts = Array.isArray(key) ? key : key.split('.')
  let current: unknown = target

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]

    if (!isRecord(current)) {
      break
    }

    const currentRecord = current as GenericRecord

    if (!(part in currentRecord) || !isRecord(currentRecord[part])) {
      currentRecord[part] = {} as GenericRecord
    }

    current = currentRecord[part]
  }

  if (isRecord(current)) {
    ;(current as GenericRecord)[parts[parts.length - 1]] = value
  }

  return target
}

/**
 * Returns the object if it exists, otherwise returns null (similar to optional() helper)
 *
 * @param {T} value The value to return if it exists
 * @returns {T | null} The value or null
 */
export const optional = <T>(value: T): T | null => {
  return value ?? null
}

/**
 * Execute a callback with retry logic
 *
 * @param {number} times The number of times to retry
 * @param {(attempt: number) => Promise<T> | T} callback The callback to execute
 * @param {number} [sleepMilliseconds=0] The amount of time to wait between retries
 * @returns {Promise<T>} The result of the callback
 * @throws {Error} If all attempts fail
 */
export const retry = async <T>(
  times: number,
  callback: (attempt: number) => Promise<T> | T,
  sleepMilliseconds = 0
): Promise<T> => {
  let lastError: Error | undefined

  for (let attempt = 1; attempt <= times; attempt++) {
    try {
      return await callback(attempt)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      if (attempt < times && 0 < sleepMilliseconds) {
        await new Promise((resolve) => setTimeout(resolve, sleepMilliseconds))
      }
    }
  }

  throw lastError ?? new Error(`Retry failed after ${times} attempts`)
}

/**
 * Throw an error if a condition is met
 *
 * @param {unknown} condition The condition to check
 * @param {Error | string} exception The error to throw or the error message
 * @throws {Error} If the condition is met
 */
export const throw_if = (condition: unknown, exception: Error | string): void => {
  if ('function' === typeof condition ? (condition as () => boolean)() : Boolean(condition)) {
    throw 'string' === typeof exception ? new Error(exception) : exception
  }
}

/**
 * Throw an error unless a condition is met
 *
 * @param {unknown} condition The condition to check
 * @param {Error | string} exception The error to throw or the error message
 * @throws {Error} If the condition is not met
 */
export const throw_unless = (condition: unknown, exception: Error | string): void => {
  if (!('function' === typeof condition ? (condition as () => boolean)() : Boolean(condition))) {
    throw 'string' === typeof exception ? new Error(exception) : exception
  }
}
