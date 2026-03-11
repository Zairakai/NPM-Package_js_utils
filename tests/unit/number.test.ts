import { describe, expect, it } from 'vitest'
import { NumberHelper, num } from '../../src/number'

describe('Numberable uncovered branches', () => {
  it('NaN input defaults to 0', () => {
    expect(num('not-a-number').get()).toBe(0)
  })

  it('toNumber() returns the raw value', () => {
    expect(num(42).toNumber()).toBe(42)
  })

  it('currency() formats as USD by default', () => {
    expect(num(9.99).currency()).toBe('$9.99')
  })

  it('currency() with explicit currency and locale', () => {
    expect(num(10).currency('EUR', 'fr-FR')).toContain('€')
  })

  it('percentage() with decimals', () => {
    expect(num(33.3).percentage(1)).toBe('33.3%')
  })

  it('fileSize() returns "0 B" for zero', () => {
    expect(num(0).fileSize()).toBe('0 B')
  })

  it('abbreviate() returns string as-is below 1000', () => {
    expect(num(999).abbreviate()).toBe('999')
  })

  it('div() by zero is a no-op', () => {
    expect(num(10).div(0).get()).toBe(10)
  })

  it('isBetween() exclusive mode excludes boundaries', () => {
    expect(num(5).isBetween(5, 10, false)).toBe(false)
    expect(num(6).isBetween(5, 10, false)).toBe(true)
    expect(num(10).isBetween(5, 10, false)).toBe(false)
  })

  it('when() executes callback when condition is true', () => {
    expect(
      num(10)
        .when(true, (n) => n.add(5))
        .get()
    ).toBe(15)
    expect(
      num(10)
        .when(false, (n) => n.add(5))
        .get()
    ).toBe(10)
  })

  it('when() with function condition', () => {
    expect(
      num(10)
        .when(
          () => true,
          (n) => n.mul(2)
        )
        .get()
    ).toBe(20)
  })

  it('pipe() passes the instance to callback', () => {
    expect(num(10).pipe((n) => n.get() * 2)).toBe(20)
  })
})

describe('NumberHelper static methods', () => {
  it('of() creates a Numberable', () => {
    expect(NumberHelper.of(5).add(3).get()).toBe(8)
  })

  it('format() formats with decimals and locale', () => {
    expect(NumberHelper.format(1234, 0)).toBe('1,234')
  })

  it('currency() formats as currency', () => {
    expect(NumberHelper.currency(9.99)).toBe('$9.99')
  })

  it('percentage() formats as percent', () => {
    expect(NumberHelper.percentage(50)).toBe('50%')
  })

  it('fileSize() formats file size', () => {
    expect(NumberHelper.fileSize(0)).toBe('0 B')
    expect(NumberHelper.fileSize(1024, 0)).toBe('1 KB')
  })

  it('abbreviate() abbreviates large numbers', () => {
    expect(NumberHelper.abbreviate(2000)).toBe('2K')
  })

  it('ordinal() handles teen numbers (11th, 12th, 13th)', () => {
    expect(NumberHelper.ordinal(11)).toBe('11th')
    expect(NumberHelper.ordinal(12)).toBe('12th')
    expect(NumberHelper.ordinal(13)).toBe('13th')
    expect(NumberHelper.ordinal(21)).toBe('21st')
  })
})
