const https = require('https');
const querystring = require('querystring');

const data = querystring.stringify({
  text: 'hello',
  link: 'http://www.baidu.com',
});

const TOKEN =
  'CICy4YgGEiJBQUNHSEU0U0lZN0VQTjVQUEwySEtZV05YQzJWQzZQUkZJIgIIAQ.qw-tcc8C85Y8n7T08hbvcUc4ol3VfU4LVBZghgVjszo';

const options = {
  hostname: 'https://api.chanify.net',
  port: 80,
  path: `/v1/sender/${TOKEN}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': data.length,
  },
};

var req = https.request(options, res => {
  res.on('data', d => {
    process.stdout.write(d);
  });

  res.on('error', err => {
    console.log('err: ', err);
  });
});
req.write(data);
req.end();
