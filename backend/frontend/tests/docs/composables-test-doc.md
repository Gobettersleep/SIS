# Composables 测试文档

## 1. 概述

本文档描述了前端项目中核心 composables 的单元测试覆盖情况，确保 Toast 消息提示和 Confirm 确认对话框功能的正确性和稳定性。

## 2. 测试模块清单

| 模块 | 文件路径 | 测试文件 | 测试用例数 |
|-----|---------|---------|-----------|
| useToast | `src/composables/useToast.js` | `tests/composables/useToast.test.js` | 5 |
| useConfirm | `src/composables/useConfirm.js` | `tests/composables/useConfirm.test.js` | 4 |

## 3. useToast 测试覆盖

### 3.1 功能概述

`useToast` 是全局消息提示组件，支持多种消息类型（success/error/warning/info），具有自动消失和手动关闭功能。

### 3.2 测试用例详细说明

| 用例名称 | 测试场景 | 验证点 |
|---------|---------|-------|
| `should add toast with default type` | 添加默认类型消息 | 消息数量、消息内容、默认类型为 info |
| `should add toast with success type` | 添加成功消息 | 消息类型为 success |
| `should add toast with error type` | 添加错误消息 | 消息类型为 error |
| `should remove toast by id` | 手动移除消息 | 移除后消息列表为空 |
| `should auto remove toast after duration` | 自动消失功能 | 超时后消息自动移除 |

### 3.3 API 测试覆盖

| API 方法 | 测试覆盖 |
|---------|---------|
| `add(message, type, duration)` | ✓ |
| `remove(id)` | ✓ |
| `success(message, duration)` | ✓ |
| `error(message, duration)` | ✓ |
| `warning(message, duration)` | ✗（待补充） |
| `info(message, duration)` | ✓ |

## 4. useConfirm 测试覆盖

### 4.1 功能概述

`useConfirm` 是全局确认对话框组件，用于重要操作前的二次确认，返回 Promise 处理用户选择。

### 4.2 测试用例详细说明

| 用例名称 | 测试场景 | 验证点 |
|---------|---------|-------|
| `should show confirm dialog with default options` | 默认配置显示 | 对话框可见、默认标题和消息 |
| `should show confirm dialog with custom options` | 自定义配置显示 | 自定义标题、消息、按钮文字 |
| `should resolve with true when confirmed` | 点击确认按钮 | Promise resolve 为 true，对话框隐藏 |
| `should resolve with false when cancelled` | 点击取消按钮 | Promise resolve 为 false，对话框隐藏 |

### 4.3 API 测试覆盖

| API 方法 | 测试覆盖 |
|---------|---------|
| `show(options)` | ✓ |
| `confirm()` | ✓ |
| `cancel()` | ✓ |

## 5. 测试运行方式

```bash
# 运行所有 composables 测试
npm test -- tests/composables/

# 运行单个测试文件
npm test -- tests/composables/useToast.test.js

# 生成覆盖率报告
npm run test:coverage
```

## 6. 测试结果预期

### 6.1 useToast 预期结果

```
✓ tests/composables/useToast.test.js (5)
  ✓ useToast
    ✓ should add toast with default type
    ✓ should add toast with success type
    ✓ should add toast with error type
    ✓ should remove toast by id
    ✓ should auto remove toast after duration
```

### 6.2 useConfirm 预期结果

```
✓ tests/composables/useConfirm.test.js (4)
  ✓ useConfirm
    ✓ should show confirm dialog with default options
    ✓ should show confirm dialog with custom options
    ✓ should resolve with true when confirmed
    ✓ should resolve with false when cancelled
```

## 7. 后续测试计划

- [ ] 补充 `useToast.warning()` 方法测试
- [ ] 补充异常边界场景测试
- [ ] 添加并发调用场景测试
- [ ] 添加组件集成测试