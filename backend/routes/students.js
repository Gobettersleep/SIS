const express = require('express');
const router = express.Router();
const connection = require('../config/db');

// 获取所有学生
router.get('/', (req, res) => {
  connection.query('SELECT * FROM students', (err, results) => {
    if (err) {
      console.error('获取学生列表失败:', err);
      res.status(500).json({ error: '获取学生列表失败' });
      return;
    }
    res.json(results);
  });
});

// 根据ID获取学生
router.get('/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM students WHERE student_id = ?', [id], (err, results) => {
    if (err) {
      console.error('获取学生详情失败:', err);
      res.status(500).json({ error: '获取学生详情失败' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: '学生不存在' });
      return;
    }
    res.json(results[0]);
  });
});

// 添加学生
router.post('/', (req, res) => {
  const { student_id, student_name, gender, age, major, class_name, email, phone, address, enrollment_date, status } = req.body;
  // 如果没有提供入学日期，使用当前日期
  const date = enrollment_date || new Date().toISOString().split('T')[0];
  connection.query(
    'INSERT INTO students (student_id, student_name, gender, age, major, class_name, email, phone, address, enrollment_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [student_id, student_name, gender, age, major, class_name, email, phone, address, date, status || '在校'],
    (err, results) => {
      if (err) {
        console.error('添加学生失败:', err);
        res.status(500).json({ error: '添加学生失败' });
        return;
      }
      res.json({ message: '学生添加成功' });
    }
  );
});

// 更新学生
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { student_name, gender, age, major, class_name, email, phone, address, status } = req.body;
  connection.query(
    'UPDATE students SET student_name = ?, gender = ?, age = ?, major = ?, class_name = ?, email = ?, phone = ?, address = ?, status = ? WHERE student_id = ?',
    [student_name, gender, age, major, class_name, email, phone, address, status, id],
    (err, results) => {
      if (err) {
        console.error('更新学生失败:', err);
        res.status(500).json({ error: '更新学生失败' });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: '学生不存在' });
        return;
      }
      res.json({ message: '学生更新成功' });
    }
  );
});

// 删除学生（先删除关联的成绩记录）
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  console.log(`[${new Date().toISOString()}] 收到删除学生请求, student_id: ${id}`);
  
  // 先删除关联的成绩记录
  connection.query('DELETE FROM grades WHERE student_id = ?', [id], (err) => {
    if (err) {
      console.error('删除学生成绩失败:', err);
      res.status(500).json({ error: '删除学生失败' });
      return;
    }
    
    // 再删除学生
    connection.query('DELETE FROM students WHERE student_id = ?', [id], (err, results) => {
      if (err) {
        console.error('删除学生失败:', err);
        res.status(500).json({ error: '删除学生失败' });
        return;
      }
      if (results.affectedRows === 0) {
        console.log(`[${new Date().toISOString()}] 删除失败: 学生不存在, student_id: ${id}`);
        res.status(404).json({ error: '学生不存在' });
        return;
      }
      console.log(`[${new Date().toISOString()}] 学生删除成功, student_id: ${id}`);
      res.json({ message: '学生删除成功' });
    });
  });
});

module.exports = router;