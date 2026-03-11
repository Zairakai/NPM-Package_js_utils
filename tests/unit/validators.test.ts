import { describe, expect, it } from 'vitest'
import {
  blank,
  filled,
  isArray,
  isBase64,
  isBlank,
  isBoolean,
  isDate,
  isEmail,
  isEmpty,
  isEven,
  isFalse,
  isFloat,
  isFunction,
  isInteger,
  isIp,
  isJson,
  isMacAddress,
  isNotEmpty,
  isNull,
  isNumber,
  isNumeric,
  isObject,
  isOdd,
  isPresent,
  isSet,
  isString,
  isTrue,
  isUndefined,
  isUrl,
  isUuid,
} from '../../src/validators'

describe('validators', () => {
  it('validates emails and urls', () => {
    expect(isEmail('john@doe.com')).toBe(true)
    expect(isEmail('invalid@')).toBe(false)

    expect(isUrl('https://example.com')).toBe(true)
    expect(isUrl('not a url')).toBe(false)
  })

  it('detects empty values', () => {
    expect(isEmpty(null)).toBe(true)
    expect(isEmpty('   ')).toBe(true)
    expect(isEmpty([])).toBe(true)
    expect(isEmpty({})).toBe(true)
    expect(isEmpty(0)).toBe(true)
    expect(isEmpty(false)).toBe(true)
    expect(isEmpty('ok')).toBe(false)
  })

  it('checks numeric strings and numbers', () => {
    expect(isNumeric('42')).toBe(true)
    expect(isNumeric(42)).toBe(true)
    expect(isNumeric('42px')).toBe(false)
    expect(isNumeric({})).toBe(false)
  })
})

describe('basic type guards', () => {
  it('isTrue / isFalse', () => {
    expect(isTrue(true)).toBe(true)
    expect(isTrue(false)).toBe(false)
    expect(isFalse(false)).toBe(true)
    expect(isFalse(true)).toBe(false)
  })

  it('isNull / isUndefined / isSet', () => {
    expect(isNull(null)).toBe(true)
    expect(isNull(undefined)).toBe(false)
    expect(isUndefined(undefined)).toBe(true)
    expect(isUndefined(null)).toBe(false)
    expect(isSet(0)).toBe(true)
    expect(isSet(null)).toBe(false)
    expect(isSet(undefined)).toBe(false)
  })

  it('isArray / isObject', () => {
    expect(isArray([])).toBe(true)
    expect(isArray({})).toBe(false)
    expect(isObject({})).toBe(true)
    expect(isObject([])).toBe(false)
    expect(isObject(null)).toBe(false)
  })

  it('isString / isNumber / isInteger / isFloat / isBoolean', () => {
    expect(isString('hello')).toBe(true)
    expect(isString(1)).toBe(false)
    expect(isNumber(3.14)).toBe(true)
    expect(isNumber(NaN)).toBe(false)
    expect(isInteger(42)).toBe(true)
    expect(isInteger(3.14)).toBe(false)
    expect(isFloat(3.14)).toBe(true)
    expect(isFloat(42)).toBe(false)
    expect(isBoolean(true)).toBe(true)
    expect(isBoolean(1)).toBe(false)
  })

  it('isFunction', () => {
    expect(isFunction(() => {})).toBe(true)
    expect(isFunction('not a fn')).toBe(false)
  })

  it('isDate', () => {
    expect(isDate(new Date())).toBe(true)
    expect(isDate(new Date('invalid'))).toBe(false)
    expect(isDate('2024-01-01')).toBe(false)
  })
})

describe('isNumeric() edge cases', () => {
  it('rejects NaN and empty string', () => {
    expect(isNumeric(NaN)).toBe(false)
    expect(isNumeric('')).toBe(false)
    expect(isNumeric('  ')).toBe(false)
  })

  it('accepts decimal and negative numbers', () => {
    expect(isNumeric('-3.14')).toBe(true)
    expect(isNumeric(Infinity)).toBe(false)
    expect(isNumeric('Infinity')).toBe(false)
  })
})

describe('isEmpty() / isNotEmpty()', () => {
  it('isEmpty for all types', () => {
    expect(isEmpty('')).toBe(true)
    expect(isEmpty('hello')).toBe(false)
    expect(isEmpty([1])).toBe(false)
    expect(isEmpty({ a: 1 })).toBe(false)
    expect(isEmpty(1)).toBe(false)
    expect(isEmpty(true)).toBe(false)
    expect(isEmpty(undefined)).toBe(true)
  })

  it('isNotEmpty is opposite of isEmpty', () => {
    expect(isNotEmpty('hi')).toBe(true)
    expect(isNotEmpty('')).toBe(false)
  })
})

