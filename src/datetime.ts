/**
 * Date and time utilities using Day.js
 */

import dayjsModule, { ConfigType, Dayjs } from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'

// Configure dayjs with commonly used plugins
dayjsModule.extend(isBetween)
dayjsModule.extend(isSameOrAfter)
dayjsModule.extend(isSameOrBefore)
dayjsModule.extend(relativeTime)
dayjsModule.extend(utc)

/**
 * Configured Dayjs instance.
 */
export const dayjs = dayjsModule

// Utility functions
/**
 * Get the current date and time as a Dayjs instance.
 *
 * @returns {Dayjs} Current date and time
 */
export const now = (): Dayjs => dayjs()

/**
 * Get today's date at the start of the day.
 *
 * @returns {Dayjs} Today's date
 */
export const today = (): Dayjs => dayjs().startOf('day')

/**
 * Get tomorrow's date at the start of the day.
 *
 * @returns {Dayjs} Tomorrow's date
 */
export const tomorrow = (): Dayjs => dayjs().add(1, 'day').startOf('day')

/**
 * Get yesterday's date at the start of the day.
 *
 * @returns {Dayjs} Yesterday's date
 */
export const yesterday = (): Dayjs => dayjs().subtract(1, 'day').startOf('day')

/**
 * Check if a date is between two other dates.
 *
 * @param {ConfigType} date Date to check
 * @param {ConfigType} start Start date
 * @param {ConfigType} end End date
 * @param {dayjsModule.OpUnitType} [unit='day'] Unit of comparison (day, month, year, etc.)
 * @param {'()' | '[]' | '[)' | '(]'} [inclusivity='[]'] Inclusivity
 * @returns {boolean} True if the date is between start and end
 */
export const isBetweenDates = (
  date: ConfigType,
  start: ConfigType,
  end: ConfigType,
  unit: dayjsModule.OpUnitType = 'day',
  inclusivity: '()' | '[]' | '[)' | '(]' = '[]'
): boolean => {
  return dayjs(date).isBetween(dayjs(start), dayjs(end), unit, inclusivity)
}

/**
 * Format a date to a human-readable relative time.
 *
 * @param {ConfigType} date Date to format
 * @returns {string} Relative time (e.g., "2 hours ago")
 */
export const fromNow = (date: ConfigType): string => dayjs(date).fromNow()

/**
 * Check if a date is today.
 *
 * @param {ConfigType} date Date to check
 * @returns {boolean} True if the date is today
 */
export const isToday = (date: ConfigType): boolean => dayjs(date).isSame(dayjs(), 'day')

/**
 * Check if a date is in the past.
 *
 * @param {ConfigType} date Date to check
 * @returns {boolean} True if the date is in the past
 */
export const isPast = (date: ConfigType): boolean => dayjs(date).isBefore(dayjs())

/**
 * Check if a date is in the future.
 *
 * @param {ConfigType} date Date to check
 * @returns {boolean} True if the date is in the future
 */
export const isFuture = (date: ConfigType): boolean => dayjs(date).isAfter(dayjs())
