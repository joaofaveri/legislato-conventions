import chalk from 'chalk'
import * as fs from 'fs'
import inquirer from 'inquirer'
import ora from 'ora'
import * as path from 'path'

export async function copyConfigFiles(): Promise<void> {
  const spinner = ora('Copying configuration files...').start()
  const templatesDir = path.join(__dirname, '../configs')
  const destinationDir = process.cwd()

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
          const answer = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'overwrite',
              message: chalk.yellow(
                `File ${targetFileName} already exists. Overwrite?`
              ),
              default: false
            }
          ])
          if (answer.overwrite) {
            copyRecursiveSync(sourcePath, destinationPath)
            spinner.info(
              chalk.gray(`File ${targetFileName} overwritten successfully!`)
            )
          } else {
            spinner.warn(chalk.yellow(`File ${targetFileName} skipped.`))
          }
        } else {
          copyRecursiveSync(sourcePath, destinationPath)
          spinner.info(
            chalk.gray(`File ${targetFileName} copied successfully!`)
          )
        }
      } else {
        spinner.warn(chalk.yellow(`File ${file} not found in template.`))
      }
    } catch (error) {
      spinner.fail(chalk.red(`Error copying file ${targetFileName}:`))
      console.error(error)
      throw error
    }
  }
  spinner.succeed(chalk.green('Configuration files copied successfully!'))
}
