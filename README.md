# 大学生信息系统

> 基于 Vue 3 + Node.js + MySQL 的大学生信息管理系统

## 技术栈

| 分类  | 技术         | 版本    |
| --- | ---------- | ----- |
| 前端  | Vue        | 3.5+  |
| 构建  | Vite       | 6.0+  |
| 路由  | Vue Router | 4.4+  |
| HTTP  | Axios      | 1.6+  |
| 后端  | Express    | 4.18+ |
| 数据库 | MySQL      | 8.0+  |

## 功能特性

- ✅ **学生管理**：查询、添加、修改、删除
- ✅ **课程管理**：查询、添加、修改、删除
- ✅ **成绩管理**：查询、添加、修改、删除
- ✅ **用户认证**：登录、注册、忘记密码
- ✅ **数据统计**：首页概览统计

## 快速开始

### 1. 环境要求

- Node.js 18+
- MySQL 8.0+

### 2. 后端启动

```bash
cd backend
npm install
npm start
# 服务运行在 http://localhost:3002
```

### 3. 前端启动

```bash
cd frontend
npm install
npm run dev
# 服务运行在 http://localhost:3000
```

### 4. 数据库配置

创建 `backend/.env` 文件（参考 `backend/.env.example`）：

```env
PORT=3002
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=college_info_system
DB_CHARSET=utf8mb4
```

### 5. 数据库初始化

```sql
CREATE DATABASE IF NOT EXISTS college_info_system 
DEFAULT CHARACTER SET utf8mb4 
DEFAULT COLLATE utf8mb4_unicode_ci;
```

导入初始化数据：
```bash
mysql -u root -p college_info_system < backend/config/database.sql
```

## 项目结构

```
SIS/
├── frontend/          # 前端代码
│   ├── src/
│   │   ├── views/     # 页面组件
│   │   ├── router/    # 路由配置
│   │   ├── utils/     # 工具函数
│   │   └── components/# 公共组件
│   ├── vite.config.js # Vite配置
│   └── README.md      # 前端说明
├── backend/           # 后端代码
│   ├── routes/        # API路由
│   ├── config/        # 配置文件
│   ├── .env           # 环境变量（需创建）
│   ├── .env.example   # 环境变量模板
│   ├── .gitignore     # Git忽略配置
│   ├── app.js         # 应用入口
│   └── README.md      # 后端说明
└── README.md          # 项目总说明
```

## API 接口

| 模块 | 接口              | 方法                  |
| -- | --------------- | ------------------- |
| 认证 | `/api/auth/login` | POST |
| 认证 | `/api/auth/register` | POST |
| 认证 | `/api/auth/forgot-password` | POST |
| 学生 | `/api/students` | GET/POST/PUT/DELETE |
| 课程 | `/api/courses`  | GET/POST/PUT/DELETE |
| 成绩 | `/api/grades`   | GET/POST/PUT/DELETE |

## 测试账号

- 用户名：`admin`
- 密码：`admin123`

## 部署说明

### 开发环境

```bash
# 启动后端
cd backend && npm start

# 启动前端（新终端）
cd frontend && npm run dev
```

### 生产环境

```bash
# 构建前端
cd frontend && npm run build

# 设置环境变量
export NODE_ENV=production
export DB_PASSWORD=your_secure_password

# 启动后端
cd backend && npm start
```

## 安全注意事项

1. **不要提交 `.env` 文件**到版本控制
2. **使用强密码**保护数据库
3. 生产环境使用专用数据库用户（非 root）
4. 考虑使用 SSL/TLS 加密数据库连接

## 团队成员

| 姓名        | 负责模块        |
| --------- | ----------- |
| 刘文钦       | 登录、首页、导航栏   |
| 魏成杰，刘文钦   | 学生、课程管理     |
| 魏成杰，李会杰   | 成绩管理、路由     |
| 李会杰       | 后端API、数据库   |
| 杨致远，李会杰      | 前端搭建、文档编写   |