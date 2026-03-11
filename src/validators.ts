/**
 * Type checking and validation utilities
 * Laravel-inspired validation helpers
 */

/**
 * Check if value is strictly true
 *
 * @param {unknown} value The value to check
 * @returns {value is true} True if the value is strictly true
 */
export const isTrue = (value: unknown): value is true => true === value

/**
 * Check if value is strictly false
 *
 * @param {unknown} value The value to check
 * @returns {value is false} True if the value is strictly false
 */
export const isFalse = (value: unknown): value is false => false === value

/**
 * Check if value is strictly null
 *
 * @param {unknown} value The value to check
 * @returns {value is null} True if the value is strictly null
 */
export const isNull = (value: unknown): value is null => null === value

/**
 * Check if value is strictly undefined
 *
 * @param {unknown} value The value to check
 * @returns {value is undefined} True if the value is strictly undefined
 */
export const isUndefined = (value: unknown): value is undefined => undefined === value

/**
 * Check if value is neither null nor undefined
 *
 * @param {unknown} value The value to check
 * @returns {value is NonNullable<unknown>} True if the value is set
 */
export const isSet = (value: unknown): value is NonNullable<unknown> => undefined !== value && null !== value

/**
 * Check if value is an array
 *
 * @param {unknown} value The value to check
 * @returns {value is unknown[]} True if the value is an array
 */
export const isArray = (value: unknown): value is unknown[] => Array.isArray(value)

/**
 * Check if value is a plain object (Record)
 *
 * @param {unknown} value The value to check
 * @returns {value is Record<string, unknown>} True if the value is a plain object
 */
export const isObject = (value: unknown): value is Record<string, unknown> =>
  'object' === typeof value && null !== value && !Array.isArray(value)

/**
 * Check if value is a string
 *
 * @param {unknown} value The value to check
 * @returns {value is string} True if the value is a string
 */
export const isString = (value: unknown): value is string => 'string' === typeof value

/**
 * Check if value is a number and not NaN
 *
 * @param {unknown} value The value to check
 * @returns {value is number} True if the value is a valid number
 */
export const isNumber = (value: unknown): value is number => 'number' === typeof value && !isNaN(value)

/**
 * Check if value is an integer
 *
 * @param {unknown} value The value to check
 * @returns {value is number} True if the value is an integer
 */
export const isInteger = (value: unknown): value is number => Number.isInteger(value)

/**
 * Check if value is a float
 *
 * @param {unknown} value The value to check
 * @returns {value is number} True if the value is a float
 */
export const isFloat = (value: unknown): value is number =>
  'number' === typeof value && !isNaN(value) && !Number.isInteger(value)

/**
 * Check if value is a boolean
 *
 * @param {unknown} value The value to check
 * @returns {value is boolean} True if the value is a boolean
 */
export const isBoolean = (value: unknown): value is boolean => 'boolean' === typeof value

/**
 * Check if value is a function
 *
 * @param {unknown} value The value to check
 * @returns {value is Function} True if the value is a function
 */
export const isFunction = (value: unknown): value is Function => 'function' === typeof value

/**
 * Check if value is a valid Date object
 *
 * @param {unknown} value The value to check
 * @returns {value is Date} True if the value is a valid Date object
 */
export const isDate = (value: unknown): value is Date => value instanceof Date && !isNaN(value.getTime())

/**
 * Check if value is numeric (number or numeric string)
 *
 * @param {unknown} value The value to check
 * @returns {value is number | string} True if the value is numeric
 */
export const isNumeric = (value: unknown): value is number | string => {
  if ('number' === typeof value) {
    return !isNaN(value) && isFinite(value)
  }
  if ('string' === typeof value) {
    const num = Number(value.trim())
    return '' !== value.trim() && !isNaN(num) && isFinite(num)
  }
  return false
}

/**
 * Check if value is a valid email address format
 *
 * @param {unknown} value The value to check
 * @returns {value is string} True if the value is a valid email string
 */
