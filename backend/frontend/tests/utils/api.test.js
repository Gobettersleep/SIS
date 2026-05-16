import { describe, it, expect } from 'vitest'
import { get, post, put, del, requestCache, invalidateCache } from '../../src/utils/api.js'

describe('api utils', () => {
  describe('HTTP methods', () => {
    it('should export get function', () => {
      expect(typeof get).toBe('function')
    })

    it('should export post function', () => {
      expect(typeof post).toBe('function')
    })

    it('should export put function', () => {
      expect(typeof put).toBe('function')
    })

    it('should export delete function', () => {
      expect(typeof del).toBe('function')
    })
  })

  describe('requestCache', () => {
    beforeEach(() => {
      requestCache.clear()
    })

    it('should be a Map', () => {
      expect(requestCache instanceof Map).toBe(true)
    })

    it('should allow setting and getting cached values', () => {
      requestCache.set('test-key', { data: 'test-data', timestamp: Date.now() })
      const cached = requestCache.get('test-key')
      expect(cached).toBeDefined()
      expect(cached.data).toBe('test-data')
    })

    it('should invalidate cache with pattern', () => {
      requestCache.set('students-list', { data: [], timestamp: Date.now() })
      requestCache.set('students-detail-1', { data: {}, timestamp: Date.now() })
      requestCache.set('courses-list', { data: [], timestamp: Date.now() })

      expect(requestCache.size).toBe(3)

      // Invalidate students related cache
      invalidateCache('students')

      expect(requestCache.size).toBe(1)
      expect(requestCache.has('courses-list')).toBe(true)
    })

    it('should clear all cache when no pattern provided', () => {
      requestCache.set('key1', { data: 'val1', timestamp: Date.now() })
      requestCache.set('key2', { data: 'val2', timestamp: Date.now() })

      expect(requestCache.size).toBe(2)

      invalidateCache()

      expect(requestCache.size).toBe(0)
    })
  })
})