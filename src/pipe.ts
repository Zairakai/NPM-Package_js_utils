/**
 * Functional pipe helper inspired by Laravel pipelines.
 *
 * @param {T} value The initial value to pipe
 * @returns {Object} An object with through and value methods
 */
export function pipe<T>(value: T) {
  return {
    /**
     * Pass the value through a callback.
     *
     * @param {Function} fn The callback function
     * @returns {ReturnType<typeof pipe>} A new pipe instance with the result
     */
    through<U>(fn: (input: T) => U) {
      const result = fn(value)
      return pipe(result)
    },

    /**
     * Get the current value of the pipe.
     *
     * @returns {T} The current value
     */
    value() {
      return value
    },
  }
}
