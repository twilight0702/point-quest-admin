# point-quest-admin

Point Quest 管理后台，负责任务、投稿、奖励、奖池、订单等管理配置与审核流程。

## 功能概览

- 管理员登录与会话保持（JWT + 本地缓存）
- 任务管理：新增、编辑、列表展示
- 投稿管理：列表、详情查看
- 奖励管理：新增、编辑、列表展示
- 奖池管理：新增、编辑、列表展示
- 订单管理：列表、详情查看

## 技术栈

- Vue 3 + Vite + TypeScript
- Pinia、Vue Router
- Element Plus、Axios
- ESLint + Prettier

## 目录结构

```
src/
  api/        # 接口封装与模块
  layouts/    # 布局
  router/     # 路由与鉴权
  stores/     # 状态管理
  styles/     # 全局样式
  utils/      # 工具方法
  views/      # 页面
```

## 环境要求

- Node.js: ^20.19.0 或 >=22.12.0
- pnpm

## 快速开始

```sh
pnpm install
pnpm dev
```

## 常用脚本

```sh
pnpm build       # 打包
pnpm preview     # 本地预览
pnpm type-check  # 类型检查
pnpm lint        # 代码检查
pnpm format      # 格式化
```

## 环境变量

在根目录创建 `.env` 或 `.env.local`：

```env
VITE_API_BASE_URL=http://localhost:3000
```

## 鉴权说明

- 登录成功后，JWT 会写入本地存储，路由守卫会在进入 `/admin` 相关页面前校验登录状态。
- 后端需返回管理员角色信息（`role: "ADMIN"`）以通过权限校验。
