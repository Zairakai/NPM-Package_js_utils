import { describe, expect, it } from 'vitest'
import { Str, str } from '../../src/str'

describe('Str static helper', () => {
  it('Str.of() creates a Stringable instance', () => {
    expect(Str.of('hello').upper().get()).toBe('HELLO')
  })

  it('Str.slug(), snake(), kebab(), camel(), studly(), title()', () => {
    expect(Str.slug('Hello World')).toBe('hello-world')
    expect(Str.snake('helloWorld')).toBe('hello_world')
    expect(Str.kebab('helloWorld')).toBe('hello-world')
    expect(Str.camel('hello_world')).toBe('helloWorld')
    expect(Str.studly('hello world')).toBe('HelloWorld')
    expect(Str.title('hello world')).toBe('Hello World')
  })

  it('Str.limit() with custom end', () => {
    expect(Str.limit('hello world', 5, '...')).toBe('hello...')
    expect(Str.limit('hello world', 5)).toBe('hello…')
    expect(Str.limit('hi', 10)).toBe('hi')
  })

  it('Str.random() returns alphanumeric string of given length', () => {
    const r = Str.random(8)
    expect(r).toHaveLength(8)
    expect(r).toMatch(/^[A-Za-z0-9]+$/)
  })

  it('Str.random() defaults to 16 chars', () => {
    expect(Str.random()).toHaveLength(16)
  })

  it('Str.uuid() returns a valid UUID v4', () => {
    const uuid = Str.uuid()
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  })
})

describe('Stringable uncovered branches', () => {
  it('prepend() adds value before the string', () => {
    expect(str('world').prepend('hello ').get()).toBe('hello world')
  })

  it('lower() converts to lowercase', () => {
    expect(str('HELLO').lower().get()).toBe('hello')
  })

  it('trim(chars) removes custom characters', () => {
    expect(str('***hello***').trim('*').get()).toBe('hello')
  })

  it('replaceAll() with string replaces every occurrence', () => {
    expect(str('aaa').replaceAll('a', 'b').get()).toBe('bbb')
  })

  it('replaceAll() with RegExp without global flag adds it', () => {
    expect(str('aaa').replaceAll(/a/, 'b').get()).toBe('bbb')
  })

  it('replaceAll() with RegExp that already has global flag', () => {
    expect(str('aaa').replaceAll(/a/g, 'b').get()).toBe('bbb')
  })

  it('startsWith() with array checks any prefix', () => {
    expect(str('hello').startsWith(['hi', 'hel'])).toBe(true)
    expect(str('hello').startsWith(['bye', 'nope'])).toBe(false)
  })

  it('endsWith() with array checks any suffix', () => {
    expect(str('hello').endsWith(['lo', 'bye'])).toBe(true)
    expect(str('hello').endsWith(['bye', 'nope'])).toBe(false)
  })

  it('when() false condition skips callback', () => {
    expect(
      str('hello')
        .when(false, (s) => s.upper())
        .get()
    ).toBe('hello')
  })

  it('when() with function condition', () => {
    expect(
      str('hello')
        .when(
          () => true,
          (s) => s.upper()
        )
        .get()
    ).toBe('HELLO')
    expect(
      str('hello')
        .when(
          () => false,
          (s) => s.upper()
        )
        .get()
    ).toBe('hello')
  })
})
