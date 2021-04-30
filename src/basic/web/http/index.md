---
title: http
---

## 发送请求

```js
const http = require('http');

const options = {
  hostnmae: 'localhost',
  port: 3001,
  path: '/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const request = http.request(options, async res => {
  console.log(`状态码 ${res.statusCode}`);

  const responseData = await getResponseData(res);
  console.log('responseData: ', responseData);
});

request.on('error', err => {
  console.log('err: ', err);
});

const data = JSON.stringify({
  type: 'Node.js',
});

request.write(data);
request.end();
```

```js
const getResponseData = stream => {
  return new Promise((resolve, reject) => {
    const responseBuffer = [];

    stream.on('data', chunk => {
      responseBuffer.push(chunk);
    });

    stream.on('end', () => {
      const responseData = Buffer.concat(responseBuffer);

      resolve(responseData.toString());
    });

    stream.on('error', err => {
      reject(err);
    });
  });
};
```

## HTTP 服务器

搭建 个简单的 HTTP web 服务器

```js
const http = require('http');

const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('你好世界\n');
});

server.listen(port, () => {
  console.log(`服务器运行在 http://${hostname}:${port}/`);
});
```

获取请求的数据

```js
const http = require('http');

const getRequestData = req => {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      console.log('chunk: ', chunk);
      data += chunk;
    });

    req.on('end', () => {
      try {
        const json = JSON.parse(data);
        resolve(json);
      } catch (err) {
        reject(err);
      }
    });
  });
};

const server = http.createServer(async (req, res) => {
  const data = await getRequestData(req);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Node.js');
});

server.listen(3001, () => {
  console.log(`server listen at http://localhost:3001`);
});
```
