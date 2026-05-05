<template>
  <div class="courses">
    <div class="courses-header">
      <h2>课程管理</h2>
      <button class="add-button" @click="showAddForm = true">
        <span class="button-icon">+</span>
        添加课程
      </button>
    </div>
    
    <div class="courses-card">
      <div class="courses-table-container">
        <table class="courses-table">
          <thead>
            <tr>
              <th>课程ID</th>
              <th>课程名称</th>
              <th>学分</th>
              <th>课时</th>
              <th>教师</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in courses" :key="course.id" class="table-row">
              <td>{{ course.id }}</td>
              <td>{{ course.name }}</td>
              <td>{{ course.credit }}</td>
              <td>{{ course.hours }}</td>
              <td>{{ course.teacher }}</td>
              <td class="action-buttons">
                <button class="edit-button" @click="editCourse(course)">
                  <span class="button-icon">✏️</span>
                  编辑
                </button>
                <button class="delete-button" @click="deleteCourse(course.id)">
                  <span class="button-icon">🗑️</span>
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- 添加/编辑课程表单 -->
    <div v-if="showAddForm || showEditForm" class="form-dialog">
      <div class="form-header">
        <h3>{{ showEditForm ? '编辑课程' : '添加课程' }}</h3>
        <button class="close-button" @click="cancelForm">×</button>
      </div>
      <form @submit.prevent="handleSubmit" class="form-content">
        <div class="form-row">
          <div class="form-group">
            <label for="id">课程ID</label>
            <input type="text" id="id" v-model="form.id" :disabled="showEditForm" required placeholder="请输入课程ID">
          </div>
          <div class="form-group">
            <label for="name">课程名称</label>
            <input type="text" id="name" v-model="form.name" required placeholder="请输入课程名称">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="credit">学分</label>
            <input type="number" id="credit" v-model="form.credit" step="0.5" required placeholder="请输入学分">
          </div>
          <div class="form-group">
            <label for="hours">课时</label>
            <input type="number" id="hours" v-model="form.hours" required placeholder="请输入课时">
          </div>
        </div>
        <div class="form-group full-width">
          <label for="teacher">教师</label>
          <input type="text" id="teacher" v-model="form.teacher" required placeholder="请输入教师姓名">
        </div>
        <div class="form-actions">
          <button type="button" class="cancel-button" @click="cancelForm">取消</button>
          <button type="submit" class="submit-button">{{ showEditForm ? '更新' : '添加' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const courses = ref([
  { id: 'C001', name: '高等数学', credit: 4.0, hours: 64, teacher: '张教授' },
  { id: 'C002', name: '大学英语', credit: 3.0, hours: 48, teacher: '李老师' },
  { id: 'C003', name: '数据结构', credit: 3.5, hours: 56, teacher: '王教授' }
])

const showAddForm = ref(false)
const showEditForm = ref(false)
const form = ref({ id: '', name: '', credit: '', hours: '', teacher: '' })

const editCourse = (course) => {
  form.value = { ...course }
  showEditForm.value = true
  showAddForm.value = false
}

const deleteCourse = (id) => {
  if (confirm('确定要删除该课程吗？')) {
    const index = courses.value.findIndex(c => c.id === id)
    if (index !== -1) {
      courses.value.splice(index, 1)
    }
  }
}

const handleSubmit = () => {
  if (showEditForm.value) {
    const index = courses.value.findIndex(c => c.id === form.value.id)
    if (index !== -1) {
      courses.value[index] = { ...form.value }
    }
  } else {
    courses.value.push({ ...form.value })
  }
  cancelForm()
}

const cancelForm = () => {
  showAddForm.value = false
  showEditForm.value = false
  form.value = { id: '', name: '', credit: '', hours: '', teacher: '' }
}
</script>

<style scoped>
.courses {
  padding: 20px 0;
}

.courses-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.courses-header h2 {
  color: #2c3e50;
  margin: 0;
}

.add-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #4a6fa5;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.add-button:hover {
  background-color: #355480;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.button-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.courses-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
}

.courses-card:hover {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.courses-table-container {
  overflow-x: auto;
}

.courses-table {
  width: 100%;
  border-collapse: collapse;
}

.courses-table th,
.courses-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.courses-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-row {
  transition: all 0.3s ease;
  cursor: pointer;
}

.table-row:hover {
  background-color: #f8f9fa;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.edit-button,
.delete-button {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-button {
  background-color: #4a6fa5;
  color: white;
}

.edit-button:hover {
  background-color: #355480;
  transform: translateY(-1px);
}

.delete-button {
  background-color: #e74c3c;
  color: white;
}

.delete-button:hover {
  background-color: #c0392b;
  transform: translateY(-1px);
}

.form-dialog {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  margin-top: 30px;
  overflow: hidden;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f8f9fa;
}

.form-header h3 {
  margin: 0;
  color: #2c3e50;
}

.close-button {
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

.close-button:hover {
  background-color: #e0e0e0;
  color: #333;
}

.form-content {
  padding: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #4a6fa5;
  box-shadow: 0 0 0 3px rgba(74, 111, 165, 0.1);
}

.full-width {
  grid-column: 1 / -1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
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

@media (max-width: 768px) {
  .courses-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 5px;
  }
  
  .edit-button,
  .delete-button {
    width: 100%;
    justify-content: center;
  }
}
</style>