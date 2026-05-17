import { ref } from 'vue';

const isVisible = ref(false);
const title = ref('确认操作');
const message = ref('您确定要执行此操作吗？');
const confirmText = ref('确认');
const cancelText = ref('取消');
let resolvePromise = null;

export function useConfirm() {
  const show = (options = {}) => {
    title.value = options.title || '确认操作';
    message.value = options.message || '您确定要执行此操作吗？';
    confirmText.value = options.confirmText || '确认';
    cancelText.value = options.cancelText || '取消';
    isVisible.value = true;
    return new Promise((resolve) => { resolvePromise = resolve; });
  };
  const confirm = () => {
    isVisible.value = false;
    if (resolvePromise) { resolvePromise(true); resolvePromise = null; }
  };
  const cancel = () => {
    isVisible.value = false;
    if (resolvePromise) { resolvePromise(false); resolvePromise = null; }
  };
  return { isVisible, title, message, confirmText, cancelText, show, confirm, cancel };
}
