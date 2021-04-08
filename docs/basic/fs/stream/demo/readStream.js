const fs = require('fs');

const readStream = fs.createReadStream('assets/sample.png');

readStream.on('data', function onData(data) {
  console.log('data: ', data);
  console.log('length: ', data.length);
});

readStream.on('end', function onEnd() {
  console.log('END');
});

readStream.on('error', function onError(err) {
  console.log('err: ', err);
});
