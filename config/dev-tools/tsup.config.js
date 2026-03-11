import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    validators: 'src/validators.ts',
    formatters: 'src/formatters.ts',
    datetime: 'src/datetime.ts',
    arrays: 'src/arrays.ts',
    collections: 'src/collections.ts',
    'php-arrays': 'src/php-arrays.ts',
    schemas: 'src/schemas.ts',
    str: 'src/str.ts',
    validator: 'src/validator.ts',
    runtime: 'src/runtime.ts',
    number: 'src/number.ts',
    obj: 'src/obj.ts',
    equals: 'src/equals.ts',
    types: 'src/types.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['dayjs', 'zod'],
})
