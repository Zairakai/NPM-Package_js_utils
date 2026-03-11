/**
 * Runtime type validation schemas using Zod
 * Provides runtime type checking that persists after TypeScript compilation
 */

import { z } from 'zod'

/**
 * Email validation schema
 */
export const EmailSchema = z.string().email('Invalid email format').min(1, 'Email is required')

/**
 * Phone validation schema (E.164 format)
 */
export const PhoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')

/**
 * URL validation schema
 */
export const UrlSchema = z.string().url('Invalid URL format')

/**
 * Date validation schema (ISO datetime, YYYY-MM-DD, or Date object)
 */
export const DateSchema = z.union([
  z.string().datetime(),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  z.date(),
])

/**
 * API Response schema factory
 *
 * @param {T} dataSchema The schema for the data property
 * @returns {z.ZodObject} The API response schema
 */
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    message: z.string().optional(),
    errors: z.array(z.string()).optional(),
  })

/**
 * Pagination schema
 */
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  perPage: z.number().int().min(1).max(100).default(15),
  total: z.number().int().nonnegative(),
  lastPage: z.number().int().positive(),
})

/**
 * Paginated response schema factory
 *
 * @param {T} itemSchema The schema for individual items in the data array
 * @returns {z.ZodObject} The paginated response schema
 */
export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    pagination: PaginationSchema,
  })

/**
 * Type inferred from EmailSchema
 */
export type Email = z.infer<typeof EmailSchema>

/**
 * Type inferred from PhoneSchema
 */
export type Phone = z.infer<typeof PhoneSchema>

/**
 * Type inferred from UrlSchema
 */
export type Url = z.infer<typeof UrlSchema>

/**
 * Type inferred from ApiResponseSchema
 */
export type ApiResponse<T> = z.infer<ReturnType<typeof ApiResponseSchema<z.ZodType<T>>>>

/**
 * Type inferred from PaginationSchema
 */
export type Pagination = z.infer<typeof PaginationSchema>

/**
 * Type inferred from PaginatedResponseSchema
 */
export type PaginatedResponse<T> = z.infer<ReturnType<typeof PaginatedResponseSchema<z.ZodType<T>>>>

/**
 * Validates data against a schema and throws detailed errors
 *
 * @param {z.ZodSchema<T>} schema The schema to validate against
 * @param {unknown} data The data to validate
 * @returns {T} The validated data
 * @throws {Error} If validation fails
 */
export const validateSchema = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data)

  if (!result.success) {
    const errors = result.error.issues.map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`)
    throw new Error(`Validation failed: ${errors.join(', ')}`)
  }

  return result.data
}

/**
 * Validates data against a schema and returns result with success flag
 *
 * @param {z.ZodSchema<T>} schema The schema to validate against
 * @param {unknown} data The data to validate
 * @returns {{ success: true; data: T } | { success: false; errors: string[] }} The validation result
 */
export const safeValidateSchema = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } => {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  const errors = result.error.issues.map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`)
  return { success: false, errors }
}
