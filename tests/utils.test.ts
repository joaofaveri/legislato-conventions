import * as fs from 'fs'
import * as path from 'path'
import { modifyPackageJson } from '../src/utils'

describe('modifyPackageJson', () => {
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  const originalPackageJson = fs.readFileSync(packageJsonPath, 'utf-8')

  afterEach(() => {
    fs.writeFileSync(packageJsonPath, originalPackageJson)
  })

  it('should modify package.json successfully', () => {
    modifyPackageJson(packageJson => {
      packageJson.test = 'test'
      return packageJson
    })

    const modifiedPackageJson = JSON.parse(
      fs.readFileSync(packageJsonPath, 'utf-8')
    )
    expect(modifiedPackageJson.test).toBe('test')
  })

  it('should handle package.json file not found', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false)

    modifyPackageJson(() => {})

    expect(consoleSpy).toHaveBeenCalledWith('package.json file not found.')

    existsSyncSpy.mockRestore()
    consoleSpy.mockRestore()
  })

  it('should handle error modifying package.json', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const readFileSyncSpy = jest
      .spyOn(fs, 'readFileSync')
      .mockImplementation(() => {
        throw new Error('Read error')
      })

    modifyPackageJson(() => {})

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error modifying package.json:',
      new Error('Read error')
    )

    readFileSyncSpy.mockRestore()
    consoleSpy.mockRestore()
  })
})
