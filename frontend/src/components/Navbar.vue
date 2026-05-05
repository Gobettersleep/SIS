<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <router-link to="/" class="brand-link">
          <span class="brand-icon">🎓</span>
          <span class="brand-text">大学生信息系统</span>
        </router-link>
      </div>
      <div class="navbar-links">
        <router-link to="/students" class="nav-link">
          <span class="nav-icon">👨‍🎓</span>
          <span>学生管理</span>
        </router-link>
        <router-link to="/courses" class="nav-link">
          <span class="nav-icon">📚</span>
          <span>课程管理</span>
        </router-link>
        <router-link to="/grades" class="nav-link">
          <span class="nav-icon">📊</span>
          <span>成绩管理</span>
        </router-link>
        <router-link to="/login" class="nav-link login-link">
          <span class="nav-icon">🔐</span>
          <span>登录</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
// Navbar 组件
</script>

<style scoped>
.navbar {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  margin-bottom: 2rem;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #2c3e50;
  font-weight: 600;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.brand-link:hover {
  color: #4a6fa5;
  transform: translateY(-1px);
}

.brand-icon {
  font-size: 1.5rem;
}

.navbar-links {
  display: flex;
  gap: 15px;
  align-items: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 6px;
  color: #555;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.nav-link:hover {
  background-color: #f0f4f8;
  color: #4a6fa5;
  transform: translateY(-1px);
}

.nav-icon {
  font-size: 1.1rem;
}

.login-link {
  background-color: #4a6fa5;
  color: white;
  font-weight: 500;
}

.login-link:hover {
  background-color: #355480;
  color: white;
}

@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    height: auto;
    padding: 15px 20px;
    gap: 15px;
  }
  
  .navbar-links {
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }
  
  .nav-link {
    flex: 1;
    min-width: 120px;
    justify-content: center;
  }
}
</style>