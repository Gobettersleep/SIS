const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const results = await query('SELECT * FROM classes');
    const formattedResults = results.map(c => ({
      ...c,
      id: c.class_id,
      name: c.class_name
    }));
    res.json(formattedResults);
  } catch (err) {
    console.error('获取班级列表失败:', err);
    res.status(500).json({ error: '获取班级列表失败' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const results = await query('SELECT * FROM classes WHERE class_id = ?', [id]);
    if (results.length === 0) {
      res.status(404).json({ error: '班级不存在' });
      return;
    }
    const cls = results[0];
    res.json({ ...cls, id: cls.class_id, name: cls.class_name });
  } catch (err) {
    console.error('获取班级详情失败:', err);
    res.status(500).json({ error: '获取班级详情失败' });
  }
});

router.post('/', auth, async (req, res) => {
  const { class_name, major, grade_level, name } = req.body;
  const cname = class_name || name;

  if (!cname || !major) {
    return res.status(400).json({ error: '班级名称和专业为必填项' });
  }

  try {
    await query(
      'INSERT INTO classes (class_name, major, grade_level) VALUES (?, ?, ?)',
      [cname, major, grade_level || null]
    );
    res.json({ message: '班级添加成功' });
  } catch (err) {
    console.error('添加班级失败:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: `班级名称 ${cname} 已存在` });
    } else {
      res.status(500).json({ error: '添加班级失败' });
    }
  }
});

router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { class_name, major, grade_level, name } = req.body;
  const cname = class_name || name;
  try {
    const results = await query(
      'UPDATE classes SET class_name = ?, major = ?, grade_level = ? WHERE class_id = ?',
      [cname, major, grade_level, id]
    );
    if (results.affectedRows === 0) {
      res.status(404).json({ error: '班级不存在' });
      return;
    }
    res.json({ message: '班级更新成功' });
  } catch (err) {
    console.error('更新班级失败:', err);
    res.status(500).json({ error: '更新班级失败' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    await query('UPDATE students SET class_id = NULL WHERE class_id = ?', [id]);
    const results = await query('DELETE FROM classes WHERE class_id = ?', [id]);
    if (results.affectedRows === 0) {
      res.status(404).json({ error: '班级不存在' });
      return;
    }
    res.json({ message: '班级删除成功' });
  } catch (err) {
    console.error('删除班级失败:', err);
    res.status(500).json({ error: '删除班级失败' });
  }
});

module.exports = router;
