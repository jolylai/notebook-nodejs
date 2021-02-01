---
title: 路由
---

## 安装

```shell
yarn add koa-router
```

## 基本使用

```js
var Koa = require('koa');
var Router = require('koa-router');

var app = new Koa();
var router = new Router();

router.get('/', (ctx, next) => {
  // ctx.router available
});

app.use(router.routes()).use(router.allowedMethods());
```

## 路由方法

```js
router
  .get('/', (ctx, next) => {
    ctx.body = 'Hello World!';
  })
  .post('/users', (ctx, next) => {
    // ...
  })
  .put('/users/:id', (ctx, next) => {
    // ...
  })
  .del('/users/:id', (ctx, next) => {
    // ...
  });

// 支持所有方法
router.all('/users/:id', (ctx, next) => {
  // ...
});
```

## 动态路由

```js
router.get('/user/:id', ctx => {
  // {id: '1'}
  console.log(ctx.params);
  ctx.body = 'koa';
});
```

分页请求

```shell
curl http://localhost:3000/user?limit=10&page=12
```

路由方法

```js
router.get('/user', ctx => {
  console.log(ctx.query);
  ctx.body = 'koa';
});
```

## 中间件

```js
// session middleware will run before authorize
router.use(session()).use(authorize());

// use middleware only with given path
router.use('/users', userAuth());

// or with an array of paths
router.use(['/users', '/admin'], userAuth());

app.use(router.routes());
```

## 版本控制

**为什么需要版本控制**

由于业务逻辑的更改，接口返回的数据作了对应的变更，但是为支持未升级的老版本客户端，我们需要作兼容的处理，最多三个版本号唯怡
太多的版本号不易于管理

**如何携带版本号**

- 路径上：`/v1/user/list`
- 查询参数上： `/user/list?version=1`
- header 上

## 自动加载

> [require-directory](https://www.npmjs.com/package/require-directory)

```js
const requireDirectory = require('require-directory');
module.exports = requireDirectory(module, './some/subdirectory');
```
