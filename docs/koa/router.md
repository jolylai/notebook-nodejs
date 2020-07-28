# 路由

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
const requireDirectory = require("require-directory");
module.exports = requireDirectory(module, "./some/subdirectory");
```
