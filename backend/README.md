# 大学生信息系统 - 后端服务

## 项目介绍

本项目是大学生信息系统的后端服务，基于 Node.js + Express + MySQL 构建，提供学生、课程、成绩的 CRUD 操作 API。

## 技术栈

| 技术      | 版本    | 说明       |
| ------- | ----- | -------- |
| Node.js | 18+   | 运行环境     |
| Express | 4.18+ | Web 框架   |
| MySQL   | 8.0+  | 数据库      |
| mysql2  | 3.9+  | MySQL 驱动 |
| cors    | 2.8+  | 跨域中间件    |

## 快速开始

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置数据库

1. 启动MySQL
2. 创建数据库

```sql
CREATE DATABASE IF NOT EXISTS college_info_system 
DEFAULT CHARACTER SET utf8mb4 
DEFAULT COLLATE utf8mb4_unicode_ci;
```

1. 导入初始化数据：

```bash
mysql -u root -p college_info_system < config/database.sql
```

### 3. 配置数据库连接

编辑 `config/db.js`，修改数据库连接信息：

```javascript
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'college_info_system',
  charset: 'utf8mb4'
});
```

### 4. 启动服务

```bash
npm start
```

服务将在 `http://localhost:3002` 启动。

## API 接口

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
  "student_id": "2021001",
  "student_name": "张三",
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
  "course_id": "C001",
  "course_name": "高等数学",
  "credits": 4,
  "hours": 64,
  "teacher_name": "李教授",
  "teacher_title": "教授",
  "department": "数学系",
  "semester": "2024-2025学年第一学期",
  "description": "高等数学基础课程"
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
  "student_id": "2021001",
  "student_name": "张三",
  "course_id": "C001",
  "course_name": "高等数学",
  "score": 92.5,
  "score_level": "优秀",
  "remark": "成绩优秀"
}
```

## 项目结构

```
backend/
├── config/           # 配置文件
│   ├── db.js         # 数据库连接配置
│   └── database.sql  # 数据库初始化脚本
├── routes/           # API 路由
│   ├── students.js   # 学生管理路由
│   ├── courses.js    # 课程管理路由
│   └── grades.js     # 成绩管理路由
├── app.js            # 应用入口
├── package.json      # 项目配置
└── README.md         # 项目说明
```

## 数据库结构

### students 表（学生信息表）

| 字段名              | 类型           | 说明     |
| ---------------- | ------------ | ------ |
| student\_id      | VARCHAR(20)  | 学号（主键） |
| student\_name    | VARCHAR(50)  | 学生姓名   |
| gender           | VARCHAR(10)  | 性别     |
| age              | INT          | 年龄     |
| major            | VARCHAR(100) | 专业     |
| class\_name      | VARCHAR(50)  | 班级     |
| email            | VARCHAR(100) | 邮箱     |
| phone            | VARCHAR(20)  | 电话     |
| address          | VARCHAR(255) | 地址     |
| enrollment\_date | DATE         | 入学日期   |
| status           | VARCHAR(20)  | 学籍状态   |

### courses 表（课程信息表）

| 字段名            | 类型           | 说明       |
| -------------- | ------------ | -------- |
| course\_id     | VARCHAR(20)  | 课程编号（主键） |
| course\_name   | VARCHAR(100) | 课程名称     |
| credits        | DECIMAL(3,1) | 学分       |
| hours          | INT          | 学时       |
| teacher\_name  | VARCHAR(50)  | 教师姓名     |
| teacher\_title | VARCHAR(20)  | 教师职称     |
| department     | VARCHAR(50)  | 所属院系     |
| semester       | VARCHAR(50)  | 开课学期     |
| description    | TEXT         | 课程描述     |

### grades 表（成绩信息表）

| 字段名           | 类型           | 说明          |
| ------------- | ------------ | ----------- |
| grade\_id     | INT          | 成绩ID（主键，自增） |
| student\_id   | VARCHAR(20)  | 学号（外键）      |
| student\_name | VARCHAR(50)  | 学生姓名        |
| course\_id    | VARCHAR(20)  | 课程编号（外键）    |
| course\_name  | VARCHAR(100) | 课程名称        |
| score         | DECIMAL(5,1) | 成绩          |
| score\_level  | ENUM         | 成绩等级        |
| remark        | TEXT         | 备注          |

## 注意事项

1. 确保 MySQL 服务已启动，端口为默认端口 3306
2. 数据库连接密码需要根据实际情况修改
3. 删除学生或课程时，会自动级联删除关联的成绩记录
4. 所有接口支持跨域访问

