import { describe, expect, it } from 'vitest'
import { collect } from '../../src/collections'
import { diff, isEqual } from '../../src/equals'
import { obj } from '../../src/obj'
import { Validator } from '../../src/validator'

describe('Dirty Tracking and Comparison', () => {
  describe('Objectable Dirty Tracking', () => {
    it('can track dirty state on objects', () => {
      const user = obj({ name: 'John', age: 30 })

      expect(user.isClean()).toBe(true)
      expect(user.isDirty()).toBe(false)

      user.dataSet('name', 'Jane')

      expect(user.isDirty()).toBe(true)
      expect(user.isDirty('name')).toBe(true)
      expect(user.isDirty('age')).toBe(false)
      expect(user.getDirty()).toEqual({ name: 'Jane' })

      user.syncOriginal()
      expect(user.isClean()).toBe(true)
    })

    it('can track deep dirty state', () => {
      const data = obj({
        profile: {
          address: { city: 'Paris' },
        },
      })

      data.dataSet('profile.address.city', 'Lyon')

      expect(data.isDirty('profile.address.city')).toBe(true)
      expect(data.getDirty()).toEqual({
        profile: {
          address: { city: 'Lyon' },
        },
      })
    })
  })

  describe('EnhancedArray Dirty Tracking', () => {
    it('can track dirty state on collections', () => {
      const list = collect([1, 2, 3])

      expect(list.isClean()).toBe(true)

      list.push(4)

      expect(list.isDirty()).toBe(true)

      list.syncOriginal()
      expect(list.isClean()).toBe(true)
    })
  })

  describe('Deep Equality and Diff', () => {
    it('can compare complex objects', () => {
      const obj1 = { a: [1, 2], b: { c: 3 } }
      const obj2 = { a: [1, 2], b: { c: 3 } }
      const obj3 = { a: [1, 2], b: { c: 4 } }

      expect(isEqual(obj1, obj2)).toBe(true)
      expect(isEqual(obj1, obj3)).toBe(false)
    })

    it('can calculate diff', () => {
      const original = { name: 'John', city: 'Paris', roles: ['admin'] }
      const current = { name: 'John', city: 'Lyon', roles: ['user'] }

      expect(diff(original, current)).toEqual({
        city: 'Lyon',
        roles: ['user'],
      })
    })

    it('can use Validator for comparisons', () => {
      const a = { x: 1 }
      const b = { x: 1 }
      const c = { x: 2 }

      expect(Validator.isEqual(a, b)).toBe(true)
      expect(Validator.diff(a, c)).toEqual({ x: 2 })
    })
  })
})
