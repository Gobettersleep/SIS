<template>
  <div id="app">
    <Navbar />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </main>

    <Teleport to="body">
      <div class="toast-container" aria-live="polite">
        <TransitionGroup name="toast">
          <div v-for="toast in toasts" :key="toast.id" class="toast-item" :class="`toast--${toast.type}`" role="alert">
            <div class="toast-icon">
              <svg v-if="toast.type === 'success'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <svg v-else-if="toast.type === 'error'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              <svg v-else-if="toast.type === 'warning'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </div>
            <span class="toast-message">{{ toast.message }}</span>
            <button class="toast-close" @click="removeToast(toast.id)" aria-label="关闭提示">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </TransitionGroup>
      </div>
    </Teleport>

    <Transition name="slide-down">
      <div v-if="!isOnline" class="offline-bar" role="alert">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.58 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
        <span>网络连接已断开，部分功能可能不可用</span>
        <span v-if="offlineQueue.length > 0" class="offline-queue">待同步 {{ offlineQueue.length }} 项</span>
      </div>
    </Transition>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="confirmVisible" class="modal-overlay" @click.self="cancelConfirm">
          <div class="modal-content modal-content--small" role="dialog" aria-modal="true">
            <div class="modal-header"><h3>{{ confirmTitle }}</h3></div>
            <div class="modal-body"><p class="confirm-text">{{ confirmMessage }}</p></div>
            <div class="form-actions">
              <button class="btn-secondary" @click="cancelConfirm">{{ confirmCancelText }}</button>
              <button class="btn-primary" @click="doConfirm">{{ confirmText }}</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import { useToast, globalToasts } from './composables/useToast.js'
import { useNetwork } from './composables/useNetwork.js'
import { useConfirm } from './composables/useConfirm.js'

const { remove: removeToast } = useToast()
const toasts = globalToasts
const { isOnline, offlineQueue } = useNetwork()
const { isVisible: confirmVisible, title: confirmTitle, message: confirmMessage, confirmText, cancelText: confirmCancelText, confirm: doConfirm, cancel: cancelConfirm } = useConfirm()

onMounted(() => { document.body.classList.add('app-loaded') })
</script>

<style>
#app { font-family: var(--font-sans); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; color: var(--color-text-primary); max-width: 1200px; margin: 0 auto; padding: 0 1.5rem 2rem; min-height: 100vh; }
.main-content { padding-top: 1rem; }

.page-enter-active, .page-leave-active { transition: all 0.2s ease; }
.page-enter-from { opacity: 0; transform: translateY(8px); }
.page-leave-to { opacity: 0; transform: translateY(-4px); }

.toast-container { position: fixed; top: 1rem; right: 1rem; z-index: 1100; display: flex; flex-direction: column; gap: 0.5rem; max-width: 400px; pointer-events: none; }
.toast-item { display: flex; align-items: center; gap: 0.625rem; padding: 0.875rem 1rem; background: #ffffff; border: 1px solid var(--color-border-light); border-radius: var(--radius-md); box-shadow: var(--shadow-float); pointer-events: auto; min-width: 280px; }
.toast--success { border-left: 3px solid #059669; }
.toast--error { border-left: 3px solid #dc2626; }
.toast--warning { border-left: 3px solid #d97706; }
.toast--info { border-left: 3px solid var(--color-accent); }
.toast-icon { display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.toast--success .toast-icon { color: var(--color-success); }
.toast--error .toast-icon { color: var(--color-danger); }
.toast--warning .toast-icon { color: var(--color-warning); }
.toast--info .toast-icon { color: var(--color-accent); }
.toast-message { flex: 1; font-size: 0.9rem; color: var(--color-text-primary); line-height: 1.4; }
.toast-close { background: none; border: none; color: var(--color-text-muted); cursor: pointer; padding: 0.25rem; border-radius: 0.25rem; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; flex-shrink: 0; }
.toast-close:hover { background: var(--color-surface-raised); color: var(--color-text-primary); }
.toast-enter-active, .toast-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.toast-enter-from { opacity: 0; transform: translateX(100%); }
.toast-leave-to { opacity: 0; transform: translateX(100%); }

.offline-bar { position: fixed; top: 0; left: 0; right: 0; z-index: 1200; display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.5rem 1rem; background: #fef3c7; color: #92400e; font-size: 0.85rem; font-weight: 500; }
.offline-queue { margin-left: 0.5rem; padding: 0.125rem 0.5rem; background: rgba(0,0,0,0.08); border-radius: 0.25rem; font-size: 0.75rem; }
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.3s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-100%); }

.modal-overlay { position: fixed; inset: 0; background-color: #1a1a1a; display: flex; align-items: center; justify-content: center; padding: 1rem; z-index: 1000; }
.modal-content { background: #ffffff; border-radius: var(--radius-lg); width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); border: 1px solid var(--color-border-light); }
.modal-content--small { max-width: 400px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--color-border-light); }
.modal-header h3 { margin: 0; font-size: 1.1rem; font-weight: 600; color: var(--color-text-primary); }
.modal-body { padding: 1.5rem; text-align: center; }
.confirm-text { font-size: 1rem; color: var(--color-text-primary); margin: 0; }
.form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; padding: 1rem 1.5rem; border-top: 1px solid var(--color-border-light); }
.btn-primary, .btn-secondary { padding: 0.625rem 1.25rem; border: none; border-radius: 0.5rem; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.2s ease; }
.btn-primary { background: var(--color-accent); color: white; }
.btn-primary:hover { background: var(--color-accent-hover); transform: translateY(-1px); }
.btn-secondary { background: var(--color-surface-raised); color: var(--color-text-primary); border: 1px solid var(--color-border); }
.btn-secondary:hover { background: var(--color-border); }
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.96); }

@media (max-width: 768px) {
  #app { padding: 0 1rem 1.5rem; }
  .toast-container { left: 1rem; right: 1rem; max-width: none; }
  .toast-item { min-width: auto; }
}
</style>
