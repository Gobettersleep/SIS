import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAsyncState } from '../useAsyncState'

describe('useAsyncState', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with idle state', () => {
    const { state, isLoading, isSuccess, isError } = useAsyncState(() => {})
    expect(state.value).toBe('idle')
    expect(isLoading.value).toBe(false)
    expect(isSuccess.value).toBe(false)
    expect(isError.value).toBe(false)
  })

  it('should handle successful async execution', async () => {
    const mockFn = vi.fn().mockResolvedValue('success data')
    const { state, data, isLoading, isSuccess, execute } = useAsyncState(mockFn)

    const promise = execute()
    
    expect(state.value).toBe('pending')
    expect(isLoading.value).toBe(true)
    
    await promise
    
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(state.value).toBe('success')
    expect(data.value).toBe('success data')
    expect(isSuccess.value).toBe(true)
    expect(isLoading.value).toBe(false)
  })

  it('should handle async error', async () => {
    const error = new Error('test error')
    const mockFn = vi.fn().mockRejectedValue(error)
    const { state, error: err, isError, execute } = useAsyncState(mockFn)

    await expect(execute()).rejects.toThrow(error)
    
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(state.value).toBe('error')
    expect(err.value).toBe(error)
    expect(isError.value).toBe(true)
  })

  it('should reset to initial state', () => {
    const mockFn = vi.fn().mockResolvedValue('data')
    const { state, data, error, reset } = useAsyncState(mockFn, { initialData: 'initial' })

    reset()
    expect(state.value).toBe('idle')
    expect(data.value).toBe('initial')
    expect(error.value).toBe(null)
  })

  it('should pass arguments to async function', async () => {
    const mockFn = vi.fn().mockResolvedValue('result')
    const { execute } = useAsyncState(mockFn)

    await execute('arg1', 'arg2')
    
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
  })

  it('should return the result from execute', async () => {
    const mockFn = vi.fn().mockResolvedValue('returned value')
    const { execute } = useAsyncState(mockFn)

    const result = await execute()
    
    expect(result).toBe('returned value')
  })
})