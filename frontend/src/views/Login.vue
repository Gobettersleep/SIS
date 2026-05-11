<template>
  <div class="login-page">
    <div class="login-decoration" aria-hidden="true">
      <div class="deco-shape deco-shape--1"></div><div class="deco-shape deco-shape--2"></div><div class="deco-shape deco-shape--3"></div>
    </div>

    <div class="login-card animate-fade-in-up">
      <div class="login-header">
        <div class="login-icon-wrapper">
          <svg class="login-icon-svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
        </div>
        <h1 class="login-title">欢迎回来</h1>
        <p class="login-subtitle">登录以管理您的校园信息</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form" novalidate>
        <div class="form-group" :class="{ 'form-group--error': errors.username }">
          <label for="username" class="form-label">用户名<span class="required">*</span></label>
          <div class="input-wrapper">
            <span class="input-prefix"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
            <input type="text" id="username" v-model="form.username" placeholder="请输入您的用户名" :aria-invalid="errors.username ? 'true' : 'false'" @blur="validateField('username')" @input="clearError('username')" ref="usernameInput" />
          </div>
          <p v-if="errors.username" class="error-text" role="alert">{{ errors.username }}</p>
        </div>

        <div class="form-group" :class="{ 'form-group--error': errors.password }">
          <label for="password" class="form-label">密码<span class="required">*</span></label>
          <div class="input-wrapper">
            <span class="input-prefix"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
            <input :type="showPassword ? 'text' : 'password'" id="password" v-model="form.password" placeholder="请输入您的密码" :aria-invalid="errors.password ? 'true' : 'false'" @blur="validateField('password')" @input="clearError('password')" />
            <button type="button" class="input-suffix" @click="showPassword = !showPassword" :aria-label="showPassword ? '隐藏密码' : '显示密码'">
              <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
          </div>
          <p v-if="errors.password" class="error-text" role="alert">{{ errors.password }}</p>
        </div>

        <div class="form-options">
          <label class="remember-me"><input type="checkbox" v-model="form.rememberMe" /><span class="checkmark"></span><span>记住我</span></label>
          <button type="button" class="text-link" @click="showForgotPassword = true">忘记密码？</button>
        </div>

        <button type="submit" class="login-button btn-primary" :disabled="isLoading" :class="{ 'login-button--loading': isLoading }">
          <span v-if="isLoading" class="button-spinner"></span><span v-else>登录</span>
        </button>
      </form>

      <div class="login-footer"><p>还没有账号？<button type="button" class="text-link" @click="showRegister = true">立即注册</button></p></div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showRegister" class="modal-overlay" @click.self="showRegister = false">
          <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="register-title">
            <div class="modal-header"><h3 id="register-title">创建新账号</h3><button type="button" class="close-button" @click="showRegister = false" aria-label="关闭"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
            <form @submit.prevent="handleRegister" class="modal-form">
              <div class="form-group" :class="{ 'form-group--error': regErrors.username }"><label class="form-label">用户名<span class="required">*</span></label><input type="text" v-model="registerForm.username" placeholder="设置一个用户名" @blur="validateRegField('username')" /><p v-if="regErrors.username" class="error-text">{{ regErrors.username }}</p></div>
              <div class="form-group" :class="{ 'form-group--error': regErrors.password }"><label class="form-label">密码<span class="required">*</span></label><input type="password" v-model="registerForm.password" placeholder="设置密码（至少6位）" @blur="validateRegField('password')" /><p v-if="regErrors.password" class="error-text">{{ regErrors.password }}</p></div>
              <div class="form-group" :class="{ 'form-group--error': regErrors.confirmPassword }"><label class="form-label">确认密码<span class="required">*</span></label><input type="password" v-model="registerForm.confirmPassword" placeholder="再次输入密码" @blur="validateRegField('confirmPassword')" /><p v-if="regErrors.confirmPassword" class="error-text">{{ regErrors.confirmPassword }}</p></div>
              <div class="form-actions"><button type="button" class="btn-secondary" @click="showRegister = false">取消</button><button type="submit" class="btn-primary" :disabled="isRegLoading"><span v-if="isRegLoading" class="button-spinner"></span><span v-else>注册</span></button></div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showForgotPassword" class="modal-overlay" @click.self="showForgotPassword = false">
          <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="forgot-title">
            <div class="modal-header"><h3 id="forgot-title">找回密码</h3><button type="button" class="close-button" @click="showForgotPassword = false" aria-label="关闭"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
            <form @submit.prevent="handleForgotPassword" class="modal-form">
              <div class="form-group"><label class="form-label">用户名</label><input type="text" v-model="forgotForm.username" placeholder="请输入您的用户名" /></div>
              <div class="form-group"><label class="form-label">注册邮箱</label><input type="email" v-model="forgotForm.email" placeholder="请输入注册时使用的邮箱" /></div>
              <div class="form-actions"><button type="button" class="btn-secondary" @click="showForgotPassword = false">取消</button><button type="submit" class="btn-primary" :disabled="isForgotLoading"><span v-if="isForgotLoading" class="button-spinner"></span><span v-else>发送重置链接</span></button></div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { post } from '../utils/api.js'
