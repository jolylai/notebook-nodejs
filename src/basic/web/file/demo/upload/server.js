const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.statusMessage = 'success';

  res.setHeader('Access-Control-Allow-Origin', '*');

  res.end('success');
});

server.listen(3000, () => {
  console.log(`server listen at http://localhost:3000`);
});
