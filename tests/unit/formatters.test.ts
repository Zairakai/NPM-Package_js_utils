import { describe, expect, it } from 'vitest'
import {
  camelCase,
  capitalize,
  kebabCase,
  normalizeString,
  numberFormat,
  slugify,
  snakeCase,
  strContainsAll,
  strContainsAny,
  strFinish,
  strLimit,
  strMask,
  strPadBoth,
  strPadLeft,
  strPadRight,
  strRemove,
  strReverse,
  strStart,
  strWordCount,
  strWords,
  studlyCase,
  titleCase,
} from '../../src/formatters'

describe('capitalize()', () => {
  it('capitalizes first letter, lowercases rest', () => {
    expect(capitalize('hello')).toBe('Hello')
    expect(capitalize('WORLD')).toBe('World')
  })

  it('handles null/undefined', () => {
    expect(capitalize(null)).toBe('')
    expect(capitalize(undefined)).toBe('')
  })
})

describe('slugify()', () => {
  it('converts string to slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
    expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces')
  })

  it('removes accents', () => {
    expect(slugify('héllo wörld')).toBe('hello-world')
  })

  it('returns empty string for falsy input', () => {
    expect(slugify('')).toBe('')
    expect(slugify(null)).toBe('')
  })
})

describe('strLimit()', () => {
  it('truncates long strings with ellipsis', () => {
    expect(strLimit('Hello World', 5)).toBe('Hello…')
  })

  it('does not truncate short strings', () => {
    expect(strLimit('Hi', 10)).toBe('Hi')
  })

  it('returns empty string for falsy input', () => {
    expect(strLimit('', 10)).toBe('')
    expect(strLimit(null, 10)).toBe('')
  })
})

describe('normalizeString()', () => {
  it('trims, lowercases and removes diacritics', () => {
    expect(normalizeString('  Héllo  ')).toBe('hello')
    expect(normalizeString('CAFÉ')).toBe('cafe')
  })

  it('returns falsy as-is', () => {
    expect(normalizeString(null)).toBeNull()
    expect(normalizeString(undefined)).toBeUndefined()
    expect(normalizeString('')).toBe('')
  })
})

describe('strContainsAll()', () => {
  it('returns true when all needles found', () => {
    expect(strContainsAll('hello world', ['hello', 'world'])).toBe(true)
  })

  it('returns false when any needle missing', () => {
    expect(strContainsAll('hello world', ['hello', 'foo'])).toBe(false)
  })

  it('returns false for empty/invalid inputs', () => {
    expect(strContainsAll('', ['hello'])).toBe(false)
    expect(strContainsAll('hello', null as any)).toBe(false)
  })
})

describe('strContainsAny()', () => {
  it('returns true when any needle found', () => {
    expect(strContainsAny('hello world', ['hello', 'foo'])).toBe(true)
  })

  it('returns false when no needle found', () => {
    expect(strContainsAny('hello world', ['foo', 'bar'])).toBe(false)
  })
})

describe('strFinish()', () => {
  it('appends cap if not already present', () => {
    expect(strFinish('/path', '/')).toBe('/path/')
  })

  it('does not duplicate cap', () => {
    expect(strFinish('/path/', '/')).toBe('/path/')
  })

  it('returns cap for empty string', () => {
    expect(strFinish('', '/')).toBe('/')
  })

  it('returns value when cap is empty', () => {
    expect(strFinish('/path', '')).toBe('/path')
  })
})

describe('strStart()', () => {
  it('prepends prefix if not already present', () => {
    expect(strStart('path/', '/')).toBe('/path/')
  })

  it('does not duplicate prefix', () => {
    expect(strStart('/path/', '/')).toBe('/path/')
  })

  it('returns prefix for empty string', () => {
    expect(strStart('', '/')).toBe('/')
  })
})

describe('strPadBoth()', () => {
  it('pads string equally on both sides', () => {
    expect(strPadBoth('hi', 6)).toBe('  hi  ')
  })

  it('handles odd padding (more on right)', () => {
    expect(strPadBoth('hi', 7)).toBe('  hi   ')
  })

  it('returns string unchanged if already at length', () => {
    expect(strPadBoth('hello', 5)).toBe('hello')
  })
})

describe('strPadLeft()', () => {
  it('pads on left', () => {
    expect(strPadLeft('5', 3, '0')).toBe('005')
  })
})

describe('strPadRight()', () => {
  it('pads on right', () => {
    expect(strPadRight('5', 3, '0')).toBe('500')
  })
})

describe('strReverse()', () => {
  it('reverses a string', () => {
    expect(strReverse('hello')).toBe('olleh')
  })
})

describe('strRemove()', () => {
  it('removes all occurrences (case-sensitive)', () => {
    expect(strRemove('o', 'hello world')).toBe('hell wrld')
  })

  it('removes case-insensitively when specified', () => {
    expect(strRemove('O', 'hello world', false)).toBe('hell wrld')
  })

  it('returns subject unchanged for empty search', () => {
    expect(strRemove('', 'hello')).toBe('hello')
  })
})

describe('strMask()', () => {
  it('masks portion of string', () => {
    expect(strMask('1234567890', '*', 2, 4)).toBe('12****7890')
  })

  it('masks from index to end when no length', () => {
    expect(strMask('hello', '*', 2)).toBe('he***')
  })

  it('returns empty string for empty input', () => {
    expect(strMask('', '*', 0)).toBe('')
  })
})

describe('strWordCount()', () => {
  it('counts words', () => {
    expect(strWordCount('hello world foo')).toBe(3)
  })

  it('returns 0 for empty string', () => {
    expect(strWordCount('')).toBe(0)
  })
})

describe('strWords()', () => {
  it('truncates to word limit', () => {
    expect(strWords('one two three four five', 3)).toBe('one two three...')
  })

  it('returns full string when under limit', () => {
    expect(strWords('hello world', 10)).toBe('hello world')
  })

  it('uses custom ending', () => {
    expect(strWords('one two three', 2, ' →')).toBe('one two →')
  })

  it('returns empty string for empty input', () => {
    expect(strWords('')).toBe('')
  })
})

describe('camelCase()', () => {
  it('converts to camelCase', () => {
    expect(camelCase('hello world')).toBe('helloWorld')
  })
})

describe('snakeCase()', () => {
  it('converts to snake_case', () => {
    expect(snakeCase('hello world')).toBe('hello_world')
    expect(snakeCase('helloWorld')).toBe('hello_world')
  })
})

describe('kebabCase()', () => {
  it('converts to kebab-case', () => {
    expect(kebabCase('hello world')).toBe('hello-world')
    expect(kebabCase('helloWorld')).toBe('hello-world')
  })
})

describe('studlyCase()', () => {
  it('converts to StudlyCase', () => {
    expect(studlyCase('hello world')).toBe('HelloWorld')
  })
})

describe('titleCase()', () => {
  it('converts to Title Case', () => {
    expect(titleCase('hello world')).toBe('Hello World')
  })
})

describe('numberFormat()', () => {
  it('formats with 2 decimal places by default', () => {
    expect(numberFormat(1234.5)).toBe('1,234.50')
  })

  it('formats with custom decimals', () => {
    expect(numberFormat(1234.5678, 3)).toBe('1,234.568')
  })

  it('formats with locale', () => {
    const result = numberFormat(1234.5, 2, 'fr-FR')
    expect(result).toContain('234')
  })
})
