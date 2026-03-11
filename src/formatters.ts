/**
 * String manipulation and formatting utilities
 */

/**
 * Capitalize the first letter of a string and lowercase the rest.
 *
 * @param {unknown} value The value to capitalize
 * @returns {string} The capitalized string
 */
export const capitalize = (value: unknown): string => {
  if (value == null) {
    return ''
  }

  const stringValue = String(value)
  return stringValue.charAt(0).toUpperCase() + stringValue.slice(1).toLowerCase()
}

/**
 * Convert a string into a URL-friendly "slug".
 *
 * @param {unknown} text The text to slugify
 * @returns {string} The slugified string
 */
export const slugify = (text: unknown): string => {
  if (!text) {
    return ''
  }

  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

/**
 * Limit the number of characters in a string.
 *
 * @param {unknown} value The string to limit
 * @param {number} size The maximum number of characters
 * @returns {string} The limited string
 */
export const strLimit = (value: unknown, size: number): string => {
  if (!value) {
    return ''
  }

  const stringValue = String(value)
  return stringValue.length <= size ? stringValue : `${stringValue.slice(0, size)}…`
}

/**
 * Normalize a string by trimming, lowercasing, and removing accents.
 *
 * @param {string | null | undefined} value The string to normalize
 * @returns {string | null | undefined} The normalized string
 */
export const normalizeString = (value: string | null | undefined): string | null | undefined => {
  if (!value) {
    return value
  }

  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

// String containment helpers
/**
 * Determine if a string contains all of the given values.
 *
 * @param {string} haystack The string to search in
 * @param {string[]} needles The values to search for
 * @returns {boolean} True if all values are found
 */
export const strContainsAll = (haystack: string, needles: string[]): boolean => {
  if (!haystack || !Array.isArray(needles)) {
    return false
  }
  return needles.every((needle) => haystack.includes(needle))
}

/**
 * Determine if a string contains any of the given values.
 *
 * @param {string} haystack The string to search in
 * @param {string[]} needles The values to search for
 * @returns {boolean} True if any value is found
 */
export const strContainsAny = (haystack: string, needles: string[]): boolean => {
  if (!haystack || !Array.isArray(needles)) {
    return false
  }
  return needles.some((needle) => haystack.includes(needle))
}

// String padding helpers
/**
 * Cap a string with a single instance of a given value.
 *
 * @param {string} value The source string
 * @param {string} cap The value to append if not present
 * @returns {string} The capped string
 */
export const strFinish = (value: string, cap: string): string => {
  if (!value) {
    return cap
  }
  if (!cap) {
    return value
  }
  return value.endsWith(cap) ? value : value + cap
}

/**
 * Begin a string with a single instance of a given value.
 *
 * @param {string} value The source string
 * @param {string} prefix The value to prepend if not present
 * @returns {string} The prefixed string
 */
export const strStart = (value: string, prefix: string): string => {
  if (!value) {
    return prefix
  }
  if (!prefix) {
    return value
  }
  return value.startsWith(prefix) ? value : prefix + value
}

/**
 * Pad both sides of a string with another.
 *
 * @param {string} str The source string
 * @param {number} length The desired length
 * @param {string} [pad=' '] The value to pad with
 * @returns {string} The padded string
 */
export const strPadBoth = (str: string, length: number, pad = ' '): string => {
  if (str.length >= length) {
    return str
  }
  const totalPad = length - str.length
  const leftPad = Math.floor(totalPad / 2)
  const rightPad = totalPad - leftPad
  return pad.repeat(leftPad) + str + pad.repeat(rightPad)
}

/**
 * Pad the left side of a string with another.
 *
 * @param {string} str The source string
 * @param {number} length The desired length
 * @param {string} [pad=' '] The value to pad with
 * @returns {string} The padded string
 */
export const strPadLeft = (str: string, length: number, pad = ' '): string => {
  return str.padStart(length, pad)
}

/**
 * Pad the right side of a string with another.
 *
 * @param {string} str The source string
 * @param {number} length The desired length
 * @param {string} [pad=' '] The value to pad with
 * @returns {string} The padded string
 */
export const strPadRight = (str: string, length: number, pad = ' '): string => {
  return str.padEnd(length, pad)
}

// String manipulation helpers
/**
 * Reverse the given string.
 *
 * @param {string} value The string to reverse
 * @returns {string} The reversed string
 */
export const strReverse = (value: string): string => {
  return value.split('').reverse().join('')
}

/**
 * Remove any occurrence of the given string in the subject.
 *
 * @param {string} search The string to remove
 * @param {string} subject The source string
 * @param {boolean} [caseSensitive=true] Whether to perform case-sensitive removal
 * @returns {string} The resulting string
 */
export const strRemove = (search: string, subject: string, caseSensitive = true): string => {
  if (!search || !subject) {
    return subject
  }
  const flags = caseSensitive ? 'g' : 'gi'
  return subject.replace(new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags), '')
}

/**
 * Mask a portion of a string with a repeated character.
 *
 * @param {string} str The source string
 * @param {string} character The character to use for masking
 * @param {number} index The starting index
 * @param {number} [length] The number of characters to mask
 * @returns {string} The masked string
 */
export const strMask = (str: string, character: string, index: number, length?: number): string => {
  if (!str) {
    return str
  }
  const start = Math.max(0, index)
  const end = length !== undefined ? start + length : str.length
  return str.substring(0, start) + character.repeat(end - start) + str.substring(end)
}

// Word helpers
/**
 * Count the number of words in a string.
 *
 * @param {string} str The string to count words in
 * @param {string} [characters] Optional characters to treat as word boundaries
 * @returns {number} The word count
 */
export const strWordCount = (str: string, characters?: string): number => {
  if (!str) {
    return 0
  }
  const pattern = characters ? new RegExp(`[${characters}\\s]+`) : /\s+/
  return str
    .trim()
    .split(pattern)
    .filter((word) => 0 < word.length).length
}

/**
 * Limit the number of words in a string.
 *
 * @param {string} value The string to limit
 * @param {number} [words=100] The maximum number of words
 * @param {string} [end='...'] The string to append if truncated
 * @returns {string} The limited string
 */
export const strWords = (value: string, words = 100, end = '...'): string => {
  if (!value) {
    return ''
  }
  const wordArray = value.trim().split(/\s+/)
  if (wordArray.length <= words) {
    return value
  }
  return wordArray.slice(0, words).join(' ') + end
}

// Case transformation helpers
/**
 * Convert a string to camelCase.
 *
 * @param {string} value The string to convert
 * @returns {string} The camelCased string
 */
export const camelCase = (value: string): string => {
  const studly = studlyCase(value)
  return studly.charAt(0).toLowerCase() + studly.slice(1)
}

/**
 * Convert a string to snake_case.
 *
 * @param {string} value The string to convert
 * @returns {string} The snake_cased string
 */
export const snakeCase = (value: string): string => {
  return value
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase()
}

/**
 * Convert a string to kebab-case.
 *
 * @param {string} value The string to convert
 * @returns {string} The kebab-cased string
 */
export const kebabCase = (value: string): string => {
  return value
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

/**
 * Convert a string to StudlyCase.
 *
 * @param {string} value The string to convert
 * @returns {string} The studlyCased string
 */
export const studlyCase = (value: string): string => {
  return value
    .replace(/[_-]/g, ' ')
    .replace(/\s+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toUpperCase())
    .replace(/\s+/g, '')
}

/**
 * Convert a string to Title Case.
 *
 * @param {string} value The string to convert
 * @returns {string} The titleCased string
 */
export const titleCase = (value: string): string => {
  return value.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

/**
 * Format a number with grouped thousands and decimal point.
 *
 * @param {number} value The number to format
 * @param {number} [decimals=2] The number of decimal points
 * @param {string} [locale='en-US'] The locale to use for formatting
 * @returns {string} The formatted number
 */
export const numberFormat = (value: number, decimals: number = 2, locale: string = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}
