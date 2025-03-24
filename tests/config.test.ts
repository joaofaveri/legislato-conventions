import * as fs from 'fs'
import * as path from 'path'
import { copyConfigFiles } from '../src/config'

jest.mock('fs')
jest.mock('path')

describe('copyConfigFiles', () => {
  const mockedFs = fs as jest.Mocked<typeof fs>
  const mockedPath = path as jest.Mocked<typeof path>

  beforeEach(() => {
    mockedFs.existsSync.mockReset()
    mockedFs.mkdirSync.mockReset()
    mockedFs.copyFileSync.mockReset()
    mockedPath.join.mockReset()
    mockedFs.readdirSync.mockReset()
    mockedFs.statSync.mockReset()
  })

  it('should copy config files successfully', async () => {
    mockedPath.join.mockReturnValue('test-path')
    mockedFs.existsSync.mockReturnValue(true)
    mockedFs.statSync.mockReturnValue({ isDirectory: () => false } as fs.Stats)
    mockedFs.readdirSync.mockReturnValue([])

    await copyConfigFiles()

    expect(mockedFs.copyFileSync).toHaveBeenCalled()
  })

  it('should handle existing config files', async () => {
    mockedPath.join.mockReturnValue('test-path')
    mockedFs.existsSync.mockReturnValue(true)
    mockedFs.statSync.mockReturnValue({ isDirectory: () => false } as fs.Stats)
    mockedFs.readdirSync.mockReturnValue([])

    await copyConfigFiles()

    expect(mockedFs.copyFileSync).toHaveBeenCalled()
  })

  it('should handle non-existent config files', async () => {
    mockedPath.join.mockReturnValue('test-path')
    mockedFs.existsSync.mockReturnValue(false)
    mockedFs.readdirSync.mockReturnValue([])

    await copyConfigFiles()

    expect(mockedFs.copyFileSync).not.toHaveBeenCalled()
  })

  it('should handle errors during copy', async () => {
    mockedPath.join.mockReturnValue('test-path')
    mockedFs.existsSync.mockReturnValue(true)
    mockedFs.statSync.mockReturnValue({ isDirectory: () => false } as fs.Stats)
    mockedFs.copyFileSync.mockImplementation(() => {
      throw new Error('Copy error')
    })
    mockedFs.readdirSync.mockReturnValue([])

    await expect(copyConfigFiles()).rejects.toThrow('Copy error')
  })

  it('should copy directories recursively', async () => {
    mockedPath.join.mockImplementation((...paths) => paths.join('/'))
    mockedFs.existsSync.mockReturnValue(true)
    mockedFs.statSync.mockReturnValue({ isDirectory: () => true } as fs.Stats)
    mockedFs.readdirSync.mockReturnValue([
      { name: 'file1' },
      { name: 'file2' }
    ] as fs.Dirent[])

    await copyConfigFiles()

    expect(mockedFs.copyFileSync).toHaveBeenCalledTimes(2)
  })
})
