import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useLazyLoad, vLazy } from '../useLazyLoad'

describe('useLazyLoad', () => {
  let mockElement

  beforeEach(() => {
    mockElement = document.createElement('div')
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('should initialize with isVisible false', () => {
    const { isVisible } = useLazyLoad()
    expect(isVisible.value).toBe(false)
  })

  it('should observe element and update isVisible when intersecting', () => {
    const { isVisible, observe, unobserve } = useLazyLoad()
    
    const mockCallback = vi.fn()
    vi.stubGlobal('IntersectionObserver', vi.fn((callback) => ({
      observe: vi.fn(() => {
        callback([{ isIntersecting: true, target: mockElement }])
      }),
      unobserve: vi.fn(),
      disconnect: vi.fn()
    })))

    observe(mockElement)
    
    expect(isVisible.value).toBe(true)
    
    unobserve()
  })

  it('should not observe if element is null', () => {
    const { isVisible, observe } = useLazyLoad()
    
    const mockCallback = vi.fn()
    const mockObserver = vi.fn(() => ({
      observe: mockCallback,
      unobserve: vi.fn(),
      disconnect: vi.fn()
    }))
    vi.stubGlobal('IntersectionObserver', mockObserver)

    observe(null)
    
    expect(mockCallback).not.toHaveBeenCalled()
    expect(isVisible.value).toBe(false)
  })

  it('should not observe if already observing', () => {
    const { observe, unobserve } = useLazyLoad()
    
    const mockObserverInstance = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn()
    }
    const mockObserver = vi.fn(() => mockObserverInstance)
    vi.stubGlobal('IntersectionObserver', mockObserver)

    observe(mockElement)
    observe(mockElement)
    
    expect(mockObserverInstance.observe).toHaveBeenCalledTimes(1)
    
    unobserve()
  })

  it('should unobserve correctly', () => {
    const { observe, unobserve } = useLazyLoad()
    
    const mockDisconnect = vi.fn()
    vi.stubGlobal('IntersectionObserver', vi.fn(() => ({
      observe: vi.fn(() => {}),
      unobserve: vi.fn(),
      disconnect: mockDisconnect
    })))

    observe(mockElement)
    unobserve()
    
    expect(mockDisconnect).toHaveBeenCalled()
  })
})

describe('vLazy directive', () => {
  it('should be defined', () => {
    expect(vLazy).toBeDefined()
    expect(vLazy.mounted).toBeDefined()
    expect(vLazy.unmounted).toBeDefined()
  })

  it('should observe element on mount', () => {
    const mockElement = document.createElement('div')
    const mockCallback = vi.fn()
    
    vi.stubGlobal('IntersectionObserver', vi.fn((callback) => {
      mockCallback.callback = callback
      return {
        observe: vi.fn(() => {
          callback([{ isIntersecting: true, target: mockElement }])
        }),
        unobserve: vi.fn(),
        disconnect: vi.fn()
      }
    }))

    vLazy.mounted(mockElement, { value: vi.fn() })
    
    expect(IntersectionObserver).toHaveBeenCalled()
  })

  it('should disconnect on unmount', () => {
    const mockElement = document.createElement('div')
    const mockDisconnect = vi.fn()
    
    vi.stubGlobal('IntersectionObserver', vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: mockDisconnect
    })))

    vLazy.mounted(mockElement, { value: vi.fn() })
    vLazy.unmounted(mockElement)
    
    expect(mockDisconnect).toHaveBeenCalled()
  })
})