---
title: yarn
---

## 发布 npm 包

```shell
yarn publish --new-version 1.0.0  --registry https://registry.npmjs.org --access public
```

## 创建项目

```shell
yarn create react-app my-app
```

For example, yarn create react-app my-app is equivalent to:

1. Install `create-<starter-kit-package>` globally, or update the package to the latest version if it already exists
2. Run the executable located in the bin field of the starter kit’s package.json, forwarding any `<args>`to it

```shell
$ yarn global add create-react-app
$ create-react-app my-app
```
