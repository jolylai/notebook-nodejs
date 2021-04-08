---
title: 流
---

## 读取

```js
const fs = require('fs');

const readStream = fs.createReadStream('index.md', 'utf-8');

readStream.on('data', function onData(data) {
  console.log('data: ', data);
});

readStream.on('end', function onEnd() {
  console.log('END');
});

readStream.on('error', function onError(err) {
  console.log('err: ', err);
});
```

data 事件可能会有多次，每次传递的 chunk 是流的一部分数据。

## 写入

```js
const fs = require('fs');

const writeStream = fs.createWriteStream('assets/text.txt');

writeStream.write('我写入了一行\n');
writeStream.write('我又写入了一行\n');
writeStream.write('我再写入了一行\n');
writeStream.end();
```

要以流的形式写入文件，只需要不断调用 `write()` 方法，最后以 `end()` 结束

## pipe

```js
const fs = require('fs');

const readStream = fs.createReadStream('assets/sample.png');
const writeStream = fs.createWriteStream('assets/copy.png');

readStream.pipe(writeStream);
```

默认情况下，当 Readable 流的数据读取完毕，end 事件触发后，将自动关闭 Writable 流。如果我们不希望自动关闭 Writable 流，需要传入参数：

```js
readable.pipe(writable, { end: false });
```
