import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { num } from '../../src/number'
import { obj } from '../../src/obj'
import { pipe } from '../../src/pipe'
import { isRecord, optional, retry, throw_if, throw_unless } from '../../src/runtime'
import { str } from '../../src/str'
import { validator } from '../../src/validator'

describe('New Helpers Integration', () => {
  describe('Str fluent helper', () => {
    it('can chain all string operations', () => {
      const result = str(' hello world ')
        .trim()
        .capitalize()
        .append(' extra')
        .replace('extra', 'code')
        .upper()
        .reverse()
        .toString()

      expect(result).toBe('EDOC DLROW OLLEH')
    })

    it('handles case transformations', () => {
      expect(str('hello_world').camel().get()).toBe('helloWorld')
      expect(str('helloWorld').snake().get()).toBe('hello_world')
      expect(str('helloWorld').kebab().get()).toBe('hello-world')
      expect(str('hello world').studly().get()).toBe('HelloWorld')
      expect(str('hello world').title().get()).toBe('Hello World')
    })

    it('handles masking and limiting', () => {
      expect(str('secret-password').mask('*', 7).get()).toBe('secret-********')
      expect(str('long string here').limit(4, '...').get()).toBe('long...')
    })

    it('handles start and finish', () => {
      expect(str('path').start('/').get()).toBe('/path')
      expect(str('/path').start('/').get()).toBe('/path')
      expect(str('path').finish('/').get()).toBe('path/')
      expect(str('path/').finish('/').get()).toBe('path/')
    })

    it('handles containment checks', () => {
      const s = str('The quick brown fox')
      expect(s.contains('quick')).toBe(true)
      expect(s.contains(['quick', 'slow'])).toBe(true)
      expect(s.containsAll(['quick', 'fox'])).toBe(true)
      expect(s.startsWith('The')).toBe(true)
      expect(s.endsWith('fox')).toBe(true)
    })

    it('can execute conditional logic with when/tap/pipe', () => {
      let tapped = false
      const result = str('test')
        .when(true, (s) => s.append('-ok'))
        .tap(() => (tapped = true))
        .pipe((s) => s.get().length)

      expect(result).toBe(7)
      expect(tapped).toBe(true)
    })
  })

  describe('Number fluent helper', () => {
    it('can format numbers properly', () => {
      expect(num(1234.56).format(1)).toBe('1,234.6')
      expect(num(100).percentage()).toBe('100%')
      expect(num(1024).fileSize()).toBe('1 KB')
      expect(num(1048576).fileSize(0)).toBe('1 MB')
    })

    it('handles math operations and clamping', () => {
      expect(num(10).add(5).sub(2).mul(2).div(2).get()).toBe(13)
      expect(num(50).clamp(0, 20).get()).toBe(20)
      expect(num(-10).clamp(0, 20).get()).toBe(0)
    })

    it('handles rounding', () => {
      expect(num(1.234).round(2).get()).toBe(1.23)
      expect(num(1.2).ceil().get()).toBe(2)
      expect(num(1.8).floor().get()).toBe(1)
    })

    it('handles abbreviations and ordinals', () => {
      expect(num(1500).abbreviate()).toBe('1.5K')
      expect(num(1).ordinal()).toBe('1st')
      expect(num(2).ordinal()).toBe('2nd')
      expect(num(3).ordinal()).toBe('3rd')
      expect(num(4).ordinal()).toBe('4th')
    })

    it('handles range checks', () => {
      expect(num(10).isBetween(5, 15)).toBe(true)
      expect(num(20).isBetween(5, 15)).toBe(false)
    })
  })

  describe('Object fluent helper', () => {
    it('can filter and map objects', () => {
      const result = obj({ a: 1, b: 2, c: 3 })
        .filter((v) => 1 < (v as number))
        .map((v) => (v as number) * 2)

      expect(result).toEqual({ b: 4, c: 6 })
    })

    it('handles merging', () => {
      const o = obj({ a: 1 })
      expect(o.merge({ b: 2 }).get()).toEqual({ a: 1, b: 2 })

      const deep = obj({ a: { b: 1 } })
      deep.mergeDeep({ a: { c: 2 } })
      expect(deep.get()).toEqual({ a: { b: 1, c: 2 } })
    })

    it('can pick and omit keys', () => {
      const o = obj({ a: 1, b: 2, c: 3 })
      expect(o.only(['a', 'b']).toObject()).toEqual({ a: 1, b: 2 })
      expect(o.except(['a']).toObject()).toEqual({ b: 2, c: 3 })
    })

    it('handles keys and values', () => {
      const o = obj({ a: 1, b: 2 })
      expect(o.keys()).toEqual(['a', 'b'])
      expect(o.values()).toEqual([1, 2])
    })
  })

  describe('Runtime helpers', () => {
    it('isRecord() validates correctly', () => {
      expect(isRecord({})).toBe(true)
      expect(isRecord([])).toBe(false)
      expect(isRecord(null)).toBe(false)
      expect(isRecord(42)).toBe(false)
    })

    it('optional() returns null or value', () => {
      expect(optional(undefined)).toBe(null)
      expect(optional('val')).toBe('val')
    })

    it('throw_if and throw_unless work', () => {
      expect(() => throw_if(true, 'error')).toThrow('error')
      expect(() => throw_if(false, 'error')).not.toThrow()
      expect(() => throw_unless(false, 'error')).toThrow('error')
      expect(() => throw_unless(true, 'error')).not.toThrow()
    })

    it('retry() retries operations', async () => {
      let attempts = 0
      const result = await retry(3, () => {
        attempts++
        if (2 > attempts) throw new Error('Fail')
        return 'success'
      })
      expect(result).toBe('success')
      expect(attempts).toBe(2)
    })
  })

  describe('Pipe helper', () => {
    it('can pipe values through functions', () => {
      const result = pipe('hello')
        .through((s) => s.toUpperCase())
        .through((s) => `${s} WORLD`)
        .value()

      expect(result).toBe('HELLO WORLD')
    })
  })

  describe('Validator helper', () => {
    it('can validate data with rules object', () => {
      const v = validator(
        { email: 'test@example.com', age: 25 },
        {
          email: z.string().email(),
          age: z.number().min(18),
        }
      )

      expect(v.passes()).toBe(true)
      expect(v.validated()).toEqual({ email: 'test@example.com', age: 25 })
    })

    it('can return first error and all errors', () => {
      const v = validator(
        { email: 'invalid', age: 10 },
        {
          email: z.string().email(),
          age: z.number().min(18),
        }
      )

      expect(v.firstError('email')).toBeDefined()
      expect(v.allErrors()).toHaveLength(2)
    })
  })
})
