import * as fs from 'fs'
import ora from 'ora'
import * as path from 'path'

interface PackageJson {
  [key: string]: unknown
}

export function modifyPackageJson(
  callback: (packageJson: PackageJson) => void
): void {
  const spinner = ora('Modifying package.json...').start()
  const packageJsonPath = path.join(process.cwd(), 'package.json')

  if (!fs.existsSync(packageJsonPath)) {
    spinner.fail('package.json file not found.')
    return
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
    const modifiedPackageJson = callback(packageJson)
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(modifiedPackageJson, null, 2)
    )
    spinner.succeed('package.json modified successfully!')
  } catch (error) {
    spinner.fail('Error modifying package.json:')
    console.error(error)
    throw error
  }
}
