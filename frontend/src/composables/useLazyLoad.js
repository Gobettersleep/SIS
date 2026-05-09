import { ref, onUnmounted } from 'vue'

export function useLazyLoad(options = {}) {
  const { threshold = 0.01, rootMargin = '50px' } = options
  const isVisible = ref(false)
  let observer = null

  const observe = (element) => {
    if (!element || observer) return
    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { isVisible.value = true; observer.unobserve(entry.target); observer = null }
    }, { threshold, rootMargin })
    observer.observe(element)
  }

  const unobserve = () => { if (observer) { observer.disconnect(); observer = null } }
  onUnmounted(() => { unobserve() })
  return { isVisible, observe, unobserve }
}

export const vLazy = {
  mounted(el, binding) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { if (typeof binding.value === 'function') binding.value(el); observer.unobserve(el) }
    }, { threshold: 0.01, rootMargin: '50px' })
    observer.observe(el)
    el.__lazyObserver = observer
  },
  unmounted(el) { if (el.__lazyObserver) { el.__lazyObserver.disconnect(); delete el.__lazyObserver } }
}
