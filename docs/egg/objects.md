# 内置对象

![](https://raw.githubusercontent.com/jolylai/material/master/egg-objects.png)

## Request

> [Koa Request](https://koajs.com/#request)

## Helper

Helper 用来提供一些实用的 utility 函数。它的作用在于我们可以将一些常用的动作抽离在 helper.js 里面成为一个独立的函数，这样可以用 JavaScript 来写复杂的逻辑，避免逻辑分散各处，同时可以更好的编写测试用例。

### 自定义 helper 方法

```js
// app/extend/helper.js
const moment = require("moment");
exports.ago = function(date) {
  date = moment(date);

  return date.fromNow();
};
```

### 获取方式

可以在 Context 的实例上获取到当前请求的 Helper(ctx.helper) 实例。

```js
class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = ctx.helper.ago("2019-12-12");
  }
}
```

## Logger

logger 对象都提供了 4 个级别的方法：

- `logger.debug()`
- `logger.info()`
- `logger.warn()`
- `logger.error()`

### App Logger

我们可以通过 `app.logger` 来获取到它，如果我们想**做一些应用级别的日志记录**，如记录启动阶段的一些数据信息，记录一些业务上与请求无关的信息，都可以通过 App Logger 来完成。

### App CoreLogger

我们可以通过 `app.coreLogger` 来获取到它，一般我们在开发应用时都不应该通过 CoreLogger 打印日志，**而框架和插件则需要通过它来打印应用级别的日志**，这样可以更清晰的区分应用和框架打印的日志，通过 CoreLogger 打印的日志会放到和 Logger 不同的文件中。

### Context Logger

我们可以通过 `ctx.logger` 从 Context 实例上获取到它，从访问方式上我们可以看出来，Context Logger 一定是与请求相关的，它打印的日志都会在前面带上一些当前请求相关的信息（如 `[$userId/$ip/$traceId/${cost}ms $method $url]`），通过这些信息，我们可以从日志快速定位请求，并串联一次请求中的所有的日志。

### Context CoreLogger

我们可以通过 `ctx.coreLogger` 获取到它，和 Context Logger 的区别是一般只有插件和框架会通过它来记录日志。

### Controller Logger & Service Logger

我们可以在 Controller 和 Service 实例上通过 this.logger 获取到它们，它们本质上就是一个 Context Logger，不过在打印日志的时候还会额外的加上文件路径，方便定位日志的打印位置。
