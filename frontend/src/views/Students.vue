<template>
  <div class="students">
    <div class="students-header">
      <h2>学生管理</h2>
      <button class="add-button" @click="showAddForm = true">
        <span class="button-icon">+</span>
        添加学生
      </button>
    </div>
    
    <div class="students-card">
      <div class="students-table-container">
        <table class="students-table">
          <thead>
            <tr>
              <th>学号</th>
              <th>姓名</th>
              <th>性别</th>
              <th>年龄</th>
              <th>专业</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.id" class="table-row">
              <td>{{ student.id }}</td>
              <td>{{ student.name }}</td>
              <td>{{ student.gender }}</td>
              <td>{{ student.age }}</td>
              <td>{{ student.major }}</td>
              <td class="action-buttons">
                <button class="edit-button" @click="editStudent(student)">
                  <span class="button-icon">✏️</span>
                  编辑
                </button>
                <button class="delete-button" @click="deleteStudent(student.id)">
                  <span class="button-icon">🗑️</span>
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- 添加/编辑学生表单 -->
    <div v-if="showAddForm || showEditForm" class="form-dialog">
      <div class="form-header">
        <h3>{{ showEditForm ? '编辑学生' : '添加学生' }}</h3>
        <button class="close-button" @click="cancelForm">×</button>
      </div>
      <form @submit.prevent="handleSubmit" class="form-content">
        <div class="form-row">
          <div class="form-group">
            <label for="id">学号</label>
            <input type="text" id="id" v-model="form.id" :disabled="showEditForm" required placeholder="请输入学号">
          </div>
          <div class="form-group">
            <label for="name">姓名</label>
            <input type="text" id="name" v-model="form.name" required placeholder="请输入姓名">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="gender">性别</label>
            <select id="gender" v-model="form.gender" required>
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </div>
          <div class="form-group">
            <label for="age">年龄</label>
            <input type="number" id="age" v-model="form.age" required placeholder="请输入年龄">
          </div>
        </div>
        <div class="form-group full-width">
          <label for="major">专业</label>
          <input type="text" id="major" v-model="form.major" required placeholder="请输入专业">
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

const students = ref([
  { id: '2021001', name: '张三', gender: '男', age: 20, major: '计算机科学与技术' },
  { id: '2021002', name: '李四', gender: '女', age: 19, major: '软件工程' },
  { id: '2021003', name: '王五', gender: '男', age: 21, major: '数据科学与大数据技术' }
])

const showAddForm = ref(false)
const showEditForm = ref(false)
const form = ref({ id: '', name: '', gender: '男', age: '', major: '' })

const editStudent = (student) => {
  form.value = { ...student }
  showEditForm.value = true
  showAddForm.value = false
}

const deleteStudent = (id) => {
  if (confirm('确定要删除该学生吗？')) {
    const index = students.value.findIndex(s => s.id === id)
    if (index !== -1) {
      students.value.splice(index, 1)
    }
  }
}

const handleSubmit = () => {
  if (showEditForm.value) {
    const index = students.value.findIndex(s => s.id === form.value.id)
    if (index !== -1) {
      students.value[index] = { ...form.value }
    }
  } else {
    students.value.push({ ...form.value })
  }
  cancelForm()
}

const cancelForm = () => {
  showAddForm.value = false
  showEditForm.value = false
  form.value = { id: '', name: '', gender: '男', age: '', major: '' }
}
</script>

<style scoped>
.students {
  padding: 20px 0;
}

.students-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.students-header h2 {
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

.students-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
}

.students-card:hover {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.students-table-container {
  overflow-x: auto;
}

.students-table {
  width: 100%;
  border-collapse: collapse;
}

.students-table th,
.students-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.students-table th {
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

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
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
  .students-header {
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