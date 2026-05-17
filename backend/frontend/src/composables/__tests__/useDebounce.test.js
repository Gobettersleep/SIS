import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useDebounce, useThrottle } from '../useDebounce'

describe('useDebounce', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('should delay function execution', () => {
    const fn = vi.fn()
    const { debounced } = useDebounce(fn, 300)
    
    debounced()
    expect(fn).not.toHaveBeenCalled()
    
    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should cancel pending execution', () => {
    const fn = vi.fn()
    const { debounced, cancel } = useDebounce(fn, 300)
    
    debounced()
    cancel()
    vi.advanceTimersByTime(300)
    expect(fn).not.toHaveBeenCalled()
  })

  it('should reset timer on repeated calls', () => {
    const fn = vi.fn()
    const { debounced } = useDebounce(fn, 300)
    
    debounced()
    debounced()
    debounced()
    
    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})

describe('useThrottle', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('should limit function calls', () => {
    const fn = vi.fn()
    const { throttled } = useThrottle(fn, 300)
    
    throttled()
    throttled()
    throttled()
    
    vi.advanceTimersByTime(300)
    throttled()
    
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should cancel pending execution', () => {
    const fn = vi.fn()
    const { throttled, cancel } = useThrottle(fn, 300)
    
    throttled()
    throttled()
    cancel()
    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})