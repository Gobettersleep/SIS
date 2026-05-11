require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { testConnection } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3002;

const startServer = async () => {
  try {
    await testConnection();
    
    app.use(cors());
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
    app.use((req, res, next) => {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      next();
    });

    const authRoutes = require('./routes/auth');
    const studentRoutes = require('./routes/students');
    const courseRoutes = require('./routes/courses');
    const gradeRoutes = require('./routes/grades');
    const teacherRoutes = require('./routes/teachers');
    const classRoutes = require('./routes/classes');

    app.use('/api/auth', authRoutes);
    app.use('/api/students', studentRoutes);
    app.use('/api/courses', courseRoutes);
    app.use('/api/grades', gradeRoutes);
    app.use('/api/teachers', teacherRoutes);
    app.use('/api/classes', classRoutes);

    app.get('/', (req, res) => {
      res.send('大学生信息系统后端API');
    });

    app.listen(PORT, () => {
      console.log(`\x1b[32m[成功] 服务器运行在 http://localhost:${PORT}\x1b[0m`);
      console.log(`\x1b[36m[信息] 当前环境: ${process.env.NODE_ENV || 'development'}\x1b[0m`);
    });
  } catch (err) {
    console.error(`\x1b[31m[错误] 启动服务器失败: ${err.message}\x1b[0m`);
    process.exit(1);
  }
};

startServer();