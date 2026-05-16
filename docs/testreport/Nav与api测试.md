# 组件与工具函数测试文档

## 1. 概述

本文档描述了前端项目中核心组件和工具函数的单元测试覆盖情况，确保导航栏组件和 API 工具函数的正确性和稳定性。

## 2. 测试模块清单

| 模块 | 文件路径 | 测试文件 | 测试用例数 |
|-----|---------|---------|-----------|
| Navbar | `src/components/Navbar.vue` | `tests/components/Navbar.test.js` | 5 |
| API Utils | `src/utils/api.js` | `tests/utils/api.test.js` | 7 |

## 3. Navbar 组件测试覆盖

### 3.1 功能概述

`Navbar` 是项目的全局导航栏组件，提供品牌展示、导航链接、用户登录状态显示和移动端菜单切换功能。

### 3.2 测试用例详细说明

| 用例名称 | 测试场景 | 验证点 |
|---------|---------|-------|
| `should render brand logo and text` | 品牌标识渲染 | logo 和文字正确显示 |
| `should display navigation links` | 导航链接显示 | 学生管理、课程管理、成绩管理、教师管理链接 |
| `should highlight active route` | 当前路由高亮 | 当前页面对应的导航链接高亮 |
| `should show login button when not logged in` | 未登录状态 | 显示登录按钮 |
| `should toggle mobile menu when clicking toggle button` | 移动端菜单 | 菜单展开和收起功能 |

### 3.3 测试覆盖范围

| 功能模块 | 测试覆盖 |
|---------|---------|
| 品牌标识 | ✓ |
| 导航链接 | ✓ |
| 路由高亮 | ✓ |
| 登录状态显示 | ✓ |
| 移动端菜单 | ✓ |
| 用户信息展示 | ✗（待补充） |
| 退出登录 | ✗（待补充） |

## 4. API 工具函数测试覆盖

### 4.1 功能概述

`api.js` 提供项目的 HTTP 请求封装，包括请求方法封装、请求缓存、错误处理等功能。

### 4.2 测试用例详细说明

| 用例名称 | 测试场景 | 验证点 |
|---------|---------|-------|
| `should export get function` | 函数导出 | get 方法正确导出 |
| `should export post function` | 函数导出 | post 方法正确导出 |
| `should export put function` | 函数导出 | put 方法正确导出 |
| `should export delete function` | 函数导出 | del 方法正确导出 |
| `should be a Map` | 缓存结构 | requestCache 是 Map 类型 |
| `should allow setting and getting cached values` | 缓存读写 | 缓存数据正确存储和读取 |
| `should invalidate cache with pattern` | 缓存失效 | 按模式清除指定缓存 |
| `should clear all cache when no pattern provided` | 缓存清空 | 无参数时清空所有缓存 |

### 4.3 API 测试覆盖

| API 方法 | 测试覆盖 |
|---------|---------|
| `get(url, params, options)` | ✓ |
| `post(url, data, options)` | ✓ |
| `put(url, data, options)` | ✓ |
| `del(url, options)` | ✓ |
| `requestCache` | ✓ |
| `invalidateCache(pattern)` | ✓ |
| `cancelAllRequests()` | ✗（待补充） |
| `cachedRequest(key, fn, cacheTime)` | ✗（待补充） |

## 5. 测试运行方式

```bash
# 运行所有测试
npm test

# 运行组件测试
npm test -- tests/components/

# 运行工具函数测试
npm test -- tests/utils/

# 生成覆盖率报告
npm run test:coverage
```

## 6. 测试结果预期

### 6.1 Navbar 预期结果

```
✓ tests/components/Navbar.test.js (5)
  ✓ Navbar
    ✓ should render brand logo and text
    ✓ should display navigation links
    ✓ should highlight active route
    ✓ should show login button when not logged in
    ✓ should toggle mobile menu when clicking toggle button
```

### 6.2 API Utils 预期结果

```
✓ tests/utils/api.test.js (7)
  ✓ api utils
    ✓ HTTP methods
      ✓ should export get function
      ✓ should export post function
      ✓ should export put function
      ✓ should export delete function
    ✓ requestCache
      ✓ should be a Map
      ✓ should allow setting and getting cached values
      ✓ should invalidate cache with pattern
      ✓ should clear all cache when no pattern provided
```

## 7. 后续测试计划

- [ ] 补充 Navbar 用户信息展示测试
- [ ] 补充 Navbar 退出登录测试
- [ ] 补充 cancelAllRequests 函数测试
- [ ] 补充 cachedRequest 函数测试
- [ ] 添加 API 拦截器测试
- [ ] 添加请求去重功能测试