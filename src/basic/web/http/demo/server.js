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
  console.log(`method ${req.method}`);
  const data = await getRequestData(req);
  console.log(`data ${data}`);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Node.js');
});

server.listen(3001, () => {
  console.log(`server listen at http://localhost:3001`);
});
