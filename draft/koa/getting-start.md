---
title: 快速上手
order: 1
---

## 安装

创建一个 `koa-demo` 项目

```bash
mkdir koa-demo
cd koa-demo
yarn init -y
yarn add koa
```

Koa 依赖 node v7.6.0 或 ES2015 及更高版本和 async 方法支持.

## Hello World

创建`index.js`文件

```js
const Koa = require('koa');

const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);
```

启动服务

```shell
node index.js
```

仅用上面的几行代码就能启动一个服务
