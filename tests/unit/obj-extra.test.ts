import { describe, expect, it } from 'vitest'
import { Obj, obj } from '../../src/obj'

describe('Objectable (accessors)', () => {
  it('get() and toObject() return the current value', () => {
    const o = obj({ a: 1 })
    expect(o.get()).toEqual({ a: 1 })
    expect(o.toObject()).toBe(o.get())
  })

  it('getOriginal() keeps the state of the construction', () => {
    const o = obj({ a: 1 })
    o.dataSet('a', 2)
    expect(o.getOriginal()).toEqual({ a: 1 })
    expect(o.get()).toEqual({ a: 2 })
  })

  it('dataGet() reads a dotted path and falls back to the default', () => {
    const o = obj({ user: { name: 'Ada' } })
    expect(o.dataGet('user.name')).toBe('Ada')
    expect(o.dataGet('user.age')).toBeNull()
    expect(o.dataGet('user.age', 36)).toBe(36)
  })

  it('has() tells whether a top-level key exists', () => {
    const o = obj({ a: 1, b: undefined })
    expect(o.has('a')).toBe(true)
    expect(o.has('b')).toBe(true)
    expect(o.has('c')).toBe(false)
  })
})

describe('Objectable.clone()', () => {
  it('returns an independent deep copy', () => {
    const o = obj({ nested: { n: 1 } })
    const copy = o.clone()
    copy.dataSet('nested.n', 2)
    expect(o.get().nested.n).toBe(1)
    expect(copy.get().nested.n).toBe(2)
  })
})

describe('Objectable.pipe()', () => {
  it('passes the instance to the callback and returns its result', () => {
    const o = obj({ a: 1, b: 2 })
    expect(o.pipe((self) => Object.keys(self.get()).length)).toBe(2)
  })
})

describe('Objectable.when()', () => {
  it('runs the callback when the condition is true', () => {
    const o = obj({ a: 1 })
    o.when(true, (self) => self.dataSet('a', 2))
    expect(o.get().a).toBe(2)
  })

  it('does not run the callback when the condition is false', () => {
    const o = obj({ a: 1 })
    o.when(false, (self) => self.dataSet('a', 2))
    expect(o.get().a).toBe(1)
  })

  it('evaluates a function condition', () => {
    const o = obj({ a: 1 })
    o.when(
      () => true,
      (self) => self.dataSet('a', 3),
    )
    o.when(
      () => false,
      (self) => self.dataSet('a', 4),
    )
    expect(o.get().a).toBe(3)
  })

  it('returns the instance to chain', () => {
    const o = obj({ a: 1 })
    expect(o.when(false, () => undefined)).toBe(o)
  })
})

describe('Obj (static helpers)', () => {
  it('of() creates an Objectable', () => {
    expect(Obj.of({ a: 1 }).get()).toEqual({ a: 1 })
  })

  it('keys() and values() list the entries', () => {
    expect(Obj.keys({ a: 1, b: 2 })).toEqual(['a', 'b'])
    expect(Obj.values({ a: 1, b: 2 })).toEqual([1, 2])
  })

  it('merge() returns a new object and leaves the sources alone', () => {
    const target = { a: 1 }
    const merged = Obj.merge(target, { b: 2 }, { a: 3 })
    expect(merged).toEqual({ a: 3, b: 2 })
    expect(target).toEqual({ a: 1 })
  })
})