import { useToast } from '../composables/useToast.js'

const router = useRouter()
const toast = useToast()

const form = reactive({ username: '', password: '', rememberMe: false })
const errors = reactive({ username: '', password: '' })
const registerForm = reactive({ username: '', password: '', confirmPassword: '' })
const regErrors = reactive({ username: '', password: '', confirmPassword: '' })
const forgotForm = reactive({ username: '', email: '' })

const showRegister = ref(false)
const showForgotPassword = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)
const isRegLoading = ref(false)
const isForgotLoading = ref(false)
const usernameInput = ref(null)

const validateField = (field) => {
  if (field === 'username') { if (!form.username.trim()) errors.username = '用户名不能为空'; else if (form.username.length < 3) errors.username = '用户名至少需要3个字符'; else errors.username = '' }
  if (field === 'password') { if (!form.password) errors.password = '密码不能为空'; else if (form.password.length < 6) errors.password = '密码至少需要6个字符'; else errors.password = '' }
}
const validateRegField = (field) => {
  if (field === 'username') { if (!registerForm.username.trim()) regErrors.username = '用户名不能为空'; else if (registerForm.username.length < 3) regErrors.username = '用户名至少需要3个字符'; else regErrors.username = '' }
  if (field === 'password') { if (!registerForm.password) regErrors.password = '密码不能为空'; else if (registerForm.password.length < 6) regErrors.password = '密码至少需要6个字符'; else regErrors.password = '' }
  if (field === 'confirmPassword') { if (!registerForm.confirmPassword) regErrors.confirmPassword = '请确认密码'; else if (registerForm.confirmPassword !== registerForm.password) regErrors.confirmPassword = '两次输入的密码不一致'; else regErrors.confirmPassword = '' }
}
const clearError = (field) => { errors[field] = '' }

const handleLogin = async () => {
  validateField('username'); validateField('password')
  if (errors.username || errors.password) { toast.error('请修正表单中的错误'); return }
  isLoading.value = true
  try {
    const response = await post('/api/auth/login', { username: form.username, password: form.password })
    if (response && response.token) {
      localStorage.setItem('auth_token', response.token)
      if (response.user) {
        localStorage.setItem('user_info', JSON.stringify(response.user))
      }
    }
    if (form.rememberMe) localStorage.setItem('remembered_username', form.username)
    else localStorage.removeItem('remembered_username')
    toast.success('登录成功，欢迎回来')
    router.push('/')
  } catch (err) { toast.error(err.message || '登录失败，请检查用户名和密码') } finally { isLoading.value = false }
}

const handleRegister = async () => {
  validateRegField('username'); validateRegField('password'); validateRegField('confirmPassword')
  if (regErrors.username || regErrors.password || regErrors.confirmPassword) { toast.error('请修正表单中的错误'); return }
  isRegLoading.value = true
  try {
    await post('/api/auth/register', { username: registerForm.username, password: registerForm.password })
    toast.success('注册成功，请使用新账号登录')
    showRegister.value = false; registerForm.username = ''; registerForm.password = ''; registerForm.confirmPassword = ''
  } catch (err) { toast.error(err.message || '注册失败，请稍后重试') } finally { isRegLoading.value = false }
}

const handleForgotPassword = async () => {
  if (!forgotForm.username || !forgotForm.email) { toast.warning('请填写完整信息'); return }
  isForgotLoading.value = true
  try {
    await post('/api/auth/forgot-password', { username: forgotForm.username, email: forgotForm.email })
    toast.success('重置链接已发送至您的邮箱，请查收')
    showForgotPassword.value = false; forgotForm.username = ''; forgotForm.email = ''
  } catch (err) { toast.error(err.message || '发送失败，请检查邮箱地址') } finally { isForgotLoading.value = false }
}

onMounted(() => {
  const remembered = localStorage.getItem('remembered_username')
  if (remembered) { form.username = remembered; form.rememberMe = true }
  usernameInput.value?.focus()
})
</script>

