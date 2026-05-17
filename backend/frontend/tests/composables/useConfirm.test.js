import { describe, it, expect, beforeEach } from 'vitest'
import { useConfirm } from '../../src/composables/useConfirm.js'

describe('useConfirm', () => {
  beforeEach(() => {
    const { cancel } = useConfirm()
    cancel()
  })

  it('should show confirm dialog with default options', async () => {
    const { show, isVisible, title, message } = useConfirm()
    
    show()
    
    expect(isVisible.value).toBe(true)
    expect(title.value).toBe('确认操作')
    expect(message.value).toBe('您确定要执行此操作吗？')
  })

  it('should show confirm dialog with custom options', async () => {
    const { show, isVisible, title, message, confirmText, cancelText } = useConfirm()
    
    show({
      title: '自定义标题',
      message: '自定义消息',
      confirmText: '确定',
      cancelText: '取消'
    })
    
    expect(isVisible.value).toBe(true)
    expect(title.value).toBe('自定义标题')
    expect(message.value).toBe('自定义消息')
    expect(confirmText.value).toBe('确定')
    expect(cancelText.value).toBe('取消')
  })

  it('should resolve with true when confirmed', async () => {
    const { show, confirm, isVisible } = useConfirm()
    
    const promise = show()
    expect(isVisible.value).toBe(true)
    
    confirm()
    
    const result = await promise
    expect(result).toBe(true)
    expect(isVisible.value).toBe(false)
  })

  it('should resolve with false when cancelled', async () => {
    const { show, cancel, isVisible } = useConfirm()
    
    const promise = show()
    expect(isVisible.value).toBe(true)
    
    cancel()
    
    const result = await promise
    expect(result).toBe(false)
    expect(isVisible.value).toBe(false)
  })
})