// @ts-check
import tseslint from 'typescript-eslint'
import js from '@eslint/js'

export default tseslint.config(
  {
    ignores: ['node_modules', 'dist'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended
)
