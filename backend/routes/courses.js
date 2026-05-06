const express = require('express');
const router = express.Router();
const connection = require('../config/db');

// 获取所有课程
router.get('/', (req, res) => {
  connection.query('SELECT * FROM courses', (err, results) => {
    if (err) {
      console.error('获取课程列表失败:', err);
      res.status(500).json({ error: '获取课程列表失败' });
      return;
    }
    res.json(results);
  });
});

// 根据ID获取课程
router.get('/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM courses WHERE course_id = ?', [id], (err, results) => {
    if (err) {
      console.error('获取课程详情失败:', err);
      res.status(500).json({ error: '获取课程详情失败' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: '课程不存在' });
      return;
    }
    res.json(results[0]);
  });
});

// 添加课程
router.post('/', (req, res) => {
  const { course_id, course_name, credit, hours, teacher_name, teacher_title, department, semester, max_students, current_students, status } = req.body;
  connection.query(
    'INSERT INTO courses (course_id, course_name, credit, hours, teacher_name, teacher_title, department, semester, max_students, current_students, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [course_id, course_name, credit, hours, teacher_name, teacher_title, department, semester, max_students || 60, current_students || 0, status || '正常'],
    (err, results) => {
      if (err) {
        console.error('添加课程失败:', err);
        res.status(500).json({ error: '添加课程失败' });
        return;
      }
      res.json({ message: '课程添加成功' });
    }
  );
});

// 更新课程
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { course_name, credit, hours, teacher_name, teacher_title, department, semester, max_students, current_students, status } = req.body;
  connection.query(
    'UPDATE courses SET course_name = ?, credit = ?, hours = ?, teacher_name = ?, teacher_title = ?, department = ?, semester = ?, max_students = ?, current_students = ?, status = ? WHERE course_id = ?',
    [course_name, credit, hours, teacher_name, teacher_title, department, semester, max_students, current_students, status, id],
    (err, results) => {
      if (err) {
        console.error('更新课程失败:', err);
        res.status(500).json({ error: '更新课程失败' });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: '课程不存在' });
        return;
      }
      res.json({ message: '课程更新成功' });
    }
  );
});

// 删除课程（先删除关联的成绩记录）
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  // 先删除关联的成绩记录
  connection.query('DELETE FROM grades WHERE course_id = ?', [id], (err) => {
    if (err) {
      console.error('删除课程成绩失败:', err);
      res.status(500).json({ error: '删除课程失败' });
      return;
    }
    
    // 再删除课程
    connection.query('DELETE FROM courses WHERE course_id = ?', [id], (err, results) => {
      if (err) {
        console.error('删除课程失败:', err);
        res.status(500).json({ error: '删除课程失败' });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: '课程不存在' });
        return;
      }
      res.json({ message: '课程删除成功' });
    });
  });
});

module.exports = router;