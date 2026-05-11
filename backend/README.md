# 大学生信息系统 - 后端服务

## 项目介绍

本项目是大学生信息系统的后端服务，基于 Node.js + Express + MySQL 构建，提供学生、课程、成绩的 CRUD 操作 API，以及用户认证功能。

## 技术栈

| 技术      | 版本    | 说明       |
| ------- | ----- | -------- |
| Node.js | 18+   | 运行环境     |
| Express | 4.18+ | Web 框架   |
| MySQL   | 8.0+  | 数据库      |
| mysql2  | 3.9+  | MySQL 驱动 |
| cors    | 2.8+  | 跨域中间件    |
| dotenv  | 16+   | 环境变量管理   |

## 快速开始

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置数据库

1. 启动 MySQL
2. 创建数据库

```sql
CREATE DATABASE IF NOT EXISTS college_info_system 
DEFAULT CHARACTER SET utf8mb4 
DEFAULT COLLATE utf8mb4_unicode_ci;
```

3. 导入初始化数据：

```bash
mysql -u root -p college_info_system < config/database.sql
```

### 3. 配置环境变量

创建 `.env` 文件（参考 `.env.example`）：

```env
PORT=3002
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=college_info_system
DB_CHARSET=utf8mb4
```

### 4. 启动服务

```bash
npm start
```

服务将在 `http://localhost:3002` 启动。

### 5. 环境变量说明

| 变量名 | 说明 | 默认值 |
| ------ | ---- | ------ |
| PORT | 服务端口 | 3002 |
| DB_HOST | 数据库主机 | localhost |
| DB_USER | 数据库用户名 | root |
| DB_PASSWORD | 数据库密码 | - |
| DB_NAME | 数据库名称 | college_info_system |
| DB_CHARSET | 数据库字符集 | utf8mb4 |
| NODE_ENV | 运行环境 | development |

## API 接口

### 认证接口

| 方法     | 接口                  | 描述       |
| ------ | ------------------- | -------- |
| POST   | `/api/auth/login`   | 用户登录    |
| POST   | `/api/auth/register` | 用户注册    |
| POST   | `/api/auth/forgot-password` | 忘记密码   |

#### POST /api/auth/login 请求示例

```json
{
  "username": "admin",
  "password": "admin123"
}
```

#### POST /api/auth/register 请求示例

```json
{
  "username": "newuser",
  "password": "password123"
}
```

### 学生管理

| 方法     | 接口                  | 描述       |
| ------ | ------------------- | -------- |
| GET    | `/api/students`     | 获取所有学生列表 |
| GET    | `/api/students/:id` | 获取单个学生详情 |
| POST   | `/api/students`     | 添加新学生    |
| PUT    | `/api/students/:id` | 更新学生信息   |
| DELETE | `/api/students/:id` | 删除学生     |

#### POST /api/students 请求示例

```json
{
  "id": "2021001",
  "name": "张三",
  "gender": "男",
  "age": 20,
  "major": "计算机科学",
  "class_name": "计科2101",
  "email": "zhangsan@stu.edu.cn",
  "phone": "13800138000",
  "address": "北京市",
  "enrollment_date": "2021-09-01",
  "status": "在校"
}
```

### 课程管理

| 方法     | 接口                 | 描述       |
| ------ | ------------------ | -------- |
| GET    | `/api/courses`     | 获取所有课程列表 |
| GET    | `/api/courses/:id` | 获取单个课程详情 |
| POST   | `/api/courses`     | 添加新课程    |
| PUT    | `/api/courses/:id` | 更新课程信息   |
| DELETE | `/api/courses/:id` | 删除课程     |

#### POST /api/courses 请求示例

```json
{
  "id": "C001",
  "name": "高等数学",
  "credit": 4,
  "hours": 64,
  "teacher": "李教授",
  "teacher_title": "教授",
  "department": "数学系",
  "semester": "2024-2025学年第一学期"
}
```

### 成绩管理

| 方法     | 接口                | 描述       |
| ------ | ----------------- | -------- |
| GET    | `/api/grades`     | 获取所有成绩列表 |
| GET    | `/api/grades/:id` | 获取单个成绩详情 |
| POST   | `/api/grades`     | 添加新成绩    |
| PUT    | `/api/grades/:id` | 更新成绩信息   |
| DELETE | `/api/grades/:id` | 删除成绩     |

