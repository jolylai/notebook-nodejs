---
title: 打包
---

## 前言

```shell
yarn release -v 1.0.0
```

## 获取版本号

```shell
yarn add enquirer minimist execa -D
```

- [enquirer](https://github.com/enquirer/enquirer):Stylish CLI prompts that are user-friendly, intuitive and easy to create.
- [execa](https://github.com/sindresorhus/execa): Process execution for humans
- [minimist](https://github.com/substack/minimist): This module is the guts of optimist's argument parser without all the fanciful decoration.

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

## 执行测试案例并打包

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

## 更新依赖

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

## 提交变更

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

## 发布 npm 包

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

## 打 tag 包

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

```yml
on:
  push:
    tags:
      - 'v*' # Push events to matching v*, i.e. v1.0, v20.15.10

name: Create Release

jobs:
  build:
    name: Create Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@master
      - name: Create Release for Tag
        id: release_tag
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          body: |
            Please refer to [CHANGELOG.md](https://github.com/kkbjs/element3/blob/master/CHANGELOG.md) for details.
```

完整脚本代码可以查看 [element3](https://github.com/hug-sun/element3/blob/master/scripts/release.js)
