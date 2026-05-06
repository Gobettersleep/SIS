# 大学生信息系统

> 基于 Vue 3 + Node.js + MySQL 的大学生信息管理系统

## 技术栈

| 分类  | 技术         | 版本    |
| --- | ---------- | ----- |
| 前端  | Vue        | 3.5+  |
| 构建  | Vite       | 6.0+  |
| 路由  | Vue Router | 4.4+  |
| 后端  | Express    | 4.18+ |
| 数据库 | MySQL      | 8.0+  |

## 功能特性

- ✅ **学生管理**：查询、添加、修改、删除
- ✅ **课程管理**：查询、添加、修改、删除
- ✅ **成绩管理**：查询、添加、修改、删除
- ✅ **用户登录**：登录、注册、忘记密码
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

修改 `backend/.env`：

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=college_info_system
```

## 项目结构

```
SIS/
├── frontend/          # 前端代码
│   ├── src/
│   │   ├── views/     # 页面组件
│   │   ├── router/    # 路由配置
│   │   └── components/# 公共组件
│   └── vite.config.js
├── backend/           # 后端代码
│   ├── routes/        # API路由
│   ├── config/        # 配置文件
│   └── app.js
└── docs/              # 项目文档
```

## API 接口

| 模块 | 接口              | 方法                  |
| -- | --------------- | ------------------- |
| 学生 | `/api/students` | GET/POST/PUT/DELETE |
| 课程 | `/api/courses`  | GET/POST/PUT/DELETE |
| 成绩 | `/api/grades`   | GET/POST/PUT/DELETE |

## 团队成员

| 姓名        | 负责模块        |
| --------- | ----------- |
| 刘文钦       | 登录、首页、导航栏   |
| 魏成杰，刘文钦   | 学生、课程管理     |
| 魏成杰，李会杰   | 成绩管理、路由     |
| 李会杰       | 后端API、数据库   |
| 杨致远，李会杰      | 前端搭建、文档编写   |

