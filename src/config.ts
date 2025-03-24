import * as fs from 'fs'
import ora from 'ora'
import * as path from 'path'

export async function copyConfigFiles(): Promise<void> {
  const spinner = ora('Copying configuration files...').start()
  const templatesDir = path.join(__dirname, '../configs')
  const destinationDir = process.cwd()

  console.log('Copying configuration files...')

  const copyRecursiveSync = (src: string, dest: string): void => {
    const exists = fs.existsSync(src)
    if (exists) {
      const stats = fs.statSync(src)
      const isDirectory = stats.isDirectory()
      if (isDirectory) {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest)
        }
        fs.readdirSync(src).forEach(childItemName => {
          copyRecursiveSync(
            path.join(src, childItemName),
            path.join(dest, childItemName)
          )
        })
      } else {
        fs.copyFileSync(src, dest)
      }
    }
  }

  const filesToCopy = fs.readdirSync(templatesDir)
  const renameMap: Record<string, string> = {
    '.commitlintrc.template.json': '.commitlintrc.json',
    '.lintstagedrc.template.json': '.lintstagedrc.json',
    '.release-it.template.ts': '.release-it.ts',
    'changelog.config.template.cjs': 'changelog.config.cjs',
    'getAllContributors.template.cjs': 'getAllContributors.cjs'
  }

  for (const file of filesToCopy) {
    const sourcePath = path.join(templatesDir, file)
    const targetFileName = renameMap[file] || file // Use renameMap or original file name
    const destinationPath = path.join(destinationDir, targetFileName)

    try {
      if (fs.existsSync(sourcePath)) {
        if (fs.existsSync(destinationPath)) {
          spinner.warn(`File ${targetFileName} already exists. Skipping.`)
        } else {
          copyRecursiveSync(sourcePath, destinationPath)
          spinner.info(`File ${targetFileName} copied successfully!`)
        }
      } else {
        spinner.warn(`File ${file} not found in template.`)
      }
    } catch (error) {
      spinner.fail(`Error copying file ${targetFileName}:`)
      console.error(error)
      throw error
    }
  }
  spinner.succeed('Configuration files copied successfully!')
}
