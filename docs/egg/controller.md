# 控制器

Controller 负责解析用户的输入，处理后返回相应的结果

## 属性

```js
class HomeController extends Controller {
  async index() {
    const { ctx, app, service, config. logger } = this;
  }
}
```

- `this.ctx`： 当前请求的上下文 Context 对象的实例，通过它我们可以拿到框架封装好的处理当前请求的各种便捷属性和方法。
- `this.app`： 当前应用 Application 对象的实例，通过它我们可以拿到框架提供的全局对象和方法。
- `this.service`：应用定义的 Service，通过它我们可以访问到抽象出的业务层，等价于 this.ctx.service 。
- `this.config`：应用运行时的配置项。
- `this.logger`：logger 对象，上面有四个方法（debug，info，warn，error），分别代表打印四个不同级别的日志，使用方法和效果与 context logger 中介绍的一样，但是通过这个 logger 对象记录的日志，在日志前面会加上打印该日志的文件路径，以便快速定位日志打印位置。

## 参数获取

```js
class HomeController extends Controller {
  async index() {
    const { query, queries, params } = this.ctx;
    const { body } = this.ctx.request;

    // Header 参数
    const { ip, ips } = this.ctx;
    ctx.protocol;

    // ctx.body 是 ctx.response.body 的缩写
    this.ctx.body = "Hello World";
  }
}
```

- `query`： 获取 URL 中 `?` 后面的部分的 Query String 参数
- `queries`: 获取 Query String 有相同的 key，例如 GET /posts?category=egg&id=1&id=2&id=3。
- `params`: 获取 Router 上的参数，例如： `/projects/:projectId/app/:appId`

### Cookie

HTTP 请求都是无状态的，但是我们的 Web 应用通常都需要知道发起请求的人是谁。为了解决这个问题，HTTP 协议设计了一个特殊的请求头：Cookie。

```js
class CookieController extends Controller {
  async add() {
    const ctx = this.ctx;
    let count = ctx.cookies.get("count");
    count = count ? Number(count) : 0;
    ctx.cookies.set("count", ++count);
    ctx.body = count;
  }

  async remove() {
    const ctx = this.ctx;
    const count = ctx.cookies.set("count", null);
    ctx.status = 204;
  }
}
```

**配置**

对于 Cookie 来说，主要有下面几个属性可以在 config.default.js 中进行配置:

```js
module.exports = {
  cookies: {
    // httpOnly: true | false,
    // sameSite: 'none|lax|strict',
  }
};
```

## 参数效验

安装 `egg-validate`

```bash
$ yarn add egg-validate
```

配置插件

```js
module.exports = {
  validate: {
    enable: true,
    package: "egg-validate"
  }
};
```

通过 `ctx.validate(rule, [body])` 直接对参数进行校验：

```js
class PostController extends Controller {
  async create() {
    // 校验参数
    // 如果不传第二个参数会自动校验 `ctx.request.body`
    this.ctx.validate({
      title: { type: "string" },
      content: { type: "string" }
    });
  }
}
```