export const isEmail = (value: unknown): value is string => {
  if ('string' !== typeof value) {
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

/**
 * Check if value is a valid URL
 *
 * @param {unknown} value The value to check
 * @returns {value is string} True if the value is a valid URL string
 */
export const isUrl = (value: unknown): value is string => {
  if ('string' !== typeof value) {
    return false
  }
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

/**
 * Check if value is empty (null, undefined, empty string/array/object, zero, or false)
 *
 * @param {unknown} value The value to check
 * @returns {boolean} True if the value is empty
 */
export const isEmpty = (value: unknown): boolean => {
  if (isNull(value) || isUndefined(value)) {
    return true
  }
  if (isString(value)) {
    return 0 === value.trim().length
  }
  if (isArray(value)) {
    return 0 === value.length
  }
  if (isObject(value)) {
    return 0 === Object.keys(value).length
  }
  if (isNumber(value)) {
    return 0 === value
  }
  if (isBoolean(value)) {
    return isFalse(value)
  }
  return false
}

/**
 * Check if value is not empty
 *
 * @param {unknown} value The value to check
 * @returns {boolean} True if the value is not empty
 */
export const isNotEmpty = (value: unknown): boolean => !isEmpty(value)

/**
 * Check if value is blank (null, undefined, or empty string/whitespace)
 *
 * @param {unknown} value The value to check
 * @returns {boolean} True if the value is blank
 */
export const isBlank = (value: unknown): boolean => {
  if (value == null) {
    return true
  }
  if ('string' === typeof value) {
    return '' === value.trim()
  }
  return isEmpty(value)
}

/**
 * Check if value is present (not blank)
 *
 * @param {unknown} value The value to check
 * @returns {boolean} True if the value is present
 */
export const isPresent = (value: unknown): boolean => !isBlank(value)

/**
 * Alias for isPresent()
 *
 * @param {unknown} value The value to check
 * @returns {boolean} True if the value is filled
 */
export const filled = (value: unknown): boolean => isPresent(value)

/**
 * Alias for isBlank()
 *
 * @param {unknown} value The value to check
 * @returns {boolean} True if the value is blank
 */
export const blank = (value: unknown): boolean => isBlank(value)

/**
 * Check if value is an even number
 *
 * @param {unknown} value The value to check
 * @returns {value is number} True if the value is an even number
 */
export const isEven = (value: unknown): value is number => {
  return isNumber(value) && 0 === value % 2
}

/**
 * Check if value is an odd number
 *
 * @param {unknown} value The value to check
 * @returns {value is number} True if the value is an odd number
 */
export const isOdd = (value: unknown): value is number => {
  return isNumber(value) && 0 !== value % 2
}

/**
 * Check if value is a valid JSON string
 *
 * @param {unknown} value The value to check
 * @returns {boolean} True if the value is a valid JSON string
 */
export const isJson = (value: unknown): boolean => {
  if ('string' !== typeof value) {
    return false
  }

  try {
    JSON.parse(value)
    return true
  } catch {
    return false
  }
}

/**
 * Check if value is a valid Base64 encoded string
 *
 * @param {unknown} value The value to check
 * @returns {boolean} True if the value is a valid Base64 string
 */
export const isBase64 = (value: unknown): boolean => {
  if ('string' !== typeof value) {
    return false
  }

  // Base64 pattern: groups of 4 characters from the base64 alphabet
  const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/

  // Check if length is multiple of 4
  if (0 !== value.length % 4) {
    return false
  }

  return base64Pattern.test(value)
}

/**
 * Check if value is a valid MAC address
 *
 * @param {unknown} value The value to check
 * @returns {boolean} True if the value is a valid MAC address
 */
export const isMacAddress = (value: unknown): boolean => {
  if ('string' !== typeof value) {
    return false
  }

  // MAC address patterns: XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX
  const macPattern = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
  return macPattern.test(value)
}

/**
 * Check if value is a valid UUID (v4)
 *
 * @param {unknown} value The value to check
 * @returns {value is string} True if the value is a valid UUID v4 string
 */
export const isUuid = (value: unknown): value is string => {
  if ('string' !== typeof value) {
    return false
  }
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

/**
 * Check if value is a valid IPv4 or IPv6 address
 *
 * @param {unknown} value The value to check
 * @returns {value is string} True if the value is a valid IP address string
 */
export const isIp = (value: unknown): value is string => {
  if ('string' !== typeof value) {
    return false
  }

  // IPv4
  const ipv4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/
  if (ipv4.test(value)) {
    return value.split('.').every((part) => {
      const n = Number(part)
      return n >= 0 && n <= 255 && String(n) === part
    })
  }

  // IPv6 (covers full, compressed, and loopback forms)
  const ipv6 =
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|(([0-9a-fA-F]{1,4}:){0,7}:)|(:[0-9a-fA-F]{1,4}){1,7}|(([0-9a-fA-F]{1,4}:){1,7}:)|(([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4})|::1)$/
  return ipv6.test(value)
}
