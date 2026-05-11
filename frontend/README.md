# 大学生信息系统 - 前端

## 项目介绍

本项目是大学生信息系统的前端应用，基于 Vue 3 + Vite + Vue Router 构建，提供学生、课程、成绩的管理界面，以及用户认证功能。

## 技术栈

| 技术          | 版本    | 说明       |
| ----------- | ----- | -------- |
| Vue         | 3.5+  | 前端框架     |
| Vite        | 6.0+  | 构建工具     |
| Vue Router  | 4.4+  | 路由管理     |
| Axios       | 1.6+  | HTTP 客户端   |
| Lucide Vue  | 0.26+ | 图标库      |

## 环境要求

- Node.js 18+

## 快速开始

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

开发服务器将运行在 http://localhost:3000

### 3. 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

### 4. 预览生产版本

```bash
npm run preview
```

## 项目结构

```
frontend/
├── src/
│   ├── assets/         # 资源文件（样式、图片等）
│   ├── components/     # 公共组件
│   │   └── Navbar.vue  # 导航栏组件
│   ├── views/          # 页面视图
│   │   ├── Home.vue    # 首页（数据概览）
│   │   ├── Login.vue   # 登录页
│   │   ├── Students.vue # 学生管理
│   │   ├── Courses.vue  # 课程管理
│   │   └── Grades.vue   # 成绩管理
│   ├── router/         # 路由配置
│   │   └── index.js    # 路由定义
│   ├── utils/          # 工具函数
│   │   ├── api.js      # API 请求封装
│   │   └── fieldMap.js # 字段名映射
│   ├── main.js         # 入口文件
│   ├── App.vue         # 根组件
│   └── style.css       # 全局样式
├── dist/               # 构建产物
├── index.html          # HTML模板
├── vite.config.js      # Vite配置
├── package.json        # 项目配置
└── README.md           # 项目说明
```

## 功能模块

1. **登录功能** - 用户登录、注册、忘记密码
2. **首页概览** - 数据统计展示
3. **学生管理** - 学生信息的增删改查
4. **课程管理** - 课程信息的增删改查
5. **成绩管理** - 学生成绩的增删改查

## API 调用

前端通过 Axios 调用后端 API，API 基础路径为 `/api`，通过 Vite 代理到 `http://localhost:3002`。

### 代理配置

在 `vite.config.js` 中配置：

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3002',
      changeOrigin: true
    }
  }
}
```

## 页面路由

| 路径 | 页面 | 说明 |
| ---- | ---- | ---- |
| `/` | Home.vue | 首页（需登录） |
| `/login` | Login.vue | 登录页 |
| `/students` | Students.vue | 学生管理 |
| `/courses` | Courses.vue | 课程管理 |
| `/grades` | Grades.vue | 成绩管理 |

## 开发说明

1. **确保后端服务运行**在 `http://localhost:3002`
2. **启动开发服务器**后访问 http://localhost:3000
3. **登录页面**为默认首页，未登录用户会被重定向到登录页
4. **登录后**可以访问所有功能模块

## 测试账号

- 用户名：`admin`
- 密码：`admin123`

## 前端配置

### Vite 配置

`vite.config.js` 包含以下配置：
- 开发服务器端口：3000
- API 代理到后端：`/api` -> `http://localhost:3002`
- Vue 插件支持

### 样式

使用 Tailwind CSS 风格的 CSS 变量，定义在 `src/style.css` 中。

## 构建部署

### 开发环境

```bash
npm run dev
```

### 生产环境

```bash
# 构建
npm run build

# 部署 dist 目录到静态服务器
# 例如使用 nginx、Apache 或 CDN
```

## 注意事项

1. 前端开发服务器仅用于开发，生产环境应使用构建后的静态文件
2. 确保后端服务在前端启动前已运行
3. 登录状态通过 localStorage 存储 `auth_token`
4. 页面刷新后会自动检查登录状态

## 代码规范

- 使用 Vue 3 Composition API
- 使用 `<script setup>` 语法
- 变量命名使用 camelCase
- 组件命名使用 PascalCase
- 路由路径使用 kebab-case