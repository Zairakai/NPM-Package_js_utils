# @zairakai/js-utils

[![Main][pipeline-main-badge]][pipeline-main-link]
[![Develop][pipeline-develop-badge]][pipeline-develop-link]
[![Coverage][coverage-badge]][coverage-link]

[![npm][npm-badge]][npm-link]
[![GitLab Release][gitlab-release-badge]][gitlab-release]
[![License][license-badge]][license]

[![Node.js][node-badge]][node]
[![ESLint][eslint-badge]][eslint]
[![Prettier][prettier-badge]][prettier]

Collection of JavaScript utility functions for string manipulation, validation, and formatting. Inspired by Laravel's helpers with modern TypeScript support.

---

## Features

- **Fluent Strings (`str`)** — Chained string manipulation (title, slug, limit, etc.)
- **Fluent Numbers (`num`)** — Formatting (currency, filesize), abbreviating, and calculations
- **Fluent Objects (`obj`)** — Dot notation access, deep merging, and state tracking (dirty/clean)
- **Enhanced Collections** — Laravel-like collection methods for arrays and maps
- **Runtime Validation (`validator`)** — Zod-powered validation with a familiar API
- **PHP-like Arrays** — Direct API parity for PHP's array functions (`array_chunk`, `array_merge`, etc.)
- **Runtime Schemas** — Pre-defined Zod schemas for common data types (Email, Phone, URL, etc.)
- **Deep Equality** — Robust deep comparison and diffing utilities
- **Type Guards** — Reliable type checking (isRecord, isEmail, etc.)
- **DateTime** — Lightweight wrapper around dayjs with useful presets

---

## Install

```bash
npm install @zairakai/js-utils
```

To use `validator` and `schemas` features, install `zod` (optional peer dependency):

```bash
npm install zod
```

---

## Usage Examples

### Fluent Strings

```typescript
import { str } from '@zairakai/js-utils'

const result = str('hello world').title().append(' extra').slug().get() // "hello-world-extra"
```

### Fluent Numbers

```typescript
import { num } from '@zairakai/js-utils'

num(1024).fileSize() // "1 KB"
num(1500).abbreviate() // "1.5K"
num(10).add(5).mul(2).get() // 30
```

### State Tracking (Dirty)

```typescript
import { obj } from '@zairakai/js-utils'

const user = obj({ name: 'John', status: 'active' })
user.dataSet('name', 'Jane')

user.isDirty() // true
user.getDirty() // { name: 'Jane' }
user.syncOriginal() // Mark as clean
```

### Validation

```typescript
import { validator } from '@zairakai/js-utils'
import { z } from 'zod'

const v = validator(data, {
  email: z.string().email(),
  age: z.number().min(18),
})

if (v.fails()) {
  console.log(v.errors())
}
```

---

## API Reference

<details>
<summary><strong>Fluent Strings (str / Stringable)</strong></summary>

| Method                        | Description                                             |
| ----------------------------- | ------------------------------------------------------- |
| `append(...values)`           | Append the given values to the string.                  |
| `camel()`                     | Convert the string to camelCase.                        |
| `capitalize()`                | Capitalize the first character.                         |
| `contains(needles)`           | Determine if the string contains any of the needles.    |
| `containsAll(needles)`        | Determine if the string contains all of the needles.    |
| `endsWith(needles)`           | Determine if the string ends with any of the needles.   |
| `finish(cap)`                 | Cap the string with a single instance of a given value. |
| `get()` / `toString()`        | Get the raw string value.                               |
| `kebab()`                     | Convert the string to kebab-case.                       |
| `limit(size, end)`            | Limit the number of characters in a string.             |
| `lower()`                     | Convert the string to lower case.                       |
| `mask(char, index, length)`   | Mask a portion of the string with a character.          |
| `prepend(...values)`          | Prepend the given values to the string.                 |
| `replace(search, replace)`    | Replace the first occurrence of a value.                |
| `replaceAll(search, replace)` | Replace all occurrences of a value.                     |
| `reverse()`                   | Reverse the string.                                     |
| `slug()`                      | Convert the string to a URL friendly slug.              |
| `snake()`                     | Convert the string to snake_case.                       |
| `start(prefix)`               | Begin a string with a single instance of a given value. |
| `startsWith(needles)`         | Determine if the string starts with any of the needles. |
| `studly()`                    | Convert the string to StudlyCase.                       |
| `title()`                     | Convert the string to Title Case.                       |
| `trim(chars?)`                | Trim the string (optional custom characters).           |
| `upper()`                     | Convert the string to upper case.                       |
| `when(condition, callback)`   | Conditionally execute a callback.                       |

