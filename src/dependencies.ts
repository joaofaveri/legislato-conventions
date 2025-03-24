import chalk from 'chalk'
import { exec } from 'child_process'
import ora from 'ora'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function installDependencies(): Promise<void> {
  const spinner = ora('Installing dependencies...').start()
  const dependencies = [
    '@commitlint/cli@^19.7.1',
    '@commitlint/config-conventional@^19.7.1',
    '@release-it/conventional-changelog@^10.0.0',
    'commitizen@^4.3.1',
    'conventional-changelog-conventionalcommits@^8.0.0',
    'dotenv-cli@^8.0.0',
    'git-cz@^4.9.0',
    'husky@^9.1.7',
    'inquirer@^9.3.7',
    'lint-staged@^15.4.3',
    'release-it@^18.1.2',
    'typescript@^5.7.3'
  ]

  const dependenciesString = dependencies.join(' ')

  try {
    await execAsync(`npm install --save-dev ${dependenciesString}`)
    spinner.succeed(chalk.green('Dependencies installed successfully!'))
  } catch (error) {
    spinner.fail(chalk.red('Error installing dependencies:'))
    console.error(error)
    throw error
  }
}
