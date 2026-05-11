const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const results = await query('SELECT * FROM grades');
    const formattedResults = results.map(g => ({
      ...g,
      id: g.grade_id,
      studentId: g.student_id,
      studentName: g.student_name,
      courseId: g.course_id,
      courseName: g.course_name
    }));
    res.json(formattedResults);
  } catch (err) {
    console.error('获取成绩列表失败:', err);
    res.status(500).json({ error: '获取成绩列表失败' });
  }
});

router.get('/student/:studentId', async (req, res) => {
  const { studentId } = req.params;
  try {
    const results = await query('SELECT * FROM grades WHERE student_id = ?', [studentId]);
    const formattedResults = results.map(g => ({
      ...g,
      id: g.grade_id,
      studentId: g.student_id,
      studentName: g.student_name,
      courseId: g.course_id,
      courseName: g.course_name
    }));
    res.json(formattedResults);
  } catch (err) {
    console.error('获取学生成绩失败:', err);
    res.status(500).json({ error: '获取学生成绩失败' });
  }
});

router.post('/', async (req, res) => {
  const { student_id, student_name, course_id, course_name, score, score_level, remark, studentId, studentName, courseId, courseName } = req.body;
  const sid = student_id || studentId;
  const sname = student_name || studentName;
  const cid = course_id || courseId;
  const cname = course_name || courseName;
  try {
    await query(
      'INSERT INTO grades (student_id, student_name, course_id, course_name, score, score_level, remark) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [sid, sname, cid, cname, score, score_level, remark]
    );
    res.json({ message: '成绩添加成功' });
  } catch (err) {
    console.error('添加成绩失败:', err);
    res.status(500).json({ error: '添加成绩失败' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { score, score_level, remark } = req.body;
  try {
    const results = await query(
      'UPDATE grades SET score = ?, score_level = ?, remark = ? WHERE grade_id = ?',
      [score, score_level, remark, id]
    );
    if (results.affectedRows === 0) {
      res.status(404).json({ error: '成绩不存在' });
      return;
    }
    res.json({ message: '成绩更新成功' });
  } catch (err) {
    console.error('更新成绩失败:', err);
    res.status(500).json({ error: '更新成绩失败' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const results = await query('DELETE FROM grades WHERE grade_id = ?', [id]);
    if (results.affectedRows === 0) {
      res.status(404).json({ error: '成绩不存在' });
      return;
    }
    res.json({ message: '成绩删除成功' });
  } catch (err) {
    console.error('删除成绩失败:', err);
    res.status(500).json({ error: '删除成绩失败' });
  }
});

module.exports = router;