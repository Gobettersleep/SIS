import { describe, it, expect, beforeEach } from 'vitest'
import { useToast, globalToasts } from '../../src/composables/useToast.js'

describe('useToast', () => {
  beforeEach(() => {
    globalToasts.value = []
  })

  it('should add toast with default type', () => {
    const { add } = useToast()
    add('Test message')
    
    expect(globalToasts.value.length).toBe(1)
    expect(globalToasts.value[0].message).toBe('Test message')
    expect(globalToasts.value[0].type).toBe('info')
  })

  it('should add toast with success type', () => {
    const { success } = useToast()
    success('Success message')
    
    expect(globalToasts.value.length).toBe(1)
    expect(globalToasts.value[0].type).toBe('success')
  })

  it('should add toast with error type', () => {
    const { error } = useToast()
    error('Error message')
    
    expect(globalToasts.value.length).toBe(1)
    expect(globalToasts.value[0].type).toBe('error')
  })

  it('should remove toast by id', () => {
    const { add, remove } = useToast()
    const id = add('Test message')
    
    expect(globalToasts.value.length).toBe(1)
    remove(id)
    expect(globalToasts.value.length).toBe(0)
  })

  it('should auto remove toast after duration', async () => {
    const { add } = useToast()
    add('Auto remove', 'info', 100)
    
    expect(globalToasts.value.length).toBe(1)
    
    await new Promise(resolve => setTimeout(resolve, 150))
    
    expect(globalToasts.value.length).toBe(0)
  })
})