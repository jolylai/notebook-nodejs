---
title: 自定义CLI
---

## 前言

自定义 CLI 可以大大提高工作效率，比如给一个 git 分支打 Tag 时我们需要使用以下命令

```shell
git tag -a v-1.0.0 -m message
git push origin v-1.0.0
```

而通过封装一个 CLI 后，只需要使用一下命令

```shell
yarn release -v 1.0.0
```

## 1.获取命令行的参数

[minimist](https://github.com/substack/minimist): This module is the guts of optimist's argument parser without all the fanciful decoration.

```shell
yarn add minimist execa -D
```

创建 `example/parse.js`文件

```js
var argv = require('minimist')(process.argv.slice(2));
console.log(argv);
```

执行命令行

```shell
node example/parse.js -a beep -b boop
{ _: [], a: 'beep', b: 'boop' }
```

## 2. 命令提示工具

```shell
yarn add enquirer minimist execa -D
```

> [enquirer](https://github.com/enquirer/enquirer):Stylish CLI prompts that are user-friendly, intuitive and easy to create.

```js
const { prompt } = require('enquirer');
const args = require('minimist')(process.argv.slice(2));

const targetVersion = args.v;

(async function main() {
  const { yes } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`,
  });

  if (!yes) return;
})();
```

## 3. 执行 Script

### 执行测试案例并打包

```js
const { prompt } = require('enquirer');
const args = require('minimist')(process.argv.slice(2));
const execa = require('execa');
const chalk = require('chalk');
const targetVersion = args.v;

const step = msg => console.log(chalk.cyan(msg));

const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts });

(async function main() {
  step('\nRunning element3 tests...');
  await run('yarn', ['workspace', 'element3', 'test']);

  step('\nBuilding element3...');
  await run('yarn', ['workspace', 'element3', 'build']);
})();
```

### 更新依赖

使用 workspace 管理包的时候 才需要打包时更新包依赖

```js
const path = require('path');
const chalk = require('chalk');

const step = msg => console.log(chalk.cyan(msg));

(async function main() {
  step('\nUpdating element3 cross dependencies...');
  updatePackageVersion(targetVersion);
})();

function updatePackageVersion(version) {
  getPackagePath().forEach(pkgPath => {
    const pkg = JSON.parse(fs.readFileSync(pkgPath));
    updateDeps(pkg, 'dependencies', version);
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  });
}

function getPackagePath() {
  const pkgRoot = path.resolve(__dirname, '../packages');
  const packages = fs
    .readdirSync(pkgRoot)
    .filter(name => !name.startsWith('.'));

  return packages.map(packageName =>
    path.resolve(pkgRoot, packageName, 'package.json'),
  );
}

function updateDeps(packageJson, depType, version) {
  const dependencies = packageJson[depType];
  if (!dependencies) return;

  Object.keys(dependencies).forEach(key => {
    if (key === 'element3') {
      dependencies[key] = version;
    }
  });
}
```

### 提交变更

```js
const execa = require('execa');
const chalk = require('chalk');
const args = require('minimist')(process.argv.slice(2));
const targetVersion = args.v;

const step = msg => console.log(chalk.cyan(msg));

const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts });

(async function main() {
  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' });
  if (stdout) {
    step('\nCommitting changes...');

    await run('git', ['add', '-A']);
    await run('git', ['commit', '-m', `release: v${targetVersion}`]);
  } else {
    console.log('No changes to commit.');
  }
})();
```

### 发布 npm 包

[yarn publish](https://classic.yarnpkg.com/en/docs/cli/publish/),发布包到 npm 仓库

```js
const path = require('path');
const chalk = require('chalk');
const execa = require('execa');
const args = require('minimist')(process.argv.slice(2));
const targetVersion = args.v;

const step = msg => console.log(chalk.cyan(msg));

const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts });

(async function main() {
  step('\nPublishing package...');

  await run(
    'yarn',
    [
      'publish',
      '--new-version',
      targetVersion,
      '--registry',
      'https://registry.npmjs.org',
      '--access',
      'public',
    ],
    {
      cwd: path.resolve(__dirname),
      stdio: 'pipe',
    },
  );
})();
```

### 打 Tag

```js
const chalk = require('chalk');
const execa = require('execa');
const args = require('minimist')(process.argv.slice(2));
const targetVersion = args.v;

const step = msg => console.log(chalk.cyan(msg));

const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts });

(async function main() {
  step('\nPushing to GitHub...');

  await run('git', ['tag', `v${targetVersion}`]);
  await run('git', [
    'push',
    'origin',
    `refs/tags/v${targetVersion}`,
    '--no-verify',
  ]);
  await run('git', ['push', 'origin', 'master', '--no-verify']);
})();
```

`.github/workflow/release` [create-release](https://github.com/actions/create-release)

完整脚本代码可以查看 [element3](https://github.com/hug-sun/element3/blob/master/scripts/release.js)
