const fs = require('fs');
const util = require('util');

const stat = util.promisify(fs.stat);

module.exports = stat;

// fs.stat('test.txt', function(err, stat) {
//   if (err) {
//     console.log('err: ', err);
//   } else {
//     if (stat.isFile()) {
//       // 读取的是文件
//     }

//     if (stat.isDirectory()) {
//       // 读取的是目录
//     }

//     // console.log('stat: ', stat);

//     // 文件大小:
//     console.log('size: ' + stat.size);
//     // 创建时间, Date对象:
//     console.log('birth time: ' + stat.birthtime);
//     // 修改时间, Date对象:
//     console.log('modified time: ' + stat.mtime);
//   }
// });