</details>

<details>
<summary><strong>Fluent Numbers (num / Numberable)</strong></summary>

| Method                           | Description                                        |
| -------------------------------- | -------------------------------------------------- |
| `abbreviate(precision)`          | Abbreviate the number (e.g., 1K, 1.5M).            |
| `add(value)` / `sub(value)`      | Arithmetic operations.                             |
| `mul(value)` / `div(value)`      | Arithmetic operations.                             |
| `ceil()` / `floor()` / `round()` | Rounding operations.                               |
| `clamp(min, max)`                | Clamp the number between min and max.              |
| `currency(code, locale)`         | Format as currency (default: USD).                 |
| `fileSize(precision)`            | Format as human-readable file size (KB, MB, etc.). |
| `format(decimals, locale)`       | Format the number with locale-specific separators. |
| `isBetween(min, max)`            | Check if number is between min and max.            |
| `ordinal()`                      | Add an ordinal suffix (1st, 2nd, 3rd...).          |
| `percentage(decimals)`           | Format as a percentage.                            |

</details>

<details>
<summary><strong>Fluent Objects (obj / Objectable)</strong></summary>

| Method                  | Description                                                    |
| ----------------------- | -------------------------------------------------------------- |
| `clone()`               | Deep clone the object.                                         |
| `dataGet(key, default)` | Get a value using dot notation (e.g., `user.profile.id`).      |
| `dataSet(key, value)`   | Set a value using dot notation.                                |
| `except(keys)`          | Get all properties except those specified.                     |
| `filter(callback)`      | Filter object properties.                                      |
| `getDirty()`            | Get the properties that have been modified.                    |
| `isDirty(key?)`         | Determine if the object (or a specific key) has been modified. |
| `map(callback)`         | Map over the object properties.                                |
| `merge(other)`          | Shallow merge with another object.                             |
| `mergeDeep(other)`      | Recursive deep merge.                                          |
| `only(keys)`            | Get only the specified properties.                             |
| `syncOriginal()`        | Sync current state as the "clean" state.                       |

</details>

<details>
<summary><strong>Enhanced Collections (collect / EnhancedArray / EnhancedMap)</strong></summary>

Extends native `Array` and `Map` with 50+ methods including:

- **Navigation**: `at(index)`, `before(item)`, `after(item)`
- **Transformation**: `pluck(key)`, `groupBy(key)`, `unique(key)`, `chunk(size)`, `chunkBy(key)`, `deepFlatten()`, `transpose()`, `filterMap(cb)`, `extract(keys)`, `rotate(n)`, `getNth(n)`
- **Statistical**: `median()`, `mode()`, `standardDeviation()`, `percentile(p)`, `frequencies()`
- **Advanced**: `cartesian(...arrays)`, `interleave(...arrays)`, `sliding(size, step)`, `paginate(perPage, page)`, `weightedRandom(weights?)`, `recursive()`
- **State**: `isDirty()`, `isClean()`, `syncOriginal()`, `isEquivalent(other)`

</details>

<details>
<summary><strong>PHP-like Arrays (php_array)</strong></summary>

Provides direct API parity for PHP's array functions (only those that add value beyond native JS):
`array_chunk`, `array_filter`, `array_map`, `array_reduce`, `array_merge`, `array_unique`, `array_reverse`, `array_slice`, `array_splice`, `array_keys`, `array_search`, `array_key_exists`, `array_pop`, `array_push`, `array_shift`, `array_unshift`, `array_sum`, `array_product`, `array_rand`, `array_flip`, `array_count_values`, `array_intersect`, `array_diff`, `array_column`, `range`, and sorting functions (`sort`, `rsort`, `usort`, `uasort`, `uksort`, `shuffle`).

