/**
 * Common type definitions for the helpers package
 */

/**
 * A generic record object with string keys and unknown values
 */
export type GenericRecord = Record<string, unknown>

/**
 * A type that can be an object record or an array
 */
export type DataContainer = GenericRecord | unknown[]
