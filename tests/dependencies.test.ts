import { exec } from 'child_process'
import { promisify } from 'util'
import { installDependencies } from '../src/dependencies'

jest.mock('child_process')
jest.mock('util')

describe('installDependencies', () => {
  const mockedExec = exec as jest.MockedFunction<typeof exec>
  const mockedPromisify = promisify as jest.MockedFunction<typeof promisify>

  beforeEach(() => {
    mockedExec.mockReset()
    mockedPromisify.mockReset()
  })

  it('should install dependencies successfully', async () => {
    mockedPromisify.mockReturnValue(jest.fn().mockResolvedValue({}))
    await installDependencies()

    expect(mockedExec).toHaveBeenCalled()
  })

  it('should handle errors during installation', async () => {
    mockedPromisify.mockReturnValue(
      jest.fn().mockRejectedValue(new Error('Installation error'))
    )

    await expect(installDependencies()).rejects.toThrow('Installation error')
  })
})
