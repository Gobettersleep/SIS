<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="login-icon">🔐</div>
        <h2>用户登录</h2>
        <p>请输入您的用户名和密码</p>
      </div>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">用户名</label>
          <div class="input-container">
            <span class="input-icon">👤</span>
            <input type="text" id="username" v-model="form.username" placeholder="请输入用户名" required>
          </div>
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <div class="input-container">
            <span class="input-icon">🔑</span>
            <input type="password" id="password" v-model="form.password" placeholder="请输入密码" required>
          </div>
        </div>
        <button type="submit" class="login-button">登录</button>
        <div class="login-footer">
          <a href="#" class="forgot-password" @click.prevent="showForgotPassword = true">忘记密码？</a>
          <a href="#" class="register-link" @click.prevent="showRegister = true">注册账号</a>
        </div>
      </form>
    </div>
    
    <!-- 注册模态框 -->
    <div v-if="showRegister" class="modal-overlay" @click="showRegister = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>注册账号</h3>
          <button class="close-button" @click="showRegister = false">×</button>
        </div>
        <form @submit.prevent="handleRegister" class="modal-form">
          <div class="form-group">
            <label for="reg-username">用户名</label>
            <input type="text" id="reg-username" v-model="registerForm.username" placeholder="请输入用户名" required>
          </div>
          <div class="form-group">
            <label for="reg-password">密码</label>
            <input type="password" id="reg-password" v-model="registerForm.password" placeholder="请输入密码" required>
          </div>
          <div class="form-group">
            <label for="reg-confirm-password">确认密码</label>
            <input type="password" id="reg-confirm-password" v-model="registerForm.confirmPassword" placeholder="请确认密码" required>
          </div>
          <div class="form-actions">
            <button type="button" class="cancel-button" @click="showRegister = false">取消</button>
            <button type="submit" class="submit-button">注册</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- 忘记密码模态框 -->
    <div v-if="showForgotPassword" class="modal-overlay" @click="showForgotPassword = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>忘记密码</h3>
          <button class="close-button" @click="showForgotPassword = false">×</button>
        </div>
        <form @submit.prevent="handleForgotPassword" class="modal-form">
          <div class="form-group">
            <label for="forgot-username">用户名</label>
            <input type="text" id="forgot-username" v-model="forgotForm.username" placeholder="请输入用户名" required>
          </div>
          <div class="form-group">
            <label for="forgot-email">邮箱</label>
            <input type="email" id="forgot-email" v-model="forgotForm.email" placeholder="请输入注册邮箱" required>
          </div>
          <div class="form-actions">
            <button type="button" class="cancel-button" @click="showForgotPassword = false">取消</button>
            <button type="submit" class="submit-button">重置密码</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({
  username: '',
  password: ''
})
const showRegister = ref(false)
const showForgotPassword = ref(false)
const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: ''
})
const forgotForm = ref({
  username: '',
  email: ''
})

const handleLogin = () => {
  // 模拟登录
  if (form.value.username && form.value.password) {
    router.push('/')
  }
}

const handleRegister = () => {
  // 模拟注册
  if (registerForm.value.username && registerForm.value.password && registerForm.value.confirmPassword) {
    if (registerForm.value.password === registerForm.value.confirmPassword) {
      alert('注册成功！请登录')
      showRegister.value = false
      registerForm.value = {
        username: '',
        password: '',
        confirmPassword: ''
      }
    } else {
      alert('两次输入的密码不一致')
    }
  }
}

const handleForgotPassword = () => {
  // 模拟忘记密码
  if (forgotForm.value.username && forgotForm.value.email) {
    alert('密码重置链接已发送到您的邮箱')
    showForgotPassword.value = false
    forgotForm.value = {
      username: '',
      email: ''
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 20px;
}

.login-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  transition: all 0.3s ease;
}

.login-card:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.login-header h2 {
  margin-bottom: 10px;
  color: #2c3e50;
}

.login-header p {
  color: #666;
  font-size: 0.95rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.input-container {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  font-size: 1.1rem;
}

.input-container input {
  padding-left: 45px;
  height: 48px;
  font-size: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

.input-container input:focus {
  outline: none;
  border-color: #4a6fa5;
  box-shadow: 0 0 0 3px rgba(74, 111, 165, 0.1);
}

.login-button {
  height: 48px;
  font-size: 1rem;
  font-weight: 500;
  background-color: #4a6fa5;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.login-button:hover {
  background-color: #355480;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 111, 165, 0.3);
}

.login-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  font-size: 0.9rem;
}

.forgot-password,
.register-link {
  color: #4a6fa5;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password:hover,
.register-link:hover {
  color: #355480;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .login-card {
    padding: 30px 20px;
  }
  
  .login-header h2 {
    font-size: 1.5rem;
  }
  
  .modal-content {
    width: 90%;
    max-width: 400px;
  }
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 450px;
  overflow: hidden;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f8f9fa;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.modal-header .close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.modal-header .close-button:hover {
  background-color: #e0e0e0;
  color: #333;
}

.modal-form {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.modal-form .form-group {
  text-align: left;
}

.modal-form .form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
  font-size: 0.9rem;
}

.modal-form .form-group input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.modal-form .form-group input:focus {
  outline: none;
  border-color: #4a6fa5;
  box-shadow: 0 0 0 3px rgba(74, 111, 165, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.cancel-button,
.submit-button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-button {
  background-color: #e0e0e0;
  color: #333;
}

.cancel-button:hover {
  background-color: #d0d0d0;
  transform: translateY(-1px);
}

.submit-button {
  background-color: #4a6fa5;
  color: white;
  font-weight: 500;
}

.submit-button:hover {
  background-color: #355480;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(74, 111, 165, 0.3);
}
</style>