</details>

<details>
<summary><strong>Runtime Schemas</strong></summary>

Pre-defined Zod schemas and TypeScript types for common primitives:

- `EmailSchema` / `Email`
- `PhoneSchema` / `Phone`
- `UrlSchema` / `Url`
- `DateSchema`
- `ApiResponseSchema<T>` / `ApiResponse<T>`
- `PaginationSchema` / `Pagination`
- `PaginatedResponseSchema<T>` / `PaginatedResponse<T>`

Utility functions: `validateSchema(schema, data)`, `safeValidateSchema(schema, data)`.

> Requires `zod` — install separately (`npm install zod`).

</details>

<details>
<summary><strong>Standard Utilities</strong></summary>

- **Validators**: `isEmail`, `isUrl`, `isUuid`, `isIp`, `isMacAddress`, `isRecord`, `isInteger`, etc.
- **Formatters**: `snakeCase`, `kebabCase`, `camelCase`, `slugify`, `numberFormat`, etc.
- **Runtime**: `tap`, `when(condition, () => R)`, `retry`, `optional`, `data_get`, `data_set`, `throw_if`, `throw_unless`.
- **Deep Equality**: `isEqual(a, b)`, `diff(original, current)`.
- **DateTime**: `now()`, `today()`, `tomorrow()`, `yesterday()`, `isBetweenDates(date, start, end)`, `fromNow(date)`, `isToday(date)`, `isPast(date)`, `isFuture(date)`.

</details>

---

## Development

```bash
npm test              # run vitest
npm run build         # build with tsup
npm run docs          # generate TypeDoc documentation
npm run typecheck     # run tsc
make quality          # run full quality suite
```

---

## Getting Help

[![License][license-badge]][license]
[![Security Policy][security-badge]][security]
[![Issues][issues-badge]][issues]

**Made with ❤️ by [Zairakai][ecosystem]**

<!-- Reference Links -->

[pipeline-main-badge]: https://gitlab.com/zairakai/npm-packages/js-utils/badges/main/pipeline.svg?ignore_skipped=true&key_text=Main
[pipeline-main-link]: https://gitlab.com/zairakai/npm-packages/js-utils/-/commits/main
[pipeline-develop-badge]: https://gitlab.com/zairakai/npm-packages/js-utils/badges/develop/pipeline.svg?ignore_skipped=true&key_text=Develop
[pipeline-develop-link]: https://gitlab.com/zairakai/npm-packages/js-utils/-/commits/develop
[coverage-badge]: https://gitlab.com/zairakai/npm-packages/js-utils/badges/main/coverage.svg
[coverage-link]: https://gitlab.com/zairakai/npm-packages/js-utils/-/pipelines?ref=main
[npm-badge]: https://img.shields.io/npm/v/@zairakai/js-utils
[npm-link]: https://www.npmjs.com/package/@zairakai/js-utils
[gitlab-release-badge]: https://img.shields.io/gitlab/v/release/zairakai/npm-packages/js-utils?logo=gitlab
[gitlab-release]: https://gitlab.com/zairakai/npm-packages/js-utils/-/releases
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg
[license]: ./LICENSE
[security-badge]: https://img.shields.io/badge/security-scanned-green.svg
[security]: ./SECURITY.md
[issues-badge]: https://img.shields.io/gitlab/issues/open-raw/zairakai%2Fnpm-packages%2Fhelpers?logo=gitlab&label=Issues
[issues]: https://gitlab.com/zairakai/npm-packages/js-utils/-/issues
[node-badge]: https://img.shields.io/badge/node.js-%3E%3D22-green.svg?logo=node.js
[node]: https://nodejs.org
[eslint-badge]: https://img.shields.io/badge/code%20style-eslint-4B32C3.svg?logo=eslint
[eslint]: https://eslint.org
[prettier-badge]: https://img.shields.io/badge/formatter-prettier-F7B93E.svg?logo=prettier
[prettier]: https://prettier.io
[ecosystem]: https://gitlab.com/zairakai
