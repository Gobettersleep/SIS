# 大学生信息系统前端

## 技术栈
- Vue 3
- Vite
- Vue Router
- Axios

## 环境要求
- Node.js 14+

## 安装依赖
```bash
npm install
```

## 启动开发服务器
```bash
npm run dev
```

开发服务器将运行在 http://localhost:3000

## 构建生产版本
```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

## 预览生产版本
```bash
npm run preview
```

## 项目结构
```
├── src/
│   ├── assets/         # 资源文件
│   ├── components/     # 公共组件
│   │   └── Navbar.vue  # 导航栏组件
│   ├── views/          # 页面视图
│   │   ├── Home.vue    # 首页
│   │   ├── Login.vue   # 登录页
│   │   ├── Students.vue # 学生管理
│   │   ├── Courses.vue  # 课程管理
│   │   └── Grades.vue   # 成绩管理
│   ├── router/         # 路由配置
│   │   └── index.js    # 路由定义
│   ├── main.js         # 入口文件
│   ├── App.vue         # 根组件
│   └── style.css       # 全局样式
├── dist/               # 构建产物
├── index.html          # HTML模板
├── vite.config.js      # Vite配置
└── package.json        # 项目配置
```

## 功能模块
1. **登录功能** - 用户登录系统
2. **学生管理** - 学生信息的增删改查
3. **课程管理** - 课程信息的增删改查
4. **成绩管理** - 学生成绩的增删改查

## API调用
前端通过Axios调用后端API，API基础路径为 `/api`，代理到 `http://localhost:3002`。

## 开发说明
1. 确保后端服务运行在 `http://localhost:3002`
2. 启动开发服务器后访问 http://localhost:3000
3. 登录页面为默认首页