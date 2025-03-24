import chalk from 'chalk'
import { exec } from 'child_process'
import ora from 'ora'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function installDependencies(): Promise<void> {
  const spinner = ora('Installing dependencies...').start()
  const dependencies = [
    '@commitlint/cli@^19.0.0',
    '@commitlint/config-conventional@^19.0.0',
    '@release-it/conventional-changelog@^10.0.0',
    'commitizen@^4.0.0',
    'conventional-changelog-conventionalcommits@^8.0.0',
    'dotenv-cli@^8.0.0',
    'git-cz@^4.0.0',
    'husky@^9.0.0',
    'inquirer@^9.0.0',
    'lint-staged@^15.0.0',
    'release-it@^18.0.0',
    'typescript@^5.0.0'
  ]

  try {
    const { stdout, stderr } = await execAsync(
      `npm install --save-dev ${dependencies.join(' ')}`
    )
    if (stdout) {
      console.log(chalk.gray(stdout))
    }
    if (stderr) {
      console.error(chalk.gray(stderr))
    }
    spinner.succeed(chalk.green('Dependencies installed successfully!'))
  } catch (error) {
    spinner.fail(chalk.red('Error installing dependencies:'))
    if (error instanceof Error) {
      const errorWithStd = error as Error & { stderr?: string; stdout?: string }
      if (errorWithStd.stderr) {
        console.error(errorWithStd.stderr)
      } else if (errorWithStd.stdout) {
        console.error(errorWithStd.stdout)
      } else {
        console.error(error.message)
      }
    } else {
      console.error(error)
    }
    throw error
  }
}
