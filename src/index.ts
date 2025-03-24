#!/usr/bin/env node

import chalk from 'chalk'
import { Command } from 'commander'
import * as fs from 'fs'
import ora from 'ora'
import * as path from 'path'
import { copyConfigFiles } from './config'
import { installDependencies } from './dependencies'
import { modifyPackageJson } from './utils'

const program = new Command()

const packageJsonPath = path.join(__dirname, '../package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

program
  .version(packageJson.version)
  .description('Automatically configures conventional commits and changelogs.')

export async function main(): Promise<void> {
  const spinner = ora('Setting up conventions...').start()

  try {
    // Verify if npm is being used
    const userAgent = process.env.npm_config_user_agent
    if (!userAgent || !userAgent.startsWith('npm')) {
      spinner.fail(
        'This package only supports npm. Please use npm to install dependencies.'
      )
      process.exit(1)
    }

    await installDependencies()
    await copyConfigFiles()

    modifyPackageJson(packageJson => {
      packageJson.scripts = {
        ...(packageJson.scripts ?? {}),
        'prepare': 'husky',
        'release':
          'npm run test && npm run build && dotenv release-it -- --verbose',
        'release:no-test': 'npm run build && dotenv release-it -- --verbose',
        'release:no-npm':
          'npm run test && dotenv release-it -- --no-npm.publish',
        'release:changelog':
          'npm run test && npm run build && dotenv release-it -- --changelog',
        'release:version':
          'npm run test && npm run build && dotenv release-it -- --release-version'
      }
      packageJson.config = {
        commitizen: {
          path: './node_modules/git-cz'
        }
      }
      return packageJson
    })

    spinner.succeed('Configuration completed successfully!')

    console.log(chalk.bold('\nNext steps:'))
    console.log(chalk.yellow('1. Create a .env file in your project root.'))
    console.log(chalk.yellow('2. Add the following line to the .env file:'))
    console.log(chalk.cyan('   GITHUB_TOKEN=your_github_personal_access_token'))
    console.log(
      chalk.gray(
        '   (Replace your_github_personal_access_token with your actual token)'
      )
    )
    console.log(
      chalk.yellow(
        '3. This will allow release-it to automate releases on GitHub.'
      )
    )
  } catch (error) {
    spinner.fail('Configuration failed')
    console.error(error)
    process.exit(1)
  }
}

program.action(main)
program.parse(process.argv)
