## Turbo
（全称 Turborepo）是一个专为 JavaScript 和 TypeScript 项目设计的高性能构建系统，尤其擅长管理 Monorepo（单体仓库）架构

# 开发
pnpm dev                    # 启动所有 dev server

# 检查
pnpm lint                   # 代码规范检查
pnpm format:check           # 格式检查

# 修复
pnpm lint:fix               # 自动修复 lint 问题
pnpm format                 # 自动格式化代码

# 构建
pnpm build                  # 构建所有包

# 发布
pnpm changeset              # 记录变更
pnpm version                # 升版本号
pnpm release                # 构建 + 发布