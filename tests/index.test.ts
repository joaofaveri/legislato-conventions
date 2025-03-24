import { Command } from 'commander'
import * as fs from 'fs'
import ora from 'ora'
import * as path from 'path'
import { copyConfigFiles } from '../src/config'
import { installDependencies } from '../src/dependencies'
import { main } from '../src/index'
import { modifyPackageJson } from '../src/utils'

jest.mock('commander')
jest.mock('ora')
jest.mock('./dependencies')
jest.mock('./config')
jest.mock('./utils')
jest.mock('fs')
jest.mock('path')

describe('main', () => {
  const mockedCommand = Command as jest.MockedClass<typeof Command>
  const mockedOra = ora as jest.MockedFunction<typeof ora>
  const mockedInstallDependencies = installDependencies as jest.MockedFunction<
    typeof installDependencies
  >
  const mockedCopyConfigFiles = copyConfigFiles as jest.MockedFunction<
    typeof copyConfigFiles
  >
  const mockedModifyPackageJson = modifyPackageJson as jest.MockedFunction<
    typeof modifyPackageJson
  >
  const mockedFs = fs as jest.Mocked<typeof fs>
  const mockedPath = path as jest.Mocked<typeof path>

  beforeEach(() => {
    mockedCommand.prototype.version.mockReturnValue(mockedCommand.prototype)
    mockedCommand.prototype.description.mockReturnValue(mockedCommand.prototype)
    mockedCommand.prototype.action.mockReturnValue(mockedCommand.prototype)
    mockedCommand.prototype.parse.mockReturnValue({})

    mockedOra.mockReturnValue({
      start: jest.fn().mockReturnThis(),
      succeed: jest.fn().mockReturnThis(),
      fail: jest.fn().mockReturnThis()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    mockedInstallDependencies.mockResolvedValue(undefined)
    mockedCopyConfigFiles.mockResolvedValue(undefined)
    mockedModifyPackageJson.mockImplementation(() => {})

    mockedFs.readFileSync.mockReturnValue(JSON.stringify({ version: '1.0.0' }))
    mockedPath.join.mockReturnValue('test-path')

    process.env.npm_config_user_agent = 'npm'
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should execute successfully', async () => {
    await main()

    expect(mockedInstallDependencies).toHaveBeenCalled()
    expect(mockedCopyConfigFiles).toHaveBeenCalled()
    expect(mockedModifyPackageJson).toHaveBeenCalled()
  })

  it('should handle errors during execution', async () => {
    mockedInstallDependencies.mockRejectedValue(new Error('Installation error'))

    await main()

    expect(mockedOra.prototype.fail).toHaveBeenCalledTimes(3)
  })

  it('should handle non-npm environment', async () => {
    process.env.npm_config_user_agent = 'yarn'

    await main()

    expect(mockedOra.prototype.fail).toHaveBeenCalledTimes(3)
  })
})