#### POST /api/grades 请求示例

```json
{
  "studentId": "2021001",
  "studentName": "张三",
  "courseId": "C001",
  "courseName": "高等数学",
  "score": 92.5
}
```

## 项目结构

```
backend/
├── config/           # 配置文件
│   ├── db.js         # 数据库连接配置
│   └── database.sql  # 数据库初始化脚本
├── routes/           # API 路由
│   ├── auth.js       # 认证路由
│   ├── students.js   # 学生管理路由
│   ├── courses.js    # 课程管理路由
│   └── grades.js     # 成绩管理路由
├── app.js            # 应用入口
├── package.json      # 项目配置
├── .env              # 环境变量（需创建）
├── .env.example      # 环境变量模板
├── .gitignore        # Git忽略配置
└── README.md         # 项目说明
```

## 数据库结构

### students 表（学生信息表）

| 字段名              | 类型           | 说明     |
| ---------------- | ------------ | ------ |
| student_id       | VARCHAR(20)  | 学号（主键） |
| student_name     | VARCHAR(50)  | 学生姓名   |
| gender           | ENUM         | 性别     |
| age              | TINYINT      | 年龄     |
| major            | VARCHAR(100) | 专业     |
| class_name       | VARCHAR(50)  | 班级     |
| email            | VARCHAR(100) | 邮箱（唯一） |
| phone            | VARCHAR(20)  | 电话     |
| address          | VARCHAR(255) | 地址     |
| enrollment_date  | DATE         | 入学日期   |
| status           | ENUM         | 学籍状态   |
| created_at       | TIMESTAMP    | 创建时间   |
| updated_at       | TIMESTAMP    | 更新时间   |

### courses 表（课程信息表）

| 字段名            | 类型           | 说明       |
| -------------- | ------------ | -------- |
| course_id      | VARCHAR(20)  | 课程编号（主键） |
| course_name    | VARCHAR(100) | 课程名称     |
| credit         | DECIMAL(3,1) | 学分       |
| hours          | INT          | 学时       |
| teacher_name   | VARCHAR(50)  | 教师姓名     |
| teacher_title  | VARCHAR(20)  | 教师职称     |
| department     | VARCHAR(50)  | 所属院系     |
| semester       | VARCHAR(50)  | 开课学期     |
| max_students   | INT          | 最大选课人数   |
| current_students | INT        | 当前选课人数   |
| status         | VARCHAR(20)  | 课程状态     |

### grades 表（成绩信息表）

| 字段名           | 类型           | 说明          |
| ------------- | ------------ | ----------- |
| grade_id      | INT          | 成绩ID（主键，自增） |
| student_id    | VARCHAR(20)  | 学号（外键）      |
| student_name  | VARCHAR(50)  | 学生姓名        |
| course_id     | VARCHAR(20)  | 课程编号（外键）    |
| course_name   | VARCHAR(100) | 课程名称        |
| score         | DECIMAL(5,1) | 成绩          |
| score_level   | ENUM         | 成绩等级        |
| remark        | TEXT         | 备注          |

### users 表（用户信息表）

| 字段名           | 类型           | 说明       |
| ------------- | ------------ | -------- |
| user_id       | INT          | 用户ID（主键，自增） |
| username      | VARCHAR(50)  | 用户名（唯一）   |
| password_hash | VARCHAR(255) | 密码哈希     |
| real_name     | VARCHAR(50)  | 真实姓名     |
| role          | VARCHAR(20)  | 用户角色     |
| email         | VARCHAR(100) | 邮箱       |

## 安全注意事项

1. **不要提交 `.env` 文件**到版本控制，已在 `.gitignore` 中排除
2. **使用强密码**保护数据库，避免使用默认密码
3. 生产环境使用专用数据库用户（非 root），授予最小权限
4. 考虑使用环境变量或密钥管理服务存储敏感信息
5. 生产环境设置 `NODE_ENV=production`

## 启动检查

服务启动时会自动执行以下检查：

1. 检查必要的环境变量是否存在
2. 测试数据库连接是否正常
3. 生产环境下检查是否使用默认密码

如果检查失败，服务会自动退出并显示错误信息。