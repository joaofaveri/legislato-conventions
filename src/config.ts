import chalk from 'chalk'
import * as fs from 'fs'
import inquirer from 'inquirer'
import ora from 'ora'
import * as path from 'path'

export async function copyConfigFiles(): Promise<void> {
  const spinner = ora('Copying configuration files...').start()
  const templatesDir = path.join(__dirname, '../configs')
  const destinationDir = process.cwd()

  const copyRecursiveSync = async (
    src: string,
    dest: string
  ): Promise<void> => {
    const exists = fs.existsSync(src)
    if (exists) {
      const stats = fs.statSync(src)
      const isDirectory = stats.isDirectory()
      if (isDirectory) {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest)
        }
        const children = fs.readdirSync(src)
        for (const childItemName of children) {
          await copyRecursiveSync(
            path.join(src, childItemName),
            path.join(dest, childItemName)
          )
        }
      } else {
        try {
          if (fs.existsSync(dest)) {
            const answer = await inquirer.prompt([
              {
                type: 'confirm',
                name: 'overwrite',
                message: chalk.yellow(
                  `File ${dest} already exists. Overwrite?`
                ),
                default: false
              }
            ])
            if (answer.overwrite) {
              fs.copyFileSync(src, dest)
              spinner.info(chalk.gray(`File ${dest} overwritten successfully!`))
            } else {
              spinner.warn(chalk.yellow(`File ${dest} skipped.`))
            }
          } else {
            fs.copyFileSync(src, dest)
            spinner.info(chalk.gray(`File ${dest} copied successfully!`))
          }
        } catch (error) {
          spinner.fail(chalk.red(`Error copying file ${dest}:`))
          console.error(error)
          throw error
        }
      }
    }
  }

  const filesToCopy = fs.readdirSync(templatesDir)
  const renameMap: Record<string, string> = {
    '.commitlintrc.template.json': '.commitlintrc.json',
    '.lintstagedrc.template.json': '.lintstagedrc.json',
    '.lintstagedrc.template.cjs': '.lintstagedrc.cjs',
    '.release-it.template.ts': '.release-it.ts',
    'changelog.config.template.cjs': 'changelog.config.cjs',
    'getAllContributors.template.cjs': 'getAllContributors.cjs'
  }

  try {
    // Project is Next.js?
    const isNextJsProject =
      fs.existsSync(path.join(destinationDir, 'next.config.js'))
      || fs.existsSync(path.join(destinationDir, 'next.config.ts'))

    for (const file of filesToCopy) {
      const sourcePath = path.join(templatesDir, file)
      const targetFileName = renameMap[file] || file
      const destinationPath = path.join(destinationDir, targetFileName)

      await copyRecursiveSync(sourcePath, destinationPath)
    }
    if (isNextJsProject) {
      const templateJsonPath = path.join(destinationDir, '.lintstagedrc.json')
      if (fs.existsSync(templateJsonPath)) {
        fs.unlinkSync(templateJsonPath)
      }
    } else {
      const templateCjsPath = path.join(destinationDir, '.lintstagedrc.cjs')
      if (fs.existsSync(templateCjsPath)) {
        fs.unlinkSync(templateCjsPath)
      }
    }
    spinner.succeed(chalk.green('Configuration files copied successfully!'))
  } catch (error) {
    spinner.fail(chalk.red('Error copying configuration files:'))
    console.error(error)
    throw error
  }
}
