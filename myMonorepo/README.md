# myMonorepo

基于 **pnpm workspace + Turborepo** 的多包 Monorepo 脚手架，集成了完整的开发、构建、代码质量和发布工作流。

## 技术栈

| 类别       | 工具                                  | 版本                    |
| ---------- | ------------------------------------- | ----------------------- |
| 包管理器   | pnpm                                  | 10.34.4                 |
| 构建编排   | Turborepo(调度任务\智能缓存\并行执行) | ^2.10.9                 |
| 打包工具   | Vite                                  | ^8.2.0                  |
| 前端框架   | React                                 | ^19.2.8                 |
| 编程语言   | TypeScript                            | ~6.0.2                  |
| 代码检查   | ESLint                                | ^10.8.1（flat config）  |
| 代码格式化 | Prettier                              | ^3.9.6                  |
| Git Hooks  | Husky + lint-staged                   | ^9.1.7 / ^17.3.0        |
| 提交规范   | commitlint                            | ^21.2.1（conventional） |
| 版本发布   | Changesets                            | ^2.31.1                 |
| CI         | GitHub Actions                        | Node 22.18.0            |

## 项目结构

```
myMonorepo/
├── apps/
│   ├── web/                   # 主应用 (@my-org/web)
│   └── testWeb/               # 测试应用 (testweb)
├── packages/
│   ├── ui/                    # 共享 UI 组件库 (@my-org/ui)
│   └── utils/                 # 共享工具函数库 (@my-org/utils)
├── .changeset/                # Changesets 配置
├── .github/workflows/         # CI 配置
├── .husky/                    # Git hooks
├── turbo.json                 # Turborepo 管道配置
├── pnpm-workspace.yaml        # pnpm 工作区定义
└── tsconfig.base.json         # 共享 TypeScript 基础配置
```

## 依赖关系

```
apps/web ──────────┐
                   ├──▶ @my-org/ui ──▶ @my-org/utils
apps/testWeb ──────┘         │
                             └──▶ @my-org/utils
```

所有包通过 `workspace:*` 协议链接，Turborepo 自动处理构建顺序。

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器（所有应用）
pnpm dev

# 仅启动某个应用
pnpm --filter @my-org/web dev
```

## 常用命令

### 开发

```bash
pnpm dev                         # 启动所有 dev server
pnpm --filter <包名> dev          # 启动指定包的 dev server
```

### 代码质量

```bash
pnpm lint                        # 代码规范检查
pnpm lint:fix                    # 自动修复 lint 问题
pnpm format:check                # 格式检查
pnpm format                      # 自动格式化代码
```

### 构建

```bash
pnpm build                       # 构建所有包（自动按依赖顺序）
pnpm --filter @my-org/ui build   # 仅构建指定包
```

### 版本发布

```bash
pnpm changeset                   # 记录变更
pnpm version                     # 升版本号
pnpm release                     # 构建 + 发布到 npm
```

## Turbo 管道

```
lint ──▶ build ──▶ test
         (输出: dist/*)
dev（无缓存，持久运行）
```

- `build` 依赖上游包先构建（`^build`）且 lint 通过
- `test` 依赖 build 完成
- `dev` 不使用缓存，支持持久化运行
- 本地缓存位于 `.turbo/cache/`，CI 支持远程缓存

## 共享包说明

### @my-org/utils

通用工具函数库：

- `formatPrice(price: number)` — 格式化为 `¥XX.XX`
- `formatDate(date: Date)` — 中文日期格式化

### @my-org/ui

共享 React 组件库：

- `Button` — 按钮组件，支持 `label`、`price`、`onClick` 属性

## 代码质量保障

1. **Pre-commit**：Husky + lint-staged 自动对暂存文件执行 ESLint 修复和 Prettier 格式化
2. **Commit 规范**：commitlint 强制 conventional commits 格式
3. **CI 流水线**：install → lint → test → build → type-check
4. **构建缓存**：Turborepo 增量构建，跳过未变更的包

## 配置说明

| 配置项               | 说明                                                                   |
| -------------------- | ---------------------------------------------------------------------- |
| `.npmrc`             | `shamefully-hoist=true`（扁平化 node_modules）、关闭严格 peer 检查     |
| `.prettierrc`        | 无分号、单引号、2 空格缩进、尾逗号、100 字符行宽                       |
| `eslint.config.js`   | flat config 格式，集成 typescript-eslint、react-hooks、react-refresh   |
| `tsconfig.base.json` | ES2020 target、ESNext modules、bundler 解析、strict 模式、生成声明文件 |

## 如何新增一个包

1. 在 `packages/` 或 `apps/` 下创建新目录
2. 初始化 `package.json`，name 使用 `@my-org/xxx` 范围
3. 创建 `tsconfig.json` 并继承根目录 `tsconfig.base.json`
4. 在需要引用的包中添加 `"@my-org/xxx": "workspace:*"` 依赖
5. 运行 `pnpm install` 完成链接

## 作为脚手架使用

本项目可以直接作为多包开发的脚手架模板，具备以下特点：

✅ **开箱即用的工程化配置** — ESLint、Prettier、TypeScript、Husky 全部预配置  
✅ **规范化的提交和发布流程** — commitlint + Changesets  
✅ **高效的构建系统** — Turborepo 增量构建 + 缓存  
✅ **灵活的包组织方式** — apps（应用）与 packages（共享库）分离  
✅ **CI/CD 就绪** — GitHub Actions 流水线已配置  
✅ **现代化技术选型** — React 19 + TypeScript 6 + Vite 8 + ESLint flat config

使用方式：

```bash
# 克隆仓库
git clone <repo-url> my-project
cd my-project

# 移除 git 历史，重新初始化
rm -rf .git
git init

# 安装依赖
pnpm install

# 修改 @my-org 为你自己的 scope
# 全局替换 package.json 中的 @my-org 为 @your-org
```

## License

MIT
