/**
 * Fluent number manipulation class inspired by Laravel's Number and modern utilities.
 */
export class Numberable {
  protected value: number

  /**
   * Create a new Numberable instance.
   *
   * @param {unknown} value The initial value
   */
  constructor(value: unknown) {
    this.value = Number(value ?? 0)
    if (isNaN(this.value)) {
      this.value = 0
    }
  }

  /**
   * Get the raw number value.
   *
   * @returns {number} The raw value
   */
  toNumber(): number {
    return this.value
  }

  /**
   * Alias for toNumber().
   *
   * @returns {number} The raw value
   */
  get(): number {
    return this.value
  }

  /**
   * Format the number with locale-specific formatting.
   *
   * @param {number} [decimals=0] The number of decimal points
   * @param {string} [locale='en-US'] The locale to use for formatting
   * @returns {string} The formatted number
   */
  format(decimals: number = 0, locale: string = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(this.value)
  }

  /**
   * Format the number as currency.
   *
   * @param {string} [currency='USD'] The currency code (e.g., 'USD', 'EUR')
   * @param {string} [locale='en-US'] The locale to use for formatting
   * @returns {string} The formatted currency string
   */
  currency(currency: string = 'USD', locale: string = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(this.value)
  }

  /**
   * Format the number as a percentage.
   *
   * @param {number} [decimals=0] The number of decimal points
   * @param {string} [locale='en-US'] The locale to use for formatting
   * @returns {string} The formatted percentage string
   */
  percentage(decimals: number = 0, locale: string = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(this.value / 100)
  }

  /**
   * Format the number as a human-readable file size.
   *
   * @param {number} [precision=2] The number of decimal points
   * @returns {string} The formatted file size (e.g., "1.50 MB")
   */
  fileSize(precision: number = 2): string {
    if (0 === this.value) {
      return '0 B'
    }
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(this.value) / Math.log(1024))
    return `${parseFloat((this.value / Math.pow(1024, i)).toFixed(precision))} ${units[i]}`
  }

  /**
   * Abbreviate the number (e.g., 1K, 1M, 1B).
   *
   * @param {number} [precision=1] The number of decimal points
   * @returns {string} The abbreviated number
   */
  abbreviate(precision: number = 1): string {
    if (1000 > this.value) {
      return String(this.value)
    }
    const units = ['', 'K', 'M', 'B', 'T']
    const i = Math.floor(Math.log10(this.value) / 3)
    return `${parseFloat((this.value / Math.pow(1000, i)).toFixed(precision))}${units[i]}`
  }

  /**
   * Add an ordinal suffix to the number (e.g., 1st, 2nd, 3rd).
   *
   * @returns {string} The number with its ordinal suffix
   */
  ordinal(): string {
    const s = ['th', 'st', 'nd', 'rd']
    const v = this.value % 100
    return this.value + (s[(v - 20) % 10] || s[v] || s[0])
  }

  /**
   * Clamp the number between a minimum and maximum value.
   *
   * @param {number} min The minimum value
   * @param {number} max The maximum value
   * @returns {this} The Numberable instance
   */
  clamp(min: number, max: number): this {
    this.value = Math.min(Math.max(this.value, min), max)
    return this
  }

  /**
   * Check if the number is between a minimum and maximum value.
   *
   * @param {number} min The minimum value
   * @param {number} max The maximum value
   * @param {boolean} [inclusive=true] Whether to include the boundaries
   * @returns {boolean} True if the number is between min and max
   */
  isBetween(min: number, max: number, inclusive: boolean = true): boolean {
    return inclusive ? this.value >= min && this.value <= max : this.value > min && this.value < max
  }

  /**
   * Add a value to the current number.
   *
   * @param {number} value The value to add
   * @returns {this} The Numberable instance
   */
  add(value: number): this {
    this.value += value
    return this
  }

  /**
   * Subtract a value from the current number.
   *
   * @param {number} value The value to subtract
   * @returns {this} The Numberable instance
   */
  sub(value: number): this {
    this.value -= value
    return this
  }

  /**
   * Multiply the current number by a value.
   *
   * @param {number} value The value to multiply by
   * @returns {this} The Numberable instance
   */
  mul(value: number): this {
    this.value *= value
    return this
  }

  /**
   * Divide the current number by a value.
   *
   * @param {number} value The value to divide by
   * @returns {this} The Numberable instance
   */
  div(value: number): this {
    if (0 !== value) {
      this.value /= value
    }
    return this
  }

  /**
   * Round the number to a specified precision.
   *
   * @param {number} [precision=0] The number of decimal points
   * @returns {this} The Numberable instance
   */
  round(precision: number = 0): this {
    const factor = Math.pow(10, precision)
    this.value = Math.round(this.value * factor) / factor
    return this
  }

  /**
   * Round the number up to a specified precision.
   *
   * @param {number} [precision=0] The number of decimal points
   * @returns {this} The Numberable instance
   */
  ceil(precision: number = 0): this {
    const factor = Math.pow(10, precision)
    this.value = Math.ceil(this.value * factor) / factor
    return this
  }

  /**
   * Round the number down to a specified precision.
   *
   * @param {number} [precision=0] The number of decimal points
   * @returns {this} The Numberable instance
   */
  floor(precision: number = 0): this {
    const factor = Math.pow(10, precision)
    this.value = Math.floor(this.value * factor) / factor
    return this
  }

  /**
   * Pipe the current Numberable instance to a callback.
   *
   * @param {Function} callback The callback to execute
   * @returns {U} The result of the callback
   */
  pipe<U>(callback: (num: this) => U): U {
    return callback(this)
  }

  /**
   * Execute a callback if a condition is met.
   *
   * @param {boolean | Function} condition The condition to check
   * @param {Function} callback The callback to execute if condition is true
   * @returns {this} The Numberable instance
   */
  when(condition: boolean | (() => boolean), callback: (num: this) => void): this {
    const shouldExecute = 'function' === typeof condition ? condition() : condition
    if (shouldExecute) {
      callback(this)
    }
    return this
  }
}

/**
 * Create a new fluent Numberable instance.
 *
 * @param {unknown} [value] The initial value
 * @returns {Numberable} A new Numberable instance
 */
export const num = (value?: unknown): Numberable => {
  return new Numberable(value)
}

/**
 * Static methods for number manipulation.
 */
export const NumberHelper = {
  /** Create a new Numberable instance */
  of: (value: unknown) => new Numberable(value),
  /** Format the number with locale-specific formatting */
  format: (value: number, decimals = 0, locale = 'en-US') => new Numberable(value).format(decimals, locale),
  /** Format the number as currency */
  currency: (value: number, currency = 'USD', locale = 'en-US') => new Numberable(value).currency(currency, locale),
  /** Format the number as a percentage */
  percentage: (value: number, decimals = 0, locale = 'en-US') => new Numberable(value).percentage(decimals, locale),
  /** Format the number as a human-readable file size */
  fileSize: (value: number, precision = 2) => new Numberable(value).fileSize(precision),
  /** Abbreviate the number */
  abbreviate: (value: number, precision = 1) => new Numberable(value).abbreviate(precision),
  /** Add an ordinal suffix to the number */
  ordinal: (value: number) => new Numberable(value).ordinal(),
}
