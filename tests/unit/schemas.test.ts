import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import {
  ApiResponseSchema,
  DateSchema,
  EmailSchema,
  PaginatedResponseSchema,
  PaginationSchema,
  PhoneSchema,
  UrlSchema,
  safeValidateSchema,
  validateSchema,
} from '../../src/schemas'

describe('EmailSchema', () => {
  it('accepts valid emails', () => {
    expect(() => EmailSchema.parse('user@example.com')).not.toThrow()
    expect(() => EmailSchema.parse('user+tag@domain.org')).not.toThrow()
  })

  it('rejects invalid emails', () => {
    expect(() => EmailSchema.parse('invalid')).toThrow()
    expect(() => EmailSchema.parse('@domain.com')).toThrow()
  })
})

describe('PhoneSchema', () => {
  it('accepts valid phone numbers', () => {
    expect(() => PhoneSchema.parse('+33612345678')).not.toThrow()
    expect(() => PhoneSchema.parse('+14155552671')).not.toThrow()
  })

  it('rejects invalid phone numbers', () => {
    expect(() => PhoneSchema.parse('not-a-phone')).toThrow()
    expect(() => PhoneSchema.parse('00')).toThrow()
  })
})

describe('UrlSchema', () => {
  it('accepts valid URLs', () => {
    expect(() => UrlSchema.parse('https://example.com')).not.toThrow()
    expect(() => UrlSchema.parse('https://sub.domain.io/path?q=1')).not.toThrow()
  })

  it('rejects invalid URLs', () => {
    expect(() => UrlSchema.parse('not a url')).toThrow()
    expect(() => UrlSchema.parse('ftp://')).toThrow()
  })
})

describe('DateSchema', () => {
  it('accepts ISO datetime strings', () => {
    expect(() => DateSchema.parse('2024-01-15T10:30:00.000Z')).not.toThrow()
  })

  it('accepts YYYY-MM-DD format', () => {
    expect(() => DateSchema.parse('2024-01-15')).not.toThrow()
  })

  it('accepts Date objects', () => {
    expect(() => DateSchema.parse(new Date())).not.toThrow()
  })

  it('rejects invalid dates', () => {
    expect(() => DateSchema.parse('not-a-date')).toThrow()
  })
})

describe('ApiResponseSchema()', () => {
  it('validates a success response', () => {
    const schema = ApiResponseSchema(z.string())
    expect(() => schema.parse({ success: true, data: 'ok' })).not.toThrow()
  })

  it('validates an error response without data', () => {
    const schema = ApiResponseSchema(z.string())
    expect(() => schema.parse({ success: false, message: 'error', errors: ['field: required'] })).not.toThrow()
  })
})

describe('PaginationSchema', () => {
  it('validates pagination data', () => {
    const result = PaginationSchema.parse({ page: 2, perPage: 20, total: 100, lastPage: 5 })
    expect(result.page).toBe(2)
  })

  it('applies defaults', () => {
    const result = PaginationSchema.parse({ total: 50, lastPage: 4 })
    expect(result.page).toBe(1)
    expect(result.perPage).toBe(15)
  })
})

describe('PaginatedResponseSchema()', () => {
  it('validates paginated response', () => {
    const schema = PaginatedResponseSchema(z.object({ id: z.number() }))
    expect(() =>
      schema.parse({
        data: [{ id: 1 }, { id: 2 }],
        pagination: { page: 1, perPage: 10, total: 2, lastPage: 1 },
      })
    ).not.toThrow()
  })
})

describe('validateSchema()', () => {
  const schema = z.object({ name: z.string() })

  it('returns parsed data on success', () => {
    const result = validateSchema(schema, { name: 'Alice' })
    expect(result.name).toBe('Alice')
  })

  it('throws with error details on failure', () => {
    expect(() => validateSchema(schema, { name: 42 })).toThrow('Validation failed')
  })
})

describe('safeValidateSchema()', () => {
  const schema = z.object({ name: z.string() })

  it('returns success:true with data on success', () => {
    const result = safeValidateSchema(schema, { name: 'Bob' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('Bob')
    }
  })

  it('returns success:false with errors on failure', () => {
    const result = safeValidateSchema(schema, { name: 42 })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.errors).toHaveLength(1)
    }
  })
})
