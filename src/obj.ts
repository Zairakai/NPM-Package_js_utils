import { diff, isEqual } from './equals.js'
import { data_get, data_set } from './runtime.js'

/**
 * Fluent object manipulation class with state tracking.
 */
export class Objectable<T extends Record<string, unknown>> {
  protected value: T
  protected originalValue: T

  /**
   * Create a new Objectable instance.
   *
   * @param {T} value The initial object value
   */
  constructor(value: T) {
    this.value = structuredClone(value)
    this.originalValue = structuredClone(value)
  }

  /**
   * Get the current object state.
   *
   * @returns {T} The current object
   */
  toObject(): T {
    return this.value
  }

  /**
   * Alias for toObject().
   *
   * @returns {T} The current object
   */
  get(): T {
    return this.value
  }

  /**
   * Get the original state from construction.
   *
   * @returns {T} The original object
   */
  getOriginal(): T {
    return this.originalValue
  }

  /**
   * Sync original state with current state (marking it as clean).
   *
   * @returns {this} The Objectable instance
   */
  syncOriginal(): this {
    this.originalValue = structuredClone(this.value)
    return this
  }

  /**
   * Determine if any attribute has been modified.
   *
   * @param {string} [key] Optional key to check specifically
   * @returns {boolean} True if dirty, false otherwise
   */
  isDirty(key?: string): boolean {
    if (key) {
      return !isEqual(data_get(this.originalValue, key), data_get(this.value, key))
    }
    return !isEqual(this.originalValue, this.value)
  }

  /**
   * Determine if the object is equivalent to its original state.
   *
   * @param {string} [key] Optional key to check specifically
   * @returns {boolean} True if clean, false otherwise
   */
  isClean(key?: string): boolean {
    return !this.isDirty(key)
  }

  /**
   * Get the attributes that have been modified.
   *
   * @returns {Partial<T>} The dirty attributes
   */
  getDirty(): Partial<T> {
    return diff(this.originalValue, this.value) as Partial<T>
  }

  /**
   * Get a value by dot notation.
   *
   * @param {string} key The key to retrieve
   * @param {unknown} [defaultValue=null] The default value if not found
   * @returns {unknown} The retrieved value
   */
  dataGet(key: string, defaultValue: unknown = null): unknown {
    return data_get(this.value, key, defaultValue)
  }

  /**
   * Set a value by dot notation.
   *
   * @param {string} key The key to set
   * @param {unknown} value The value to set
   * @returns {this} The Objectable instance
   */
  dataSet(key: string, value: unknown): this {
    data_set(this.value, key, value)
    return this
  }

  /**
   * Get only specified keys.
   *
   * @param {K[]} keys The keys to include
   * @returns {Objectable<Pick<T, K>>} A new Objectable instance
   */
  only<K extends keyof T>(keys: K[]): Objectable<Pick<T, K>> {
    const result: Record<string, unknown> = {}
    keys.forEach((key) => {
      const k = key as string
      if (k in this.value) {
        result[k] = this.value[k]
      }
    })
    return new Objectable(result as Pick<T, K>)
  }

  /**
   * Get all keys except specified ones.
   *
   * @param {K[]} keys The keys to exclude
   * @returns {Objectable<Omit<T, K>>} A new Objectable instance
   */
  except<K extends keyof T>(keys: K[]): Objectable<Omit<T, K>> {
    const result: Record<string, unknown> = { ...this.value }
    keys.forEach((key) => {
      const k = key as string
      delete result[k]
    })
    return new Objectable(result as Omit<T, K>)
  }

  /**
   * Map over object entries.
   *
   * @param {Function} callback The callback to execute
   * @returns {Record<string, U>} The resulting object
   */
  map<U>(callback: (value: T[keyof T], key: keyof T) => U): Record<string, U> {
    const result: Record<string, U> = {}
    for (const [key, val] of Object.entries(this.value)) {
      result[key] = callback(val as T[keyof T], key as keyof T)
    }
    return result
  }

  /**
   * Filter object entries.
   *
   * @param {Function} callback The callback to execute
   * @returns {this} The Objectable instance
   */
  filter(callback: (value: T[keyof T], key: keyof T) => boolean): this {
    const result: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(this.value)) {
      if (callback(val as T[keyof T], key as keyof T)) {
        result[key] = val
      }
    }
    this.value = result as T
    return this
  }

  /**
   * Merge with another object.
   *
   * @param {U} other The object to merge with
   * @returns {Objectable<T & U>} A new Objectable instance
   */
  merge<U extends Record<string, unknown>>(other: U): Objectable<T & U> {
    return new Objectable({ ...this.value, ...other } as T & U)
  }

  /**
   * Deep merge with another object (non-mutating on source).
   *
   * @param {Record<string, unknown>} other The object to deep merge with
   * @returns {this} The Objectable instance
   */
  mergeDeep(other: Record<string, unknown>): this {
    const merge = (target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> => {
      const result: Record<string, unknown> = { ...target }
      for (const key of Object.keys(source)) {
        const srcVal = source[key]
        const tgtVal = target[key]
        if (
          srcVal !== null &&
          'object' === typeof srcVal &&
          !Array.isArray(srcVal) &&
          tgtVal !== null &&
          'object' === typeof tgtVal &&
          !Array.isArray(tgtVal)
        ) {
          result[key] = merge(tgtVal as Record<string, unknown>, srcVal as Record<string, unknown>)
        } else {
          result[key] = srcVal
        }
      }
      return result
    }
    this.value = merge(this.value, other) as T
    return this
  }

  /**
   * Check if object has key.
   *
   * @param {string} key The key to check
   * @returns {boolean} True if key exists
   */
  has(key: string): boolean {
    return key in this.value
  }

  /**
   * Get keys.
   *
   * @returns {string[]} The object keys
   */
  keys(): string[] {
    return Object.keys(this.value)
  }

  /**
   * Get values.
   *
   * @returns {unknown[]} The object values
   */
  values(): unknown[] {
    return Object.values(this.value)
  }

  /**
   * Clone the object.
   *
   * @returns {Objectable<T>} A new cloned Objectable instance
   */
  clone(): Objectable<T> {
    return new Objectable(structuredClone(this.value))
  }

  /**
   * Pipe to a callback.
   *
   * @param {Function} callback The callback to execute
   * @returns {U} The result of the callback
   */
  pipe<U>(callback: (obj: this) => U): U {
    return callback(this)
  }

  /**
   * Execute callback if condition is met.
   *
   * @param {boolean | Function} condition The condition to check
   * @param {Function} callback The callback to execute
   * @returns {this} The Objectable instance
   */
  when(condition: boolean | (() => boolean), callback: (obj: this) => void): this {
    const shouldExecute = 'function' === typeof condition ? (condition as () => boolean)() : condition
    if (shouldExecute) {
      callback(this)
    }
    return this
  }
}

/**
 * Create a new fluent Objectable instance.
 *
 * @param {T} value The initial value
 * @returns {Objectable<T>} A new Objectable instance
 */
export const obj = <T extends Record<string, unknown>>(value: T): Objectable<T> => {
  return new Objectable(value)
}

/**
 * Static methods for object manipulation.
 */
export const Obj = {
  /** Create a new Objectable instance */
  of: <T extends Record<string, unknown>>(value: T) => new Objectable(value),
  /** Get object keys */
  keys: (value: Record<string, unknown>) => Object.keys(value),
  /** Get object values */
  values: (value: Record<string, unknown>) => Object.values(value),
  /** Merge objects */
  merge: (target: Record<string, unknown>, ...sources: Record<string, unknown>[]) =>
    Object.assign({}, target, ...sources),
}
