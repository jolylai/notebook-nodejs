---
title: Lerna
group:
  title: 协作
---

`Lerna` 是一个用于管理包含多个 package 结构的代码仓库的工具，优化工作流。新版的 vue-cli、nuxt 与 babel 均使用 lerna 进行自身的 package 管理。

## 使用场景

- 当存在一个含有多个 package 的 monorepo
- 管理这些 package 的版本与发布时
- 管理 package 共用的代码规范等配置时
- 管理 package 共用的依赖时

## 初始化

```bash
$ mkdir lerna-repo && cd $_
$ npx lerna init
```

这将会创建 `lerna.json` 配置文件和 `packages` 文件夹

```
lerna-repo/
  packages/
  package.json
  lerna.json
```

## yarn workspace

```json
// package.json
{
  "private": true,
  "workspaces": ["packages/*"]
}
```

"private": true 是必须的，workspaces 为工作空间  中所包含的项目路径，详见 workspace

```json
// lerna.json
{
  "npmClient": "yarn",
  "useWorkspaces": true
}
```

> [lerna](https://yrq110.me/post/tool/study-on-lerna/) > [lerna.js.org](https://lerna.js.org/)
