const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const auth = require('../middleware/auth');

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

router.post('/', auth, async (req, res) => {
  const { student_id, student_name, course_id, course_name, score, score_level, remark, studentId, studentName, courseId, courseName } = req.body;
  const sid = student_id || studentId || null;
  const sname = student_name || studentName || null;
  const cid = course_id || courseId || null;
  const cname = course_name || courseName || null;
  
  if (!sid || !cid) {
    return res.status(400).json({ error: '学号和课程ID不能为空' });
  }
  
  try {
    const studentExists = await query('SELECT COUNT(*) as count FROM students WHERE student_id = ?', [sid]);
    if (studentExists[0].count === 0) {
      return res.status(400).json({ error: `学号 ${sid} 不存在，请先添加学生信息` });
    }
    
    const courseExists = await query('SELECT COUNT(*) as count FROM courses WHERE course_id = ?', [cid]);
    if (courseExists[0].count === 0) {
      return res.status(400).json({ error: `课程ID ${cid} 不存在，请先添加课程信息` });
    }
    
    await query(
      'INSERT INTO grades (student_id, student_name, course_id, course_name, score, score_level, remark) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [sid, sname, cid, cname, score || null, score_level || null, remark || null]
    );
    res.json({ message: '成绩添加成功' });
  } catch (err) {
    console.error('添加成绩失败:', err);
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      res.status(400).json({ error: '学号或课程ID不存在，请检查数据后重试' });
    } else {
      res.status(500).json({ error: '添加成绩失败' });
    }
  }
});

router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { score, score_level, remark } = req.body;
  try {
    const results = await query(
      'UPDATE grades SET score = ?, score_level = ?, remark = ? WHERE grade_id = ?',
      [score || null, score_level || null, remark || null, id]
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

router.delete('/:id', auth, async (req, res) => {
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