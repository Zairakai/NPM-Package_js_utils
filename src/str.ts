import * as formatters from './formatters.js'

/**
 * Fluent string manipulation class inspired by Laravel's Str and Stringable
 */
export class Stringable {
  protected value: string

  constructor(value: unknown) {
    this.value = String(value ?? '')
  }

  /**
   * Get the raw string value
   *
   * @returns {string} The raw string
   */
  toString(): string {
    return this.value
  }

  /**
   * Alias for toString()
   *
   * @returns {string} The raw string
   */
  get(): string {
    return this.value
  }

  /**
   * Convert to title case
   *
   * @returns {this} The Stringable instance
   */
  title(): this {
    this.value = formatters.titleCase(this.value)
    return this
  }

  /**
   * Convert to slug
   *
   * @returns {this} The Stringable instance
   */
  slug(): this {
    this.value = formatters.slugify(this.value)
    return this
  }

  /**
   * Convert to snake_case
   *
   * @returns {this} The Stringable instance
   */
  snake(): this {
    this.value = formatters.snakeCase(this.value)
    return this
  }

  /**
   * Convert to kebab-case
   *
   * @returns {this} The Stringable instance
   */
  kebab(): this {
    this.value = formatters.kebabCase(this.value)
    return this
  }

  /**
   * Convert to camelCase
   *
   * @returns {this} The Stringable instance
   */
  camel(): this {
    this.value = formatters.camelCase(this.value)
    return this
  }

  /**
   * Convert to StudlyCase
   *
   * @returns {this} The Stringable instance
   */
  studly(): this {
    this.value = formatters.studlyCase(this.value)
    return this
  }

  /**
   * Limit the string length
   *
   * @param {number} size The maximum length
   * @param {string} [end='…'] The string to append if limited
   * @returns {this} The Stringable instance
   */
  limit(size: number, end = '…'): this {
    this.value = formatters.strLimit(this.value, size)
    if (this.value.endsWith('…') && '…' !== end) {
      this.value = this.value.slice(0, -1) + end
    }
    return this
  }

  /**
   * Append a value to the string
   *
   * @param {...unknown[]} values The values to append
   * @returns {this} The Stringable instance
   */
  append(...values: unknown[]): this {
    this.value += values.join('')
    return this
  }

  /**
   * Prepend a value to the string
   *
   * @param {...unknown[]} values The values to prepend
   * @returns {this} The Stringable instance
   */
  prepend(...values: unknown[]): this {
    this.value = values.join('') + this.value
    return this
  }

  /**
   * Cap the string with a value if it doesn't already end with it
   *
   * @param {string} cap The string to end with
   * @returns {this} The Stringable instance
   */
  finish(cap: string): this {
    this.value = formatters.strFinish(this.value, cap)
    return this
  }

  /**
   * Start the string with a value if it doesn't already start with it
   *
   * @param {string} prefix The string to start with
   * @returns {this} The Stringable instance
   */
  start(prefix: string): this {
    this.value = formatters.strStart(this.value, prefix)
    return this
  }

  /**
   * Replace the first occurrence of a value
   *
   * @param {string | RegExp} search The value to search for
   * @param {string} replace The value to replace with
   * @returns {this} The Stringable instance
   */
  replace(search: string | RegExp, replace: string): this {
    this.value = this.value.replace(search, replace)
    return this
  }

  /**
   * Replace all occurrences of a value
   *
   * @param {string | RegExp} search The value to search for
   * @param {string} replace The value to replace with
   * @returns {this} The Stringable instance
   */
  replaceAll(search: string | RegExp, replace: string): this {
    if ('string' === typeof search) {
      this.value = this.value.split(search).join(replace)
    } else {
      const flags = search.flags.includes('g') ? search.flags : `${search.flags}g`
      this.value = this.value.replace(new RegExp(search.source, flags), replace)
    }
    return this
  }

  /**
   * Reverse the string
   *
   * @returns {this} The Stringable instance
   */
  reverse(): this {
    this.value = formatters.strReverse(this.value)
    return this
  }

  /**
   * Mask a portion of the string
   *
   * @param {string} character The masking character
   * @param {number} index The starting index
   * @param {number} [length] The number of characters to mask
   * @returns {this} The Stringable instance
   */
  mask(character: string, index: number, length?: number): this {
    this.value = formatters.strMask(this.value, character, index, length)
    return this
  }

  /**
   * Trim the string
   *
   * @param {string} [chars] The characters to trim (defaults to whitespace)
   * @returns {this} The Stringable instance
   */
  trim(chars?: string): this {
    if (!chars) {
      this.value = this.value.trim()
    } else {
      const pattern = new RegExp(`^[${chars}]+|[${chars}]+$`, 'g')
      this.value = this.value.replace(pattern, '')
    }
    return this
  }

  /**
   * Convert to lower case
   *
   * @returns {this} The Stringable instance
   */
  lower(): this {
    this.value = this.value.toLowerCase()
    return this
  }

  /**
   * Convert to upper case
   *
   * @returns {this} The Stringable instance
   */
  upper(): this {
    this.value = this.value.toUpperCase()
    return this
  }

  /**
   * Capitalize the first letter
   *
   * @returns {this} The Stringable instance
   */
  capitalize(): this {
    this.value = formatters.capitalize(this.value)
    return this
  }

  /**
   * Check if string contains a value
   *
   * @param {string | string[]} needles The values to search for
   * @returns {boolean} True if the string contains any of the values
   */
  contains(needles: string | string[]): boolean {
    if (Array.isArray(needles)) {
      return formatters.strContainsAny(this.value, needles)
    }
    return this.value.includes(needles)
  }

  /**
   * Check if string contains all values
   *
   * @param {string[]} needles The values to search for
   * @returns {boolean} True if the string contains all values
   */
  containsAll(needles: string[]): boolean {
    return formatters.strContainsAll(this.value, needles)
  }

  /**
   * Check if string starts with a value
   *
   * @param {string | string[]} needles The values to check
   * @returns {boolean} True if the string starts with any of the values
   */
  startsWith(needles: string | string[]): boolean {
    if (Array.isArray(needles)) {
      return needles.some((needle) => this.value.startsWith(needle))
    }
    return this.value.startsWith(needles)
  }

  /**
   * Check if string ends with a value
   *
   * @param {string | string[]} needles The values to check
   * @returns {boolean} True if the string ends with any of the values
   */
  endsWith(needles: string | string[]): boolean {
    if (Array.isArray(needles)) {
      return needles.some((needle) => this.value.endsWith(needle))
    }
    return this.value.endsWith(needles)
  }

  /**
   * Execute a callback with the stringable and return the result
   *
   * @param {(str: this) => U} callback The callback to execute
   * @returns {U} The result of the callback
   */
  pipe<U>(callback: (str: this) => U): U {
    return callback(this)
  }

  /**
   * Conditionally execute a callback
   *
   * @param {boolean | (() => boolean)} condition The condition to check
   * @param {(str: this) => void} callback The callback to execute
   * @returns {this} The Stringable instance
   */
  when(condition: boolean | (() => boolean), callback: (str: this) => void): this {
    const shouldExecute = 'function' === typeof condition ? condition() : condition
    if (shouldExecute) {
      callback(this)
    }
    return this
  }

  /**
   * Execute a callback and return the stringable (for side effects)
   *
   * @param {(str: this) => void} callback The callback to execute
   * @returns {this} The Stringable instance
   */
  tap(callback: (str: this) => void): this {
    callback(this)
    return this
  }
}

/**
 * Create a new fluent stringable instance
 *
 * @param {unknown} [value] The initial string value
 * @returns {Stringable} A new Stringable instance
 */
export const str = (value?: unknown): Stringable => {
  return new Stringable(value)
}

/**
 * Static methods for string manipulation
 */
export const Str = {
  /**
   * Create a new fluent stringable instance
   *
   * @param {unknown} value The initial string value
   * @returns {Stringable} A new Stringable instance
   */
  of: (value: unknown) => new Stringable(value),

  /**
   * Convert a string to a slug
   *
   * @param {string} value The string to slugify
   * @returns {string} The slugified string
   */
  slug: (value: string) => formatters.slugify(value),

  /**
   * Convert a string to snake_case
   *
   * @param {string} value The string to convert
   * @returns {string} The snake_case string
   */
  snake: (value: string) => formatters.snakeCase(value),

  /**
   * Convert a string to kebab-case
   *
   * @param {string} value The string to convert
   * @returns {string} The kebab-case string
   */
  kebab: (value: string) => formatters.kebabCase(value),

  /**
   * Convert a string to camelCase
   *
   * @param {string} value The string to convert
   * @returns {string} The camelCase string
   */
  camel: (value: string) => formatters.camelCase(value),

  /**
   * Convert a string to StudlyCase
   *
   * @param {string} value The string to convert
   * @returns {string} The StudlyCase string
   */
  studly: (value: string) => formatters.studlyCase(value),

  /**
   * Convert a string to title case
   *
   * @param {string} value The string to convert
   * @returns {string} The title case string
   */
  title: (value: string) => formatters.titleCase(value),

  /**
   * Limit the length of a string
   *
   * @param {string} value The string to limit
   * @param {number} size The maximum length
   * @param {string} [end='…'] The string to append if limited
   * @returns {string} The limited string
   */
  limit: (value: string, size: number, end = '…') => {
    const result = formatters.strLimit(value, size)
    return result.endsWith('…') && '…' !== end ? result.slice(0, -1) + end : result
  },

  /**
   * Generate a random alphanumeric string
   *
   * @param {number} [length=16] The length of the random string
   * @returns {string} The random string
   */
  random: (length = 16): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  },

  /**
   * Generate a UUID (version 4)
   *
   * @returns {string} The generated UUID
   */
  uuid: (): string => crypto.randomUUID(),
}
