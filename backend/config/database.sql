-- ==============================================
-- 大学生信息系统数据库初始化脚本
-- 创建时间：2026年4月
-- 版本：v1.1
-- 说明：包含学生管理、课程管理、成绩管理和用户认证模块
-- ==============================================

-- ------------------------------
-- 0. 设置字符编码（解决中文插入问题）
-- ------------------------------
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET collation_connection = 'utf8mb4_unicode_ci';

-- ------------------------------
-- 1. 创建数据库
-- ------------------------------
DROP DATABASE IF EXISTS college_info_system;
CREATE DATABASE IF NOT EXISTS college_info_system 
  DEFAULT CHARACTER SET utf8mb4 
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE college_info_system;

-- ------------------------------
-- 2. 创建学生表
-- ------------------------------
CREATE TABLE IF NOT EXISTS students (
  student_id VARCHAR(20) PRIMARY KEY COMMENT '学号（主键）',
  student_name VARCHAR(50) NOT NULL COMMENT '学生姓名',
  gender ENUM('男', '女', '其他') NOT NULL COMMENT '性别',
  age TINYINT NOT NULL COMMENT '年龄',
  major VARCHAR(100) NOT NULL COMMENT '专业名称',
  class_name VARCHAR(50) COMMENT '班级名称',
  email VARCHAR(100) UNIQUE COMMENT '邮箱地址',
  phone VARCHAR(20) COMMENT '联系电话',
  address VARCHAR(255) COMMENT '家庭住址',
  enrollment_date DATE NOT NULL COMMENT '入学日期',
  status ENUM('在校', '休学', '毕业', '退学') DEFAULT '在校' COMMENT '学籍状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  -- 索引优化
  INDEX idx_student_name (student_name),
  INDEX idx_major (major),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='学生信息表';

-- ------------------------------
-- 3. 创建课程表
-- ------------------------------
CREATE TABLE IF NOT EXISTS courses (
  course_id VARCHAR(20) PRIMARY KEY COMMENT '课程编号（主键）',
  course_name VARCHAR(100) NOT NULL COMMENT '课程名称',
  credit DECIMAL(3,1) NOT NULL COMMENT '学分',
  hours INT NOT NULL COMMENT '学时',
  teacher_name VARCHAR(50) NOT NULL COMMENT '授课教师',
  teacher_title VARCHAR(20) COMMENT '教师职称',
  department VARCHAR(100) COMMENT '开课院系',
  semester VARCHAR(20) COMMENT '开课学期',
  max_students INT DEFAULT 60 COMMENT '最大选课人数',
  current_students INT DEFAULT 0 COMMENT '当前选课人数',
  status ENUM('正常', '暂停', '取消') DEFAULT '正常' COMMENT '课程状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  -- 索引优化
  INDEX idx_course_name (course_name),
  INDEX idx_teacher_name (teacher_name),
  INDEX idx_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程信息表';

-- ------------------------------
-- 4. 创建成绩表
-- ------------------------------
CREATE TABLE IF NOT EXISTS grades (
  grade_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '成绩ID（主键）',
  student_id VARCHAR(20) NOT NULL COMMENT '学号',
  student_name VARCHAR(50) NOT NULL COMMENT '学生姓名',
  course_id VARCHAR(20) NOT NULL COMMENT '课程编号',
  course_name VARCHAR(100) NOT NULL COMMENT '课程名称',
  score DECIMAL(5,1) NOT NULL COMMENT '成绩（0-100）',
  score_level ENUM('优秀', '良好', '中等', '及格', '不及格') COMMENT '成绩等级',
  remark TEXT COMMENT '备注',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  -- 主键约束
  CONSTRAINT uk_student_course UNIQUE (student_id, course_id),
  
  -- 外键约束
  CONSTRAINT fk_grade_student FOREIGN KEY (student_id) REFERENCES students(student_id),
  CONSTRAINT fk_grade_course FOREIGN KEY (course_id) REFERENCES courses(course_id),
  
  -- 索引优化
  INDEX idx_student_id (student_id),
  INDEX idx_course_id (course_id),
  INDEX idx_score (score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='成绩信息表';

-- ------------------------------
-- 5. 创建用户表
-- ------------------------------
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID（主键）',
  username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  password VARCHAR(255) NOT NULL COMMENT '密码（加密存储）',
  real_name VARCHAR(50) NOT NULL COMMENT '真实姓名',
  email VARCHAR(100) UNIQUE COMMENT '邮箱',
  phone VARCHAR(20) COMMENT '联系电话',
  role ENUM('admin', 'teacher', 'student', 'user') DEFAULT 'user' COMMENT '角色',
  avatar_url VARCHAR(255) COMMENT '头像URL',
  last_login_time DATETIME COMMENT '最后登录时间',
  login_count INT DEFAULT 0 COMMENT '登录次数',
  status ENUM('正常', '禁用') DEFAULT '正常' COMMENT '账号状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  -- 索引优化
  INDEX idx_username (username),
  INDEX idx_role (role),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户信息表';

-- ------------------------------
-- 6. 创建管理员表（扩展）
-- ------------------------------
CREATE TABLE IF NOT EXISTS admins (
  admin_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '管理员ID（主键）',
  user_id INT NOT NULL COMMENT '关联用户ID',
  department VARCHAR(100) COMMENT '所属部门',
  permissions TEXT COMMENT '权限列表（JSON格式）',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  -- 外键约束
  CONSTRAINT fk_admin_user FOREIGN KEY (user_id) REFERENCES users(user_id),
  
  -- 索引优化
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员信息表';

-- ------------------------------
-- 7. 插入测试数据
-- ------------------------------

-- 学生数据
INSERT INTO students (student_id, student_name, gender, age, major, class_name, email, phone, enrollment_date, status) VALUES
('2021001', '张三', '男', 20, '计算机科学与技术', '计科2101班', 'zhangsan@stu.edu.cn', '13800138001', '2021-09-01', '在校'),
('2021002', '李四', '女', 19, '软件工程', '软工2102班', 'lisi@stu.edu.cn', '13800138002', '2021-09-01', '在校'),
('2021003', '王五', '男', 21, '数据科学与大数据技术', '数科2101班', 'wangwu@stu.edu.cn', '13800138003', '2021-09-01', '在校'),
('2021004', '赵六', '女', 20, '人工智能', 'AI2101班', 'zhaoliu@stu.edu.cn', '13800138004', '2021-09-01', '在校'),
('2021005', '钱七', '男', 22, '计算机科学与技术', '计科2101班', 'qianqi@stu.edu.cn', '13800138005', '2021-09-01', '在校'),
('2021006', '孙八', '女', 19, '软件工程', '软工2102班', 'sunba@stu.edu.cn', '13800138006', '2021-09-01', '休学'),
('2021007', '周九', '男', 20, '数据科学与大数据技术', '数科2101班', 'zhoujiu@stu.edu.cn', '13800138007', '2021-09-01', '在校'),
('2021008', '吴十', '女', 21, '人工智能', 'AI2101班', 'wushi@stu.edu.cn', '13800138008', '2021-09-01', '在校');

-- 课程数据
INSERT INTO courses (course_id, course_name, credit, hours, teacher_name, teacher_title, department, semester, max_students, current_students) VALUES
('C001', '高等数学', 4.0, 64, '张教授', '教授', '数学学院', '2024-1', 80, 65),
('C002', '大学英语', 3.0, 48, '李老师', '讲师', '外国语学院', '2024-1', 50, 48),
('C003', '数据结构', 3.5, 56, '王教授', '教授', '计算机学院', '2024-1', 60, 55),
('C004', '操作系统', 3.0, 48, '陈老师', '副教授', '计算机学院', '2024-1', 50, 42),
('C005', '计算机网络', 3.0, 48, '刘老师', '副教授', '计算机学院', '2024-1', 55, 48),
('C006', '数据库原理', 3.0, 48, '赵教授', '教授', '计算机学院', '2024-2', 60, 0),
('C007', '软件工程', 3.5, 56, '孙老师', '副教授', '计算机学院', '2024-2', 50, 0),
('C008', '人工智能导论', 2.0, 32, '周老师', '讲师', '计算机学院', '2024-1', 40, 35);

-- 成绩数据
INSERT INTO grades (student_id, student_name, course_id, course_name, score, score_level) VALUES
('2021001', '张三', 'C001', '高等数学', 85, '良好'),
('2021001', '张三', 'C002', '大学英语', 90, '优秀'),
('2021001', '张三', 'C003', '数据结构', 88, '良好'),
('2021002', '李四', 'C001', '高等数学', 78, '中等'),
('2021002', '李四', 'C002', '大学英语', 82, '良好'),
('2021002', '李四', 'C003', '数据结构', 92, '优秀'),
('2021003', '王五', 'C001', '高等数学', 95, '优秀'),
('2021003', '王五', 'C002', '大学英语', 86, '良好'),
('2021003', '王五', 'C003', '数据结构', 90, '优秀'),
('2021004', '赵六', 'C001', '高等数学', 72, '中等'),
('2021004', '赵六', 'C002', '大学英语', 88, '良好'),
('2021004', '赵六', 'C008', '人工智能导论', 91, '优秀'),
('2021005', '钱七', 'C001', '高等数学', 65, '及格'),
('2021005', '钱七', 'C002', '大学英语', 78, '中等'),
('2021005', '钱七', 'C004', '操作系统', 70, '中等'),
('2021007', '周九', 'C001', '高等数学', 88, '良好'),
('2021007', '周九', 'C002', '大学英语', 80, '良好'),
('2021007', '周九', 'C003', '数据结构', 85, '良好'),
('2021008', '吴十', 'C001', '高等数学', 92, '优秀'),
('2021008', '吴十', 'C002', '大学英语', 95, '优秀');

-- 用户数据（密码使用明文示例，实际应使用bcrypt加密）
INSERT INTO users (username, password, real_name, email, phone, role, status) VALUES
('admin', 'admin123', '管理员', 'admin@edu.cn', '13900139000', 'admin', '正常'),
('teacher_zhang', 'teacher123', '张教授', 'zhang@edu.cn', '13900139001', 'teacher', '正常'),
('teacher_li', 'teacher123', '李老师', 'li@edu.cn', '13900139002', 'teacher', '正常'),
('2021001', 'student123', '张三', 'zhangsan@stu.edu.cn', '13800138001', 'student', '正常'),
('2021002', 'student123', '李四', 'lisi@stu.edu.cn', '13800138002', 'student', '正常'),
('2021003', 'student123', '王五', 'wangwu@stu.edu.cn', '13800138003', 'student', '正常'),
('general_user', 'user123', '普通用户', 'user@edu.cn', '13900139003', 'user', '正常');

-- 管理员数据
INSERT INTO admins (user_id, department, permissions) VALUES
(1, '教务处', '["学生管理", "课程管理", "成绩管理", "用户管理"]'),
(2, '计算机学院', '["成绩管理"]'),
(3, '外国语学院', '["成绩管理"]');

-- ------------------------------
-- 8. 查询验证
-- ------------------------------
SELECT '学生表记录数' AS table_name, COUNT(*) AS count FROM students
UNION ALL
SELECT '课程表记录数', COUNT(*) FROM courses
UNION ALL
SELECT '成绩表记录数', COUNT(*) FROM grades
UNION ALL
SELECT '用户表记录数', COUNT(*) FROM users
UNION ALL
SELECT '管理员表记录数', COUNT(*) FROM admins;

-- ==============================================
-- 数据库初始化完成！
-- ==============================================
