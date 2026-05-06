const express = require('express');
const router = express.Router();
const connection = require('../config/db');

// 获取所有成绩
router.get('/', (req, res) => {
  connection.query('SELECT * FROM grades', (err, results) => {
    if (err) {
      console.error('获取成绩列表失败:', err);
      res.status(500).json({ error: '获取成绩列表失败' });
      return;
    }
    res.json(results);
  });
});

// 根据学生ID获取成绩
router.get('/student/:studentId', (req, res) => {
  const { studentId } = req.params;
  connection.query('SELECT * FROM grades WHERE student_id = ?', [studentId], (err, results) => {
    if (err) {
      console.error('获取学生成绩失败:', err);
      res.status(500).json({ error: '获取学生成绩失败' });
      return;
    }
    res.json(results);
  });
});

// 添加成绩
router.post('/', (req, res) => {
  const { student_id, student_name, course_id, course_name, score, score_level, remark } = req.body;
  connection.query(
    'INSERT INTO grades (student_id, student_name, course_id, course_name, score, score_level, remark) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [student_id, student_name, course_id, course_name, score, score_level, remark],
    (err, results) => {
      if (err) {
        console.error('添加成绩失败:', err);
        res.status(500).json({ error: '添加成绩失败' });
        return;
      }
      res.json({ message: '成绩添加成功' });
    }
  );
});

// 更新成绩
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { score, score_level, remark } = req.body;
  connection.query(
    'UPDATE grades SET score = ?, score_level = ?, remark = ? WHERE grade_id = ?',
    [score, score_level, remark, id],
    (err, results) => {
      if (err) {
        console.error('更新成绩失败:', err);
        res.status(500).json({ error: '更新成绩失败' });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: '成绩不存在' });
        return;
      }
      res.json({ message: '成绩更新成功' });
    }
  );
});

// 删除成绩
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM grades WHERE grade_id = ?', [id], (err, results) => {
    if (err) {
      console.error('删除成绩失败:', err);
      res.status(500).json({ error: '删除成绩失败' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: '成绩不存在' });
      return;
    }
    res.json({ message: '成绩删除成功' });
  });
});

module.exports = router;