<style scoped>
.login-page { min-height: calc(100vh - 120px); display: flex; align-items: center; justify-content: center; position: relative; padding: var(--space-6) var(--space-4); }
.login-decoration { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.deco-shape { position: absolute; border-radius: 50%; opacity: 0.04; background: var(--color-accent); }
.deco-shape--1 { width: 400px; height: 400px; top: -100px; right: -100px; animation: float 20s ease-in-out infinite; }
.deco-shape--2 { width: 300px; height: 300px; bottom: -50px; left: -80px; animation: float 25s ease-in-out infinite reverse; }
.deco-shape--3 { width: 200px; height: 200px; top: 40%; left: 60%; animation: float 18s ease-in-out infinite; animation-delay: -5s; }
@keyframes float { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30px, -30px) scale(1.05); } 66% { transform: translate(-20px, 20px) scale(0.95); } }
.login-card { position: relative; z-index: 1; width: 100%; max-width: 420px; background-color: var(--color-surface); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); padding: var(--space-10) var(--space-8); border: 1px solid var(--color-border-light); }
.login-header { text-align: center; margin-bottom: var(--space-8); }
.login-icon-wrapper { width: 64px; height: 64px; margin: 0 auto var(--space-4); background-color: var(--color-accent-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: transform var(--transition-bounce); }
.login-card:hover .login-icon-wrapper { transform: scale(1.05) rotate(-3deg); }
.login-icon-svg { color: var(--color-accent); }
.login-title { font-size: 1.75rem; font-weight: 700; margin-bottom: var(--space-2); color: var(--color-text-primary); }
.login-subtitle { color: var(--color-text-muted); font-size: 0.9375rem; }
.login-form { display: flex; flex-direction: column; gap: var(--space-5); }
.form-group { display: flex; flex-direction: column; gap: var(--space-2); }
.form-group--error input { border-color: var(--color-danger); box-shadow: 0 0 0 3px rgba(192, 57, 43, 0.1); }
.form-label { font-size: 0.875rem; font-weight: 500; color: var(--color-text-secondary); }
.required { color: var(--color-danger); margin-left: 2px; }
.input-wrapper { position: relative; display: flex; align-items: center; }
.input-prefix, .input-suffix { position: absolute; display: flex; align-items: center; justify-content: center; color: var(--color-text-muted); z-index: 1; }
.input-prefix { left: var(--space-3); pointer-events: none; }
.input-suffix { right: var(--space-3); background: none; border: none; padding: var(--space-1); cursor: pointer; border-radius: var(--radius-sm); transition: color var(--transition-fast), background-color var(--transition-fast); min-height: auto; min-width: auto; }
.input-suffix:hover { color: var(--color-accent); background-color: var(--color-accent-light); transform: none; }
.input-wrapper input { padding-left: 2.75rem; padding-right: 2.75rem; }
.error-text { font-size: 0.8125rem; color: var(--color-danger); }
.form-options { display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem; }
.remember-me { display: flex; align-items: center; gap: var(--space-2); cursor: pointer; color: var(--color-text-secondary); }
.remember-me input { width: auto; position: absolute; opacity: 0; }
.checkmark { width: 18px; height: 18px; border: 2px solid var(--color-border); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; transition: border-color var(--transition-fast), background-color var(--transition-fast); }
.remember-me input:checked + .checkmark { background-color: var(--color-accent); border-color: var(--color-accent); }
.remember-me input:checked + .checkmark::after { content: ''; width: 5px; height: 9px; border: solid white; border-width: 0 2px 2px 0; transform: rotate(45deg); margin-bottom: 2px; }
.text-link { background: none; border: none; color: var(--color-accent); font-size: 0.875rem; font-weight: 500; cursor: pointer; padding: 0; min-height: auto; transition: color var(--transition-fast); }
.text-link:hover { color: var(--color-accent-hover); text-decoration: underline; transform: none; }
.login-button { width: 100%; height: 48px; font-size: 1rem; font-weight: 600; margin-top: var(--space-2); }
.login-button--loading { cursor: not-allowed; opacity: 0.8; }
.button-spinner { display: inline-block; width: 20px; height: 20px; border: 2px solid rgba(255, 255, 255, 0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.login-footer { text-align: center; margin-top: var(--space-6); padding-top: var(--space-6); border-top: 1px solid var(--color-border-light); font-size: 0.875rem; color: var(--color-text-muted); }
.modal-overlay { position: fixed; inset: 0; background-color: #1a1a1a; display: flex; align-items: center; justify-content: center; padding: var(--space-4); z-index: 2000; }
.modal-content { background-color: #ffffff; border-radius: var(--radius-lg); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); width: 100%; max-width: 440px; max-height: 90vh; overflow-y: auto; border: 1px solid #e0ddd8; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: var(--space-5) var(--space-6); border-bottom: 1px solid var(--color-border-light); }
.modal-header h3 { margin: 0; font-size: 1.125rem; font-weight: 600; }
.close-button { background: none; border: none; color: var(--color-text-muted); cursor: pointer; padding: var(--space-1); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; transition: color var(--transition-fast), background-color var(--transition-fast); min-height: auto; min-width: auto; }
.close-button:hover { color: var(--color-text-primary); background-color: var(--color-surface-raised); transform: none; }
.modal-form { padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-4); }
.form-actions { display: flex; justify-content: flex-end; gap: var(--space-3); margin-top: var(--space-2); }
.modal-enter-active, .modal-leave-active { transition: opacity var(--transition-base); }
.modal-enter-active .modal-content, .modal-leave-active .modal-content { transition: transform var(--transition-base), opacity var(--transition-base); }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-content, .modal-leave-to .modal-content { transform: scale(0.95) translateY(10px); opacity: 0; }
@media (max-width: 480px) { .login-card { padding: var(--space-6) var(--space-4); } .login-title { font-size: 1.5rem; } .form-actions { flex-direction: column; } .form-actions button { width: 100%; } }
</style>
