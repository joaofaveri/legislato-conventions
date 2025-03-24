import path from 'path'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const buildEslintCommand = filenames =>
  `next lint --fix --file ${filenames
    // eslint-disable-next-line no-undef
    .map(f => path.relative(process.cwd(), f))
    .join(' --file ')}`

export default {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand]
}
