```js
const program = require('commander');

program
  .command('build')
  .description('alias of "npm run serve" in the current project')
  .option('--mode <mode>')
  .action(options => {
    console.log('options: ', options);
    // require('../src/dev.mjs')
  });

program.parse(process.argv);
```
