-- ==============================================
-- 大学生信息系统数据库初始化脚本
-- 创建时间：2026年5月
-- 版本：v2.0
-- 说明：包含学生、课程、成绩、教师、班级、选课和用户认证模块
-- ==============================================

-- ------------------------------
-- 0. 设置字符编码
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
-- 2. 创建教师表
-- ------------------------------
CREATE TABLE IF NOT EXISTS teachers (
  teacher_id VARCHAR(20) PRIMARY KEY COMMENT '教师工号（主键）',
  teacher_name VARCHAR(50) NOT NULL COMMENT '教师姓名',
  gender ENUM('男', '女', '其他') DEFAULT '男' COMMENT '性别',
  title VARCHAR(20) COMMENT '职称',
  department VARCHAR(100) COMMENT '所属院系',
  email VARCHAR(100) UNIQUE COMMENT '邮箱地址',
  phone VARCHAR(20) COMMENT '联系电话',
  status ENUM('在职', '离职', '退休') DEFAULT '在职' COMMENT '在职状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

  INDEX idx_teacher_name (teacher_name),
  INDEX idx_department (department),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='教师信息表';

-- ------------------------------
-- 3. 创建班级表
-- ------------------------------
CREATE TABLE IF NOT EXISTS classes (
  class_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '班级ID（主键）',
  class_name VARCHAR(50) NOT NULL UNIQUE COMMENT '班级名称',
  major VARCHAR(100) NOT NULL COMMENT '专业名称',
  grade_level VARCHAR(20) COMMENT '年级',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',

  INDEX idx_class_name (class_name),
  INDEX idx_major (major)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='班级信息表';

-- ------------------------------
-- 4. 创建学生表
-- ------------------------------
CREATE TABLE IF NOT EXISTS students (
  student_id VARCHAR(20) PRIMARY KEY COMMENT '学号（主键）',
  student_name VARCHAR(50) NOT NULL COMMENT '学生姓名',
  gender ENUM('男', '女', '其他') NOT NULL COMMENT '性别',
  age TINYINT NOT NULL COMMENT '年龄',
  major VARCHAR(100) NOT NULL COMMENT '专业名称',
  class_id INT COMMENT '班级ID',
  email VARCHAR(100) UNIQUE COMMENT '邮箱地址',
  phone VARCHAR(20) COMMENT '联系电话',
  address VARCHAR(255) COMMENT '家庭住址',
  enrollment_date DATE NOT NULL COMMENT '入学日期',
  status ENUM('在校', '休学', '毕业', '退学') DEFAULT '在校' COMMENT '学籍状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

  INDEX idx_student_name (student_name),
  INDEX idx_major (major),
  INDEX idx_status (status),
  INDEX idx_class_id (class_id),

  CONSTRAINT fk_student_class FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='学生信息表';

-- ------------------------------
-- 5. 创建课程表
-- ------------------------------
CREATE TABLE IF NOT EXISTS courses (
  course_id VARCHAR(20) PRIMARY KEY COMMENT '课程编号（主键）',
  course_name VARCHAR(100) NOT NULL COMMENT '课程名称',
  credit DECIMAL(3,1) NOT NULL COMMENT '学分',
  hours INT NOT NULL COMMENT '学时',
  teacher_id VARCHAR(20) COMMENT '授课教师工号',
  department VARCHAR(100) COMMENT '开课院系',
  semester VARCHAR(20) COMMENT '开课学期',
  max_students INT DEFAULT 60 COMMENT '最大选课人数',
  current_students INT DEFAULT 0 COMMENT '当前选课人数',
  status ENUM('正常', '暂停', '取消') DEFAULT '正常' COMMENT '课程状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

  INDEX idx_course_name (course_name),
  INDEX idx_teacher_id (teacher_id),
  INDEX idx_department (department),

  CONSTRAINT fk_course_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程信息表';

-- ------------------------------
-- 6. 创建成绩表
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

  CONSTRAINT uk_student_course UNIQUE (student_id, course_id),
  CONSTRAINT fk_grade_student FOREIGN KEY (student_id) REFERENCES students(student_id),
  CONSTRAINT fk_grade_course FOREIGN KEY (course_id) REFERENCES courses(course_id),

  INDEX idx_student_id (student_id),
  INDEX idx_course_id (course_id),
  INDEX idx_score (score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='成绩信息表';

-- ------------------------------
-- 7. 创建选课表
-- ------------------------------
CREATE TABLE IF NOT EXISTS course_enrollments (
  enrollment_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '选课记录ID（主键）',
  course_id VARCHAR(20) NOT NULL COMMENT '课程编号',
  student_id VARCHAR(20) NOT NULL COMMENT '学号',
  enrollment_date DATE NOT NULL COMMENT '选课日期',
  status ENUM('在读', '退课', '完成') DEFAULT '在读' COMMENT '选课状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',

  CONSTRAINT uk_course_student UNIQUE (course_id, student_id),
  CONSTRAINT fk_enrollment_course FOREIGN KEY (course_id) REFERENCES courses(course_id),
  CONSTRAINT fk_enrollment_student FOREIGN KEY (student_id) REFERENCES students(student_id),

  INDEX idx_enrollment_course (course_id),
  INDEX idx_enrollment_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='选课信息表';

-- ------------------------------
-- 8. 创建用户表
-- ------------------------------
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID（主键）',
  username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  password VARCHAR(255) NOT NULL COMMENT '密码',
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

  INDEX idx_username (username),
  INDEX idx_role (role),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户信息表';

-- ------------------------------
-- 9. 创建管理员表
-- ------------------------------
CREATE TABLE IF NOT EXISTS admins (
  admin_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '管理员ID（主键）',
  user_id INT NOT NULL COMMENT '关联用户ID',
  department VARCHAR(100) COMMENT '所属部门',
  permissions TEXT COMMENT '权限列表（JSON格式）',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

  CONSTRAINT fk_admin_user FOREIGN KEY (user_id) REFERENCES users(user_id),

  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员信息表';

-- ------------------------------
-- 10. 插入种子数据
-- ------------------------------

-- 教师数据（16位）
INSERT INTO teachers (teacher_id, teacher_name, gender, title, department, email, phone, status) VALUES
('T001', '张教授', '男', '教授', '计算机学院', 'zhangprof@edu.cn', '13900139001', '在职'),
('T002', '李老师', '女', '讲师', '外国语学院', 'liteacher@edu.cn', '13900139002', '在职'),
('T003', '王教授', '男', '教授', '计算机学院', 'wangprof@edu.cn', '13900139003', '在职'),
('T004', '陈老师', '男', '副教授', '计算机学院', 'chenteacher@edu.cn', '13900139004', '在职'),
('T005', '刘老师', '女', '副教授', '计算机学院', 'liuteacher@edu.cn', '13900139005', '在职'),
('T006', '赵教授', '男', '教授', '计算机学院', 'zhaoprof@edu.cn', '13900139006', '在职'),
('T007', '孙老师', '女', '副教授', '计算机学院', 'sunteacher@edu.cn', '13900139007', '在职'),
('T008', '周老师', '女', '讲师', '计算机学院', 'zhouteacher@edu.cn', '13900139008', '在职'),
('T009', '吴教授', '男', '教授', '数学学院', 'wuprof@edu.cn', '13900139009', '在职'),
('T010', '郑老师', '男', '副教授', '数学学院', 'zhengteacher@edu.cn', '13900139010', '在职'),
('T011', '冯老师', '女', '讲师', '外国语学院', 'fengteacher@edu.cn', '13900139011', '在职'),
('T012', '蒋教授', '男', '教授', '物理学院', 'jiangprof@edu.cn', '13900139012', '在职'),
('T013', '沈老师', '女', '副教授', '物理学院', 'shenteacher@edu.cn', '13900139013', '在职'),
('T014', '韩老师', '男', '讲师', '数学学院', 'hanteacher@edu.cn', '13900139014', '在职'),
('T015', '杨教授', '女', '教授', '外国语学院', 'yangprof@edu.cn', '13900139015', '在职'),
('T016', '朱老师', '男', '副教授', '计算机学院', 'zhuteacher@edu.cn', '13900139016', '在职');

-- 班级数据（10个）
INSERT INTO classes (class_id, class_name, major, grade_level) VALUES
(1, '计科2101班', '计算机科学与技术', '2021级'),
(2, '计科2102班', '计算机科学与技术', '2021级'),
(3, '软工2101班', '软件工程', '2021级'),
(4, '软工2102班', '软件工程', '2021级'),
(5, '数科2101班', '数据科学与大数据技术', '2021级'),
(6, 'AI2101班', '人工智能', '2021级'),
(7, '计科2201班', '计算机科学与技术', '2022级'),
(8, '软工2201班', '软件工程', '2022级'),
(9, '数科2201班', '数据科学与大数据技术', '2022级'),
(10, 'AI2201班', '人工智能', '2022级');

-- 学生数据（100+人）
INSERT INTO students (student_id, student_name, gender, age, major, class_id, email, phone, enrollment_date, status) VALUES
('2021001', '张三', '男', 20, '计算机科学与技术', 1, 'zhangsan@stu.edu.cn', '13800138001', '2021-09-01', '在校'),
('2021002', '李四', '女', 19, '软件工程', 4, 'lisi@stu.edu.cn', '13800138002', '2021-09-01', '在校'),
('2021003', '王五', '男', 21, '数据科学与大数据技术', 5, 'wangwu@stu.edu.cn', '13800138003', '2021-09-01', '在校'),
('2021004', '赵六', '女', 20, '人工智能', 6, 'zhaoliu@stu.edu.cn', '13800138004', '2021-09-01', '在校'),
('2021005', '钱七', '男', 22, '计算机科学与技术', 1, 'qianqi@stu.edu.cn', '13800138005', '2021-09-01', '在校'),
('2021006', '孙八', '女', 19, '软件工程', 4, 'sunba@stu.edu.cn', '13800138006', '2021-09-01', '休学'),
('2021007', '周九', '男', 20, '数据科学与大数据技术', 5, 'zhoujiu@stu.edu.cn', '13800138007', '2021-09-01', '在校'),
('2021008', '吴十', '女', 21, '人工智能', 6, 'wushi@stu.edu.cn', '13800138008', '2021-09-01', '在校'),
('2021009', '郑明', '男', 20, '计算机科学与技术', 2, 'zhengming@stu.edu.cn', '13800138009', '2021-09-01', '在校'),
('2021010', '王芳', '女', 19, '计算机科学与技术', 2, 'wangfang@stu.edu.cn', '13800138010', '2021-09-01', '在校'),
('2021011', '刘洋', '男', 21, '计算机科学与技术', 1, 'liuyang1@stu.edu.cn', '13800138011', '2021-09-01', '在校'),
('2021012', '陈静', '女', 20, '计算机科学与技术', 1, 'chenjing@stu.edu.cn', '13800138012', '2021-09-01', '在校'),
('2021013', '杨磊', '男', 19, '软件工程', 3, 'yanglei@stu.edu.cn', '13800138013', '2021-09-01', '在校'),
('2021014', '黄丽', '女', 21, '软件工程', 3, 'huangli@stu.edu.cn', '13800138014', '2021-09-01', '在校'),
('2021015', '周杰', '男', 20, '软件工程', 4, 'zhoujie@stu.edu.cn', '13800138015', '2021-09-01', '在校'),
('2021016', '吴敏', '女', 19, '软件工程', 4, 'wumin@stu.edu.cn', '13800138016', '2021-09-01', '在校'),
('2021017', '徐涛', '男', 21, '数据科学与大数据技术', 5, 'xutao@stu.edu.cn', '13800138017', '2021-09-01', '在校'),
('2021018', '孙悦', '女', 20, '数据科学与大数据技术', 5, 'sunyue@stu.edu.cn', '13800138018', '2021-09-01', '在校'),
('2021019', '马超', '男', 19, '人工智能', 6, 'machao@stu.edu.cn', '13800138019', '2021-09-01', '在校'),
('2021020', '胡雪', '女', 21, '人工智能', 6, 'huxue@stu.edu.cn', '13800138020', '2021-09-01', '在校'),
('2021021', '林峰', '男', 20, '计算机科学与技术', 1, 'linfeng@stu.edu.cn', '13800138021', '2021-09-01', '在校'),
('2021022', '何雨', '女', 19, '计算机科学与技术', 2, 'heyu@stu.edu.cn', '13800138022', '2021-09-01', '在校'),
('2021023', '郭强', '男', 21, '计算机科学与技术', 2, 'guoqiang@stu.edu.cn', '13800138023', '2021-09-01', '在校'),
('2021024', '罗琳', '女', 20, '计算机科学与技术', 1, 'luolin@stu.edu.cn', '13800138024', '2021-09-01', '在校'),
('2021025', '梁伟', '男', 19, '软件工程', 3, 'liangwei@stu.edu.cn', '13800138025', '2021-09-01', '在校'),
('2021026', '宋佳', '女', 21, '软件工程', 3, 'songjia@stu.edu.cn', '13800138026', '2021-09-01', '在校'),
('2021027', '唐骏', '男', 20, '软件工程', 4, 'tangjun@stu.edu.cn', '13800138027', '2021-09-01', '在校'),
('2021028', '韩冰', '女', 19, '软件工程', 4, 'hanbing@stu.edu.cn', '13800138028', '2021-09-01', '在校'),
('2021029', '冯刚', '男', 21, '数据科学与大数据技术', 5, 'fenggang@stu.edu.cn', '13800138029', '2021-09-01', '在校'),
('2021030', '曹莹', '女', 20, '数据科学与大数据技术', 5, 'caoying@stu.edu.cn', '13800138030', '2021-09-01', '在校'),
('2021031', '邓辉', '男', 19, '人工智能', 6, 'denghui@stu.edu.cn', '13800138031', '2021-09-01', '在校'),
('2021032', '彭丹', '女', 21, '人工智能', 6, 'pengdan@stu.edu.cn', '13800138032', '2021-09-01', '在校'),
('2021033', '萧然', '男', 20, '计算机科学与技术', 1, 'xiaoran@stu.edu.cn', '13800138033', '2021-09-01', '在校'),
('2021034', '田蜜', '女', 19, '计算机科学与技术', 2, 'tianmi@stu.edu.cn', '13800138034', '2021-09-01', '在校'),
('2021035', '董力', '男', 21, '计算机科学与技术', 2, 'dongli@stu.edu.cn', '13800138035', '2021-09-01', '在校'),
('2021036', '袁媛', '女', 20, '计算机科学与技术', 1, 'yuanyuan@stu.edu.cn', '13800138036', '2021-09-01', '在校'),
('2021037', '邓超', '男', 19, '软件工程', 3, 'dengchao@stu.edu.cn', '13800138037', '2021-09-01', '在校'),
('2021038', '傅红', '女', 21, '软件工程', 3, 'fuhong@stu.edu.cn', '13800138038', '2021-09-01', '在校'),
('2021039', '沈鹏', '男', 20, '软件工程', 4, 'shenpeng@stu.edu.cn', '13800138039', '2021-09-01', '在校'),
('2021040', '曾倩', '女', 19, '软件工程', 4, 'zengqian@stu.edu.cn', '13800138040', '2021-09-01', '在校'),
('2021041', '卢山', '男', 21, '数据科学与大数据技术', 5, 'lushan@stu.edu.cn', '13800138041', '2021-09-01', '在校'),
('2021042', '蒋梅', '女', 20, '数据科学与大数据技术', 5, 'jiangmei@stu.edu.cn', '13800138042', '2021-09-01', '在校'),
('2021043', '蔡林', '男', 19, '人工智能', 6, 'cailin@stu.edu.cn', '13800138043', '2021-09-01', '在校'),
('2021044', '贾玲', '女', 21, '人工智能', 6, 'jialing@stu.edu.cn', '13800138044', '2021-09-01', '在校'),
('2021045', '丁一', '男', 20, '计算机科学与技术', 1, 'dingyi@stu.edu.cn', '13800138045', '2021-09-01', '在校'),
('2021046', '魏芳', '女', 19, '计算机科学与技术', 2, 'weifang@stu.edu.cn', '13800138046', '2021-09-01', '在校'),
('2021047', '薛涛', '男', 21, '计算机科学与技术', 2, 'xuetao@stu.edu.cn', '13800138047', '2021-09-01', '在校'),
('2021048', '叶舒', '女', 20, '计算机科学与技术', 1, 'yeshu@stu.edu.cn', '13800138048', '2021-09-01', '在校'),
('2021049', '阎刚', '男', 19, '软件工程', 3, 'yangang@stu.edu.cn', '13800138049', '2021-09-01', '在校'),
('2021050', '余曼', '女', 21, '软件工程', 4, 'yuman@stu.edu.cn', '13800138050', '2021-09-01', '在校'),
('2021051', '潘越', '男', 20, '数据科学与大数据技术', 5, 'panyue@stu.edu.cn', '13800138051', '2021-09-01', '在校'),
('2021052', '杜悦', '女', 19, '人工智能', 6, 'duyue@stu.edu.cn', '13800138052', '2021-09-01', '在校'),
('2022001', '戴安', '男', 19, '计算机科学与技术', 7, 'daian@stu.edu.cn', '13800138053', '2022-09-01', '在校'),
('2022002', '夏天', '女', 18, '计算机科学与技术', 7, 'xiatian@stu.edu.cn', '13800138054', '2022-09-01', '在校'),
('2022003', '白玉', '女', 19, '计算机科学与技术', 7, 'baiyu@stu.edu.cn', '13800138055', '2022-09-01', '在校'),
('2022004', '巩磊', '男', 18, '计算机科学与技术', 7, 'gonglei@stu.edu.cn', '13800138056', '2022-09-01', '在校'),
('2022005', '熊英', '女', 19, '计算机科学与技术', 7, 'xiongying@stu.edu.cn', '13800138057', '2022-09-01', '在校'),
('2022006', '纪元', '男', 18, '软件工程', 8, 'jiyuan@stu.edu.cn', '13800138058', '2022-09-01', '在校'),
('2022007', '柳青', '女', 19, '软件工程', 8, 'liuqing@stu.edu.cn', '13800138059', '2022-09-01', '在校'),
('2022008', '邹华', '男', 18, '软件工程', 8, 'zouhua@stu.edu.cn', '13800138060', '2022-09-01', '在校'),
('2022009', '苏瑞', '女', 19, '软件工程', 8, 'surui@stu.edu.cn', '13800138061', '2022-09-01', '在校'),
('2022010', '尤军', '男', 18, '软件工程', 8, 'youjun@stu.edu.cn', '13800138062', '2022-09-01', '在校'),
('2022011', '许文', '女', 19, '数据科学与大数据技术', 9, 'xuwen@stu.edu.cn', '13800138063', '2022-09-01', '在校'),
('2022012', '何平', '男', 18, '数据科学与大数据技术', 9, 'heping@stu.edu.cn', '13800138064', '2022-09-01', '在校'),
('2022013', '吕峰', '男', 19, '数据科学与大数据技术', 9, 'lvfeng@stu.edu.cn', '13800138065', '2022-09-01', '在校'),
('2022014', '施婉', '女', 18, '数据科学与大数据技术', 9, 'shiwan@stu.edu.cn', '13800138066', '2022-09-01', '在校'),
('2022015', '张晨', '男', 19, '数据科学与大数据技术', 9, 'zhangchen@stu.edu.cn', '13800138067', '2022-09-01', '在校'),
('2022016', '孔琳', '女', 18, '人工智能', 10, 'konglin@stu.edu.cn', '13800138068', '2022-09-01', '在校'),
('2022017', '曹阳', '男', 19, '人工智能', 10, 'caoyang@stu.edu.cn', '13800138069', '2022-09-01', '在校'),
('2022018', '严峻', '男', 18, '人工智能', 10, 'yanjun@stu.edu.cn', '13800138070', '2022-09-01', '在校'),
('2022019', '华丽', '女', 19, '人工智能', 10, 'huali@stu.edu.cn', '13800138071', '2022-09-01', '在校'),
('2022020', '陶然', '男', 18, '人工智能', 10, 'taoran@stu.edu.cn', '13800138072', '2022-09-01', '在校'),
('2022021', '姜维', '男', 19, '计算机科学与技术', 7, 'jiangwei@stu.edu.cn', '13800138073', '2022-09-01', '在校'),
('2022022', '戚薇', '女', 18, '计算机科学与技术', 7, 'qiwei@stu.edu.cn', '13800138074', '2022-09-01', '在校'),
('2022023', '谢安', '男', 19, '计算机科学与技术', 7, 'xiean@stu.edu.cn', '13800138075', '2022-09-01', '在校'),
('2022024', '邹敏', '女', 18, '计算机科学与技术', 7, 'zoumin@stu.edu.cn', '13800138076', '2022-09-01', '在校'),
('2022025', '柏林', '男', 19, '计算机科学与技术', 7, 'bolin@stu.edu.cn', '13800138077', '2022-09-01', '在校'),
('2022026', '水清', '女', 18, '软件工程', 8, 'shuiqing@stu.edu.cn', '13800138078', '2022-09-01', '在校'),
('2022027', '窦鹏', '男', 19, '软件工程', 8, 'doupeng@stu.edu.cn', '13800138079', '2022-09-01', '在校'),
('2022028', '章亮', '男', 18, '软件工程', 8, 'zhangliang@stu.edu.cn', '13800138080', '2022-09-01', '在校'),
('2022029', '云裳', '女', 19, '软件工程', 8, 'yunshang@stu.edu.cn', '13800138081', '2022-09-01', '在校'),
('2022030', '葛洪', '男', 18, '软件工程', 8, 'gehong@stu.edu.cn', '13800138082', '2022-09-01', '在校'),
('2022031', '奚梦', '女', 19, '数据科学与大数据技术', 9, 'ximeng@stu.edu.cn', '13800138083', '2022-09-01', '在校'),
('2022032', '范剑', '男', 18, '数据科学与大数据技术', 9, 'fanjian@stu.edu.cn', '13800138084', '2022-09-01', '在校'),
('2022033', '方媛', '女', 19, '数据科学与大数据技术', 9, 'fangyuan@stu.edu.cn', '13800138085', '2022-09-01', '在校'),
('2022034', '石化', '男', 18, '数据科学与大数据技术', 9, 'shihua@stu.edu.cn', '13800138086', '2022-09-01', '在校'),
('2022035', '雷声', '男', 19, '数据科学与大数据技术', 9, 'leisheng@stu.edu.cn', '13800138087', '2022-09-01', '在校'),
('2022036', '贺兰', '女', 18, '人工智能', 10, 'helan@stu.edu.cn', '13800138088', '2022-09-01', '在校'),
('2022037', '严冬', '男', 19, '人工智能', 10, 'yandong@stu.edu.cn', '13800138089', '2022-09-01', '在校'),
('2022038', '倪春', '女', 18, '人工智能', 10, 'nichun@stu.edu.cn', '13800138090', '2022-09-01', '在校'),
('2022039', '汤沐', '男', 19, '人工智能', 10, 'tangmu@stu.edu.cn', '13800138091', '2022-09-01', '在校'),
('2022040', '滕飞', '男', 18, '人工智能', 10, 'tengfei@stu.edu.cn', '13800138092', '2022-09-01', '在校'),
('2022041', '殷实', '男', 19, '计算机科学与技术', 7, 'yinshi@stu.edu.cn', '13800138093', '2022-09-01', '在校'),
('2022042', '罗浩', '男', 18, '计算机科学与技术', 7, 'luohao@stu.edu.cn', '13800138094', '2022-09-01', '在校'),
('2022043', '毕胜', '男', 19, '软件工程', 8, 'bisheng@stu.edu.cn', '13800138095', '2022-09-01', '在校'),
('2022044', '郝思', '女', 18, '软件工程', 8, 'haosi@stu.edu.cn', '13800138096', '2022-09-01', '在校'),
('2022045', '邬君', '男', 19, '数据科学与大数据技术', 9, 'wujun@stu.edu.cn', '13800138097', '2022-09-01', '在校'),
('2022046', '安琪', '女', 18, '人工智能', 10, 'anqi@stu.edu.cn', '13800138098', '2022-09-01', '在校'),
('2022047', '常乐', '男', 19, '计算机科学与技术', 7, 'changle@stu.edu.cn', '13800138099', '2022-09-01', '在校'),
('2022048', '季风', '女', 18, '软件工程', 8, 'jifeng@stu.edu.cn', '13800138100', '2022-09-01', '在校'),
('2022049', '简明', '男', 19, '数据科学与大数据技术', 9, 'jianming@stu.edu.cn', '13800138101', '2022-09-01', '在校'),
('2022050', '时雨', '女', 18, '人工智能', 10, 'shiyu@stu.edu.cn', '13800138102', '2022-09-01', '在校');

-- 课程数据
INSERT INTO courses (course_id, course_name, credit, hours, teacher_id, department, semester, max_students, current_students) VALUES
('C001', '高等数学', 4.0, 64, 'T009', '数学学院', '2024-1', 80, 65),
('C002', '大学英语', 3.0, 48, 'T002', '外国语学院', '2024-1', 50, 48),
('C003', '数据结构', 3.5, 56, 'T003', '计算机学院', '2024-1', 60, 55),
('C004', '操作系统', 3.0, 48, 'T004', '计算机学院', '2024-1', 50, 42),
('C005', '计算机网络', 3.0, 48, 'T005', '计算机学院', '2024-1', 55, 48),
('C006', '数据库原理', 3.0, 48, 'T006', '计算机学院', '2024-2', 60, 0),
('C007', '软件工程', 3.5, 56, 'T007', '计算机学院', '2024-2', 50, 0),
('C008', '人工智能导论', 2.0, 32, 'T008', '计算机学院', '2024-1', 40, 35),
('C009', '线性代数', 3.0, 48, 'T010', '数学学院', '2024-1', 70, 60),
('C010', '大学物理', 4.0, 64, 'T012', '物理学院', '2024-1', 75, 55),
('C011', '编译原理', 3.0, 48, 'T016', '计算机学院', '2024-2', 50, 0),
('C012', '英语口语', 2.0, 32, 'T011', '外国语学院', '2024-1', 40, 30),
('C013', '概率论', 3.0, 48, 'T014', '数学学院', '2024-2', 60, 0),
('C014', '量子力学', 3.5, 56, 'T013', '物理学院', '2024-2', 45, 0),
('C015', '高级英语', 3.0, 48, 'T015', '外国语学院', '2024-2', 50, 0);

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
('2021008', '吴十', 'C002', '大学英语', 95, '优秀'),
('2021009', '郑明', 'C009', '线性代数', 88, '良好'),
('2021009', '郑明', 'C010', '大学物理', 76, '中等'),
('2021010', '王芳', 'C009', '线性代数', 91, '优秀'),
('2021010', '王芳', 'C010', '大学物理', 83, '良好'),
('2021011', '刘洋', 'C005', '计算机网络', 79, '中等'),
('2021012', '陈静', 'C005', '计算机网络', 85, '良好'),
('2021013', '杨磊', 'C004', '操作系统', 82, '良好'),
('2021014', '黄丽', 'C004', '操作系统', 74, '中等'),
('2021015', '周杰', 'C009', '线性代数', 68, '及格'),
('2021016', '吴敏', 'C010', '大学物理', 90, '优秀'),
('2021017', '徐涛', 'C008', '人工智能导论', 84, '良好'),
('2021021', '林峰', 'C012', '英语口语', 86, '良好'),
('2022001', '戴安', 'C012', '英语口语', 78, '中等');

-- 选课数据
INSERT INTO course_enrollments (course_id, student_id, enrollment_date, status) VALUES
('C001', '2021001', '2024-02-20', '在读'),
('C001', '2021002', '2024-02-20', '在读'),
('C001', '2021003', '2024-02-20', '在读'),
('C001', '2021004', '2024-02-20', '在读'),
('C001', '2021005', '2024-02-20', '在读'),
('C001', '2021007', '2024-02-20', '在读'),
('C001', '2021008', '2024-02-20', '在读'),
('C002', '2021001', '2024-02-20', '在读'),
('C002', '2021002', '2024-02-20', '在读'),
('C002', '2021003', '2024-02-20', '在读'),
('C002', '2021004', '2024-02-20', '在读'),
('C002', '2021005', '2024-02-20', '在读'),
('C002', '2021007', '2024-02-20', '在读'),
('C002', '2021008', '2024-02-20', '在读'),
('C003', '2021001', '2024-02-20', '在读'),
('C003', '2021002', '2024-02-20', '在读'),
('C003', '2021003', '2024-02-20', '在读'),
('C003', '2021007', '2024-02-20', '在读'),
('C004', '2021005', '2024-02-20', '在读'),
('C004', '2021013', '2024-02-20', '在读'),
('C004', '2021014', '2024-02-20', '在读'),
('C005', '2021011', '2024-02-20', '在读'),
('C005', '2021012', '2024-02-20', '在读'),
('C008', '2021004', '2024-02-20', '在读'),
('C008', '2021017', '2024-02-20', '在读'),
('C009', '2021009', '2024-02-20', '在读'),
('C009', '2021010', '2024-02-20', '在读'),
('C009', '2021015', '2024-02-20', '在读'),
('C010', '2021009', '2024-02-20', '在读'),
('C010', '2021010', '2024-02-20', '在读'),
('C010', '2021016', '2024-02-20', '在读'),
('C012', '2021021', '2024-02-20', '在读'),
('C012', '2022001', '2024-02-20', '在读');

-- 用户数据
INSERT INTO users (username, password, real_name, email, phone, role, status) VALUES
('admin', 'admin123', '管理员', 'admin@edu.cn', '13900139000', 'admin', '正常'),
('teacher_zhang', 'teacher123', '张教授', 'zhang@edu.cn', '13900139001', 'teacher', '正常'),
('teacher_li', 'teacher123', '李老师', 'li@edu.cn', '13900139002', 'teacher', '正常'),
('teacher_wang', 'teacher123', '王教授', 'wang@edu.cn', '13900139003', 'teacher', '正常'),
('2021001', 'student123', '张三', 'zhangsan@stu.edu.cn', '13800138001', 'student', '正常'),
('2021002', 'student123', '李四', 'lisi@stu.edu.cn', '13800138002', 'student', '正常'),
('2021003', 'student123', '王五', 'wangwu@stu.edu.cn', '13800138003', 'student', '正常'),
('general_user', 'user123', '普通用户', 'user@edu.cn', '13900139003', 'user', '正常');

-- 管理员数据
INSERT INTO admins (user_id, department, permissions) VALUES
(1, '教务处', '["学生管理", "课程管理", "成绩管理", "教师管理", "班级管理", "用户管理"]'),
(2, '计算机学院', '["成绩管理"]'),
(3, '外国语学院', '["成绩管理"]');

-- ------------------------------
-- 11. 查询验证
-- ------------------------------
SELECT '教师表记录数' AS table_name, COUNT(*) AS count FROM teachers
UNION ALL
SELECT '班级表记录数', COUNT(*) FROM classes
UNION ALL
SELECT '学生表记录数', COUNT(*) FROM students
UNION ALL
SELECT '课程表记录数', COUNT(*) FROM courses
UNION ALL
SELECT '成绩表记录数', COUNT(*) FROM grades
UNION ALL
SELECT '选课表记录数', COUNT(*) FROM course_enrollments
UNION ALL
SELECT '用户表记录数', COUNT(*) FROM users
UNION ALL
SELECT '管理员表记录数', COUNT(*) FROM admins;

-- ==============================================
-- 数据库初始化完成！
-- ==============================================
