---
title: 路径 path
---

```js
console.log('__dirname', __dirname);
// /Users/laiguolin/Workspace/notebook/nodejs/src/basic/io/path/demo
console.log('__filename', __filename);
//  /Users/laiguolin/Workspace/notebook/nodejs/src/basic/io/path/demo/resolve.js
```

判断文件或文件夹是否纯在

```js
const fs = require('fs');
const util = require('util');

const access = util.promisify(fs.access);

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch (err) {
    return false;
  }
}
```
