import * as fs from 'fs'
import * as path from 'path'

interface PackageJson {
  [key: string]: unknown
}

export function modifyPackageJson(
  callback: (packageJson: PackageJson) => void
): void {
  const packageJsonPath = path.join(process.cwd(), 'package.json')

  if (!fs.existsSync(packageJsonPath)) {
    console.error('package.json file not found.')
    return
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
    const modifiedPackageJson = callback(packageJson)
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(modifiedPackageJson, null, 2)
    )
    console.log('package.json modified successfully!')
  } catch (error) {
    console.error('Error modifying package.json:', error)
  }
}
