import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useConfirm } from '../useConfirm'

describe('useConfirm', () => {
  beforeEach(() => {
    const { cancel } = useConfirm()
    cancel()
  })

  it('should initialize with default values', () => {
    const { isVisible, title, message, confirmText, cancelText } = useConfirm()
    expect(isVisible.value).toBe(false)
    expect(title.value).toBe('确认操作')
    expect(message.value).toBe('您确定要执行此操作吗？')
    expect(confirmText.value).toBe('确认')
    expect(cancelText.value).toBe('取消')
  })

  it('should show confirm dialog with custom options', () => {
    const { isVisible, title, message, confirmText, cancelText, show } = useConfirm()
    
    show({
      title: '删除确认',
      message: '确定要删除这条记录吗？',
      confirmText: '删除',
      cancelText: '返回'
    })
    
    expect(isVisible.value).toBe(true)
    expect(title.value).toBe('删除确认')
    expect(message.value).toBe('确定要删除这条记录吗？')
    expect(confirmText.value).toBe('删除')
    expect(cancelText.value).toBe('返回')
  })

  it('should resolve promise with true on confirm', async () => {
    const { isVisible, show, confirm } = useConfirm()
    
    const promise = show()
    confirm()
    
    const result = await promise
    expect(result).toBe(true)
    expect(isVisible.value).toBe(false)
  })

  it('should resolve promise with false on cancel', async () => {
    const { isVisible, show, cancel } = useConfirm()
    
    const promise = show()
    cancel()
    
    const result = await promise
    expect(result).toBe(false)
    expect(isVisible.value).toBe(false)
  })

  it('should use default values when options are not provided', () => {
    const { title, message, confirmText, cancelText, show } = useConfirm()
    
    show({})
    
    expect(title.value).toBe('确认操作')
    expect(message.value).toBe('您确定要执行此操作吗？')
    expect(confirmText.value).toBe('确认')
    expect(cancelText.value).toBe('取消')
  })

  it('should update dialog visibility correctly', () => {
    const { isVisible, show, confirm } = useConfirm()
    
    show()
    expect(isVisible.value).toBe(true)
    
    confirm()
    expect(isVisible.value).toBe(false)
  })
})