describe('isBlank() / isPresent()', () => {
  it('isBlank detects blank values', () => {
    expect(isBlank(null)).toBe(true)
    expect(isBlank(undefined)).toBe(true)
    expect(isBlank('')).toBe(true)
    expect(isBlank('  ')).toBe(true)
    expect(isBlank('hello')).toBe(false)
    expect(isBlank(0)).toBe(true)
  })

  it('isPresent is opposite of isBlank', () => {
    expect(isPresent('hello')).toBe(true)
    expect(isPresent('')).toBe(false)
  })
})

describe('filled() / blank() aliases', () => {
  it('filled() is alias for isPresent()', () => {
    expect(filled('hello')).toBe(true)
    expect(filled('')).toBe(false)
  })

  it('blank() is alias for isBlank()', () => {
    expect(blank(null)).toBe(true)
    expect(blank('hello')).toBe(false)
  })
})

describe('isEven() / isOdd()', () => {
  it('isEven detects even numbers', () => {
    expect(isEven(4)).toBe(true)
    expect(isEven(3)).toBe(false)
    expect(isEven('4' as any)).toBe(false)
  })

  it('isOdd detects odd numbers', () => {
    expect(isOdd(3)).toBe(true)
    expect(isOdd(4)).toBe(false)
  })
})

describe('isJson()', () => {
  it('validates JSON strings', () => {
    expect(isJson('{"key":"value"}')).toBe(true)
    expect(isJson('[1, 2, 3]')).toBe(true)
    expect(isJson('not json')).toBe(false)
    expect(isJson(42 as any)).toBe(false)
  })
})

describe('isBase64()', () => {
  it('validates base64 strings', () => {
    expect(isBase64('SGVsbG8=')).toBe(true)
    expect(isBase64('aGVsbG8=')).toBe(true)
    expect(isBase64('not-base64!')).toBe(false)
    expect(isBase64(42 as any)).toBe(false)
  })

  it('rejects strings not divisible by 4', () => {
    expect(isBase64('abc')).toBe(false)
  })
})

describe('isMacAddress()', () => {
  it('validates MAC addresses with colons', () => {
    expect(isMacAddress('00:1A:2B:3C:4D:5E')).toBe(true)
    expect(isMacAddress('aa:bb:cc:dd:ee:ff')).toBe(true)
  })

  it('validates MAC addresses with dashes', () => {
    expect(isMacAddress('00-1A-2B-3C-4D-5E')).toBe(true)
  })

  it('rejects invalid MAC addresses', () => {
    expect(isMacAddress('invalid-mac')).toBe(false)
    expect(isMacAddress('00:1A:2B:3C:4D')).toBe(false)
    expect(isMacAddress(42 as any)).toBe(false)
  })
})

describe('isUuid()', () => {
  it('accepts valid v4 UUIDs', () => {
    expect(isUuid('f47ac10b-58cc-4372-a567-0e02b2c3d479')).toBe(true)
    expect(isUuid('00000000-0000-4000-8000-000000000000')).toBe(true)
  })

  it('rejects non-v4 UUIDs', () => {
    expect(isUuid('6ba7b810-9dad-11d1-80b4-00c04fd430c8')).toBe(false) // v1
    expect(isUuid('a3bb189e-8bf9-3888-9912-ace4e6543002')).toBe(false) // v3
  })

  it('rejects invalid UUIDs', () => {
    expect(isUuid('not-a-uuid')).toBe(false)
    expect(isUuid('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')).toBe(false)
    expect(isUuid(42 as any)).toBe(false)
  })
})

describe('isIp()', () => {
  it('accepts valid IPv4 addresses', () => {
    expect(isIp('192.168.1.1')).toBe(true)
    expect(isIp('0.0.0.0')).toBe(true)
    expect(isIp('255.255.255.255')).toBe(true)
  })

  it('rejects invalid IPv4 addresses', () => {
    expect(isIp('256.0.0.1')).toBe(false)
    expect(isIp('192.168.1')).toBe(false)
    expect(isIp('192.168.1.01')).toBe(false)
  })

  it('accepts valid IPv6 addresses', () => {
    expect(isIp('::1')).toBe(true)
    expect(isIp('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true)
  })

  it('rejects non-IP values', () => {
    expect(isIp('not an ip')).toBe(false)
    expect(isIp(42 as any)).toBe(false)
  })
})
