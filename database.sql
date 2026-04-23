-- 创建数据库
CREATE DATABASE IF NOT EXISTS college_info_system;

-- 使用数据库
USE college_info_system;

-- 创建学生表
CREATE TABLE IF NOT EXISTS students (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  gender VARCHAR(20) NOT NULL,
  age INT NOT NULL,
  major VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建课程表
CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  credit DECIMAL(3,1) NOT NULL,
  hours INT NOT NULL,
  teacher VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建成绩表
CREATE TABLE IF NOT EXISTS grades (
  studentId VARCHAR(20) NOT NULL,
  studentName VARCHAR(50) NOT NULL,
  courseId VARCHAR(20) NOT NULL,
  courseName VARCHAR(100) NOT NULL,
  score DECIMAL(5,1) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (studentId, courseId)
);

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入测试数据
-- 学生数据
INSERT INTO students (id, name, gender, age, major) VALUES
('2021001', '张三', '男', 20, '计算机科学与技术'),
('2021002', '李四', '女', 19, '软件工程'),
('2021003', '王五', '男', 21, '数据科学与大数据技术');

-- 课程数据
INSERT INTO courses (id, name, credit, hours, teacher) VALUES
('C001', '高等数学', 4.0, 64, '张教授'),
('C002', '大学英语', 3.0, 48, '李老师'),
('C003', '数据结构', 3.5, 56, '王教授');

-- 成绩数据
INSERT INTO grades (studentId, studentName, courseId, courseName, score) VALUES
('2021001', '张三', 'C001', '高等数学', 85),
('2021001', '张三', 'C002', '大学英语', 90),
('2021002', '李四', 'C001', '高等数学', 78),
('2021002', '李四', 'C003', '数据结构', 92);

-- 用户数据
INSERT INTO users (username, password, role) VALUES
('admin', 'admin123', 'admin'),
('user', 'user123', 'user');