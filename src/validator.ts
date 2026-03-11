import { z } from 'zod'
import { diff, isEqual } from './equals.js'
import { GenericRecord } from './types.js'

/**
 * Validator class inspired by Laravel's Validator facade
 * Uses Zod under the hood for robust runtime validation
 */
export class Validator {
  /**
   * Create a new validation instance
   *
   * @param {unknown} data The data to validate
   * @param {T | z.ZodObject<T>} rules The validation rules (Zod shape or object)
   * @returns {ValidationInstance<z.ZodObject<T>>} A new ValidationInstance
   */
  static make<T extends z.ZodRawShape>(data: unknown, rules: T | z.ZodObject<T>) {
    const schema = rules instanceof z.ZodObject ? rules : z.object(rules)
    return new ValidationInstance(data, schema)
  }

  /**
   * Validate data against rules and throw if it fails
   *
   * @param {unknown} data The data to validate
   * @param {T | z.ZodObject<T>} rules The validation rules (Zod shape or object)
   * @returns {z.infer<z.ZodObject<T>>} The validated data
   * @throws {z.ZodError} If validation fails
   */
  static validate<T extends z.ZodRawShape>(data: unknown, rules: T | z.ZodObject<T>) {
    const schema = rules instanceof z.ZodObject ? rules : z.object(rules)
    return schema.parse(data)
  }

  /**
   * Compare two objects for equality
   *
   * @param {unknown} a First object
   * @param {unknown} b Second object
   * @returns {boolean} True if the objects are equal
   */
  static isEqual(a: unknown, b: unknown): boolean {
    return isEqual(a, b)
  }

  /**
   * Get the differences between two objects
   *
   * @param {unknown} a First object
   * @param {unknown} b Second object
   * @returns {GenericRecord} An object containing the differences
   */
  static diff(a: unknown, b: unknown): GenericRecord {
    return diff(a, b)
  }
}

/**
 * Individual validation instance
 */
export class ValidationInstance<T extends z.ZodTypeAny> {
  private result: ReturnType<T['safeParse']>

  constructor(
    private data: unknown,
    private schema: T
  ) {
    this.result = this.schema.safeParse(this.data) as ReturnType<T['safeParse']>
  }

  /**
   * Check if validation failed
   *
   * @returns {boolean} True if validation failed
   */
  fails(): boolean {
    return !this.result.success
  }

  /**
   * Check if validation passed
   *
   * @returns {boolean} True if validation passed
   */
  passes(): boolean {
    return this.result.success
  }

  /**
   * Get validation errors
   *
   * @returns {Record<string, string[]>} An object with field names as keys and arrays of error messages as values
   */
  errors(): Record<string, string[]> {
    if (this.result.success) {
      return {}
    }

    const errors: Record<string, string[]> = {}
    this.result.error.issues.forEach((err: z.ZodIssue) => {
      const path = err.path.join('.') || 'root'
      if (!errors[path]) {
        errors[path] = []
      }
      errors[path].push(err.message)
    })

    return errors
  }

  /**
   * Get the first error message for a given field
   *
   * @param {string} field The field name
   * @returns {string | undefined} The first error message or undefined
   */
  firstError(field: string): string | undefined {
    const fieldErrors = this.errors()[field]
    return fieldErrors ? fieldErrors[0] : undefined
  }

  /**
   * Get the validated data
   *
   * @returns {z.infer<T>} The validated data
   * @throws {Error} If validation failed
   */
  validated(): z.infer<T> {
    if (!this.result.success) {
      throw new Error('Validation failed')
    }
    return this.result.data as z.infer<T>
  }

  /**
   * Get all error messages as a flat array
   *
   * @returns {string[]} An array of all error messages
   */
  allErrors(): string[] {
    if (this.result.success) {
      return []
    }
    return this.result.error.issues.map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`)
  }
}

/**
 * Helper function to create a validator
 *
 * @param {unknown} data The data to validate
 * @param {T | z.ZodObject<T>} rules The validation rules
 * @returns {ValidationInstance<z.ZodObject<T>>} A new ValidationInstance
 */
export const validator = <T extends z.ZodRawShape>(data: unknown, rules: T | z.ZodObject<T>) => {
  return Validator.make(data, rules)
}
