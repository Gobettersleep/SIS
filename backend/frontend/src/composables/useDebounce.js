import { onUnmounted } from 'vue'

export function useDebounce(fn, delayMs = 300) {
  let timer = null
  const debounced = (...args) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => { fn(...args); timer = null }, delayMs)
  }
  const cancel = () => { if (timer) { clearTimeout(timer); timer = null } }
  onUnmounted(cancel)
  return { debounced, cancel }
}

export function useThrottle(fn, intervalMs = 300) {
  let lastTime = 0, timer = null
  const throttled = (...args) => {
    const now = Date.now()
    if (now - lastTime >= intervalMs) { lastTime = now; fn(...args) }
    else if (!timer) { timer = setTimeout(() => { lastTime = Date.now(); fn(...args); timer = null }, intervalMs - (now - lastTime)) }
  }
  const cancel = () => { if (timer) { clearTimeout(timer); timer = null } }
  onUnmounted(cancel)
  return { throttled, cancel }
}
