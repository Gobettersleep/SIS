import { ref, onMounted, onUnmounted } from 'vue';

const isOnline = ref(navigator.onLine);
const offlineQueue = ref([]);
let syncInterval = null;

export function useNetwork() {
  const handleOnline = () => { isOnline.value = true; processOfflineQueue(); };
  const handleOffline = () => { isOnline.value = false; };

  const addToQueue = (operation) => {
    offlineQueue.value.push({ ...operation, timestamp: Date.now(), id: Date.now() + Math.random().toString(36).substr(2, 9) });
    saveQueue();
  };

  const saveQueue = () => {
    try { localStorage.setItem('offline_queue', JSON.stringify(offlineQueue.value)); } catch (e) {}
  };

  const loadQueue = () => {
    try { const saved = localStorage.getItem('offline_queue'); if (saved) offlineQueue.value = JSON.parse(saved); } catch (e) {}
  };

  const processOfflineQueue = async () => {
    if (offlineQueue.value.length === 0) return;
    const queue = [...offlineQueue.value];
    offlineQueue.value = [];
    saveQueue();
    for (const operation of queue) {
      try { if (operation.execute) await operation.execute(); } catch (err) { offlineQueue.value.push(operation); }
    }
    saveQueue();
  };

  const clearQueue = () => { offlineQueue.value = []; saveQueue(); };

  onMounted(() => {
    loadQueue();
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    syncInterval = setInterval(() => { if (isOnline.value && offlineQueue.value.length > 0) processOfflineQueue(); }, 30000);
  });

  onUnmounted(() => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
    if (syncInterval) clearInterval(syncInterval);
  });

  return { isOnline, offlineQueue, addToQueue, processOfflineQueue, clearQueue };
}
