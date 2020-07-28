# 中间件

## 写个请求日志中间件

我们使用`app.use(function)` 注册中间件，按照先注册先执行，回调函数接受两个参数，第一个是 Koa 的上下文，第二个是下一个中间件

```js
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get("X-Response-Time");
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});
```

## 洋葱模型

![The onion model](https://i.loli.net/2019/12/31/vWKldkAFD837tEw.jpg)

### 洋葱模型如何工作

```js {}
const Koa = require("koa");
const app = new Koa();

// logger
app.use(async (ctx, next) => {
  // 1
  // 日志打印开始
  console.log("logger start");

  // 等待后一个中间件执行
  await next();
  // 4
  // 后面的中间件执行完成才会执行下面的代码
  const rt = ctx.response.get("X-Response-Time");
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
  // 2
  // 响应时间开始
  const start = Date.now();

  // 等待后一个中间件执行
  await next();

  // 3
  // 后面的中间件执行完成才会执行下面的代码
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
});

// response
app.use(async ctx => {
  ctx.body = "Hello World";
});

app.listen(3000);
```

上面代码注册了日志打印和响应时间两个中间件，按照先注册先执行，首先会先执行日志打印中间件，当执行到`await next();`时

### 如何保证以洋葱模型

### 为什么要保证洋葱模型

### 为什么是洋葱模型

更加容易的使用`async/await`来编写中间件的代码

## compose

> [koa-compose](https://segmentfault.com/a/1190000016707187) > [github](https://github.com/koajs/compose)

```js
function compose(middleware) {
  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function(context, next) {
    // last called middleware #
    let index = -1;
    function dispatch(i) {
      if (i <= index)
        return Promise.reject(new Error("next() called multiple times"));
      index = i;
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return dispatch(0);

  };
}
```
