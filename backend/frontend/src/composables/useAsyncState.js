import { ref, computed } from 'vue';

export function useAsyncState(asyncFn, options = {}) {
  const state = ref('idle');
  const data = ref(options.initialData || null);
  const error = ref(null);
  const isLoading = computed(() => state.value === 'pending');
  const isSuccess = computed(() => state.value === 'success');
  const isError = computed(() => state.value === 'error');

  const execute = async (...args) => {
    state.value = 'pending';
    error.value = null;
    try {
      const result = await asyncFn(...args);
      data.value = result;
      state.value = 'success';
      return result;
    } catch (err) {
      error.value = err;
      state.value = 'error';
      throw err;
    }
  };

  const reset = () => {
    state.value = 'idle';
    data.value = options.initialData || null;
    error.value = null;
  };

  return { state, data, error, isLoading, isSuccess, isError, execute, reset };
}
