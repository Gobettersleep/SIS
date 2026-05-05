<template>
  <div class="home">
    <div class="hero-section">
      <h1>大学生信息系统</h1>
      <p class="hero-subtitle">高效管理学生信息，提升教育管理水平</p>
    </div>
    
    <div class="features-section">
      <h2>核心功能</h2>
      <div class="features-grid">
        <router-link to="/students" class="feature-card">
          <div class="feature-icon">👨‍🎓</div>
          <h3>学生管理</h3>
          <p>全面管理学生信息，包括基本信息、学籍状态等</p>
        </router-link>
        
        <router-link to="/courses" class="feature-card">
          <div class="feature-icon">📚</div>
          <h3>课程管理</h3>
          <p>管理课程信息，包括课程详情、教师分配等</p>
        </router-link>
        
        <router-link to="/grades" class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>成绩管理</h3>
          <p>记录和分析学生成绩，生成成绩单和统计报告</p>
        </router-link>
        
        <router-link to="/login" class="feature-card">
          <div class="feature-icon">🔐</div>
          <h3>用户登录</h3>
          <p>安全的用户认证系统，保护数据安全</p>
        </router-link>
      </div>
    </div>
    
    <div class="stats-section">
      <h2>系统概览</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">3</div>
          <div class="stat-label">学生</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">3</div>
          <div class="stat-label">课程</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">4</div>
          <div class="stat-label">成绩记录</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">2</div>
          <div class="stat-label">用户</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Home 组件
</script>

<style scoped>
.home {
  padding: 20px 0;
}

.hero-section {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  margin-bottom: 40px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.hero-section h1 {
  font-size: 3rem;
  margin-bottom: 15px;
  color: #2c3e50;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #555;
  max-width: 600px;
  margin: 0 auto;
}

.features-section {
  margin-bottom: 50px;
}

.features-section h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.feature-card {
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  text-decoration: none;
  color: #333;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.feature-card h3 {
  margin-bottom: 10px;
  color: #2c3e50;
}

.feature-card p {
  color: #666;
  font-size: 0.95rem;
}

.stats-section {
  margin-bottom: 40px;
}

.stats-section h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background-color: white;
  border-radius: 10px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #4a6fa5;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2.2rem;
  }
  
  .hero-section {
    padding: 40px 15px;
  }
  
  .features-grid,
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>