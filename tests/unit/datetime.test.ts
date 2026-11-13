import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  dayjs,
  fromNow,
  isBetweenDates,
  isFuture,
  isPast,
  isToday,
  now,
  today,
  tomorrow,
  yesterday,
} from '../../src/datetime'

describe('datetime', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 15, 14, 30, 0))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('now()', () => {
    it('returns the current date and time', () => {
      expect(now().isSame(dayjs())).toBe(true)
      expect(now().hour()).toBe(14)
    })
  })

  describe('today(), tomorrow(), yesterday()', () => {
    it('today() is the start of the current day', () => {
      expect(today().format('YYYY-MM-DD HH:mm:ss')).toBe('2026-06-15 00:00:00')
    })

    it('tomorrow() is the start of the next day', () => {
      expect(tomorrow().format('YYYY-MM-DD HH:mm:ss')).toBe(
        '2026-06-16 00:00:00',
      )
    })

    it('yesterday() is the start of the previous day', () => {
      expect(yesterday().format('YYYY-MM-DD HH:mm:ss')).toBe(
        '2026-06-14 00:00:00',
      )
    })
  })

  describe('isBetweenDates()', () => {
    it('includes both bounds by default', () => {
      expect(isBetweenDates('2026-06-15', '2026-06-15', '2026-06-20')).toBe(
        true,
      )
      expect(isBetweenDates('2026-06-20', '2026-06-15', '2026-06-20')).toBe(
        true,
      )
    })

    it('is true for a date inside the range', () => {
      expect(isBetweenDates('2026-06-17', '2026-06-15', '2026-06-20')).toBe(
        true,
      )
    })

    it('is false for a date outside the range', () => {
      expect(isBetweenDates('2026-06-21', '2026-06-15', '2026-06-20')).toBe(
        false,
      )
      expect(isBetweenDates('2026-06-14', '2026-06-15', '2026-06-20')).toBe(
        false,
      )
    })

    it('excludes the bounds with "()"', () => {
      expect(
        isBetweenDates('2026-06-15', '2026-06-15', '2026-06-20', 'day', '()'),
      ).toBe(false)
      expect(
        isBetweenDates('2026-06-20', '2026-06-15', '2026-06-20', 'day', '()'),
      ).toBe(false)
      expect(
        isBetweenDates('2026-06-17', '2026-06-15', '2026-06-20', 'day', '()'),
      ).toBe(true)
    })

    it('compares with the given unit', () => {
      expect(
        isBetweenDates('2026-06-30', '2026-06-01', '2026-06-02', 'month'),
      ).toBe(true)
      expect(
        isBetweenDates('2026-07-01', '2026-06-01', '2026-06-02', 'month'),
      ).toBe(false)
    })
  })

  describe('fromNow()', () => {
    it('describes a past date', () => {
      expect(fromNow(new Date(2026, 5, 15, 12, 30, 0))).toBe('2 hours ago')
    })

    it('describes a future date', () => {
      expect(fromNow(new Date(2026, 5, 17, 14, 30, 0))).toBe('in 2 days')
    })
  })

  describe('isToday()', () => {
    it('is true for any time of the current day', () => {
      expect(isToday(new Date(2026, 5, 15, 0, 0, 1))).toBe(true)
      expect(isToday(new Date(2026, 5, 15, 23, 59, 59))).toBe(true)
    })

    it('is false for another day', () => {
      expect(isToday(new Date(2026, 5, 14, 23, 59, 59))).toBe(false)
      expect(isToday(new Date(2026, 5, 16, 0, 0, 0))).toBe(false)
    })
  })

  describe('isPast() and isFuture()', () => {
    it('isPast() is true only before now', () => {
      expect(isPast(new Date(2026, 5, 15, 14, 29, 59))).toBe(true)
      expect(isPast(new Date(2026, 5, 15, 14, 30, 1))).toBe(false)
    })

    it('isFuture() is true only after now', () => {
      expect(isFuture(new Date(2026, 5, 15, 14, 30, 1))).toBe(true)
      expect(isFuture(new Date(2026, 5, 15, 14, 29, 59))).toBe(false)
    })

    it('neither is true for the current instant', () => {
      expect(isPast(now())).toBe(false)
      expect(isFuture(now())).toBe(false)
    })
  })
})
