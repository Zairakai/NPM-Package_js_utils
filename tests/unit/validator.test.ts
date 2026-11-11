import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { Validator } from '../../src/validator'

const rules = { name: z.string().min(2), age: z.number().int() }

describe('Validator.make()', () => {
  it('passes with valid data', () => {
    const validation = Validator.make({ name: 'Ada', age: 36 }, rules)
    expect(validation.passes()).toBe(true)
    expect(validation.fails()).toBe(false)
    expect(validation.errors()).toEqual({})
    expect(validation.allErrors()).toEqual([])
    expect(validation.validated()).toEqual({ name: 'Ada', age: 36 })
  })

  it('fails with invalid data and groups the messages by field', () => {
    const validation = Validator.make({ name: 'A', age: 'x' }, rules)
    expect(validation.fails()).toBe(true)
    expect(validation.passes()).toBe(false)
    expect(Object.keys(validation.errors()).sort()).toEqual(['age', 'name'])
    expect(validation.errors().name).toHaveLength(1)
  })

  it('firstError() returns the first message of a field, or undefined', () => {
    const validation = Validator.make({ name: 'A', age: 36 }, rules)
    expect(validation.firstError('name')).toEqual(expect.any(String))
    expect(validation.firstError('age')).toBeUndefined()
  })

  it('allErrors() lists "path: message" for every issue', () => {
    const validation = Validator.make({ name: 'A', age: 'x' }, rules)
    const messages = validation.allErrors()
    expect(messages).toHaveLength(2)
    expect(messages.some((message) => message.startsWith('name: '))).toBe(true)
    expect(messages.some((message) => message.startsWith('age: '))).toBe(true)
  })

  it('validated() throws when the validation failed', () => {
    expect(() => Validator.make({ name: 'A', age: 36 }, rules).validated()).toThrow('Validation failed')
  })

  it('reports an error without path under "root"', () => {
    const validation = Validator.make('not an object', rules)
    expect(validation.fails()).toBe(true)
    expect(Object.keys(validation.errors())).toEqual(['root'])
  })

  it('accepts a Zod object instead of a shape', () => {
    expect(Validator.make({ name: 'Ada', age: 36 }, z.object(rules)).passes()).toBe(true)
  })
})

describe('Validator.validate()', () => {
  it('returns the parsed data', () => {
    expect(Validator.validate({ name: 'Ada', age: 36 }, rules)).toEqual({ name: 'Ada', age: 36 })
  })

  it('throws a ZodError when the data is invalid', () => {
    expect(() => Validator.validate({ name: 'A', age: 36 }, rules)).toThrow(z.ZodError)
  })

  it('accepts a Zod object instead of a shape', () => {
    expect(Validator.validate({ name: 'Ada', age: 36 }, z.object(rules))).toEqual({ name: 'Ada', age: 36 })
  })
})

describe('Validator.isEqual() and diff()', () => {
  it('isEqual() compares deeply', () => {
    expect(Validator.isEqual({ a: [1, 2] }, { a: [1, 2] })).toBe(true)
    expect(Validator.isEqual({ a: [1, 2] }, { a: [1, 3] })).toBe(false)
  })

  it('diff() returns the differences', () => {
    expect(Validator.diff({ a: 1, b: 2 }, { a: 1, b: 3 })).not.toEqual({})
    expect(Validator.diff({ a: 1 }, { a: 1 })).toEqual({})
  })
})
