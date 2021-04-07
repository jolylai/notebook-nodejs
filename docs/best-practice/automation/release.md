---
title: 发布脚本
---

## 前言

执行以下命令就能自动打包并发布指定的版本

```shell
yarn release -v 1.0.0
```

发布脚本会自动执行以下功能

1. 版本控制
2. 执行测试用例
3. 打包
4. 提交代码到本地仓库
5. 发布 npm 包
6. 打标签

## 版本控制

```js
const semver = require('semver');
const args = require('minimist')(process.argv.slice(2));
const { prompt } = require('enquirer');

const currentVersion = require('../package.json').version;

const preId =
  args.preid ||
  (semver.prerelease(currentVersion) && semver.prerelease(currentVersion)[0]);

const inc = i => semver.inc(currentVersion, i, preId);
const versionIncrements = ['patch', 'minor', 'major'];

(async function main() {
  const { release } = await prompt({
    type: 'select',
    name: 'release',
    message: 'Select release type',
    choices: versionIncrements.map(i => `${i} (${inc(i)})`).concat(['custom']),
  });

  if (release === 'custom') {
    targetVersion = (
      await prompt({
        type: 'input',
        name: 'version',
        message: 'Input custom version',
        initial: currentVersion,
      })
    ).version;
  } else {
    targetVersion = release.match(/\((.*)\)/)[1];
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`);
  }

  const { yes } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`,
  });

  if (!yes) {
    return;
  }

  // ...
})();
```

安装依赖

```shell
yarn add enquirer minimist semver -D
```

- [minimist](https://github.com/substack/minimist): 获取命令行传入的参数 (This module is the guts of optimist's argument parser without all the fanciful decoration.)
- [enquirer](https://github.com/enquirer/enquirer):Stylish CLI prompts that are user-friendly, intuitive and easy to create.
- [semver](https://github.com/npm/node-semver#readme):The semantic versioner for npm

## 执行测试用例并打包

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
  step('\nRunning tests...');
  await run('yarn', ['test']);

  step('\nBuilding element3...');
  await run('yarn', ['build']);
})();
```

安装 [execa](https://github.com/sindresorhus/execa#readme)(Process execution for humans)

```shell
yarn add execa chalk -D
```

## 生成 CHNAGELOG

安装依赖

```shell
yarn add conventional-changelog-cli -D
```

配置 `package.json`

```json
{
  "scripts": {
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s"
  }
}
```

## 提交变更

如果还有变更还没提交是，先将变更提交到本地仓库

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

使用[yarn publish](https://classic.yarnpkg.com/en/docs/cli/publish/)发布包到 npm 仓库

```shell
yarn publish --new-version 1.0.0  --registry https://registry.npmjs.org --access public
```

## 打标签

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

```shell
git tag -a v-1.0.0 -m message
git push origin v-1.0.0
```

#### 更新依赖

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

## 完整脚本

安装依赖

```shell
yarn add semver prompt minimist execa chalk -D
```

完整脚本代码

```js
const semver = require('semver');
const { prompt } = require('enquirer');
const path = require('path');
const args = require('minimist')(process.argv.slice(2));
const execa = require('execa');
const chalk = require('chalk');
const isDryRun = args.dry;

const step = msg => console.log(chalk.cyan(msg));
const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts });
const dryRun = (bin, args, opts = {}) =>
  console.log(chalk.blue(`[dryrun] ${bin} ${args.join(' ')}`), opts);
const runIfNotDry = isDryRun ? dryRun : run;

const currentVersion = require('../package.json').version;
const preId =
  args.preid ||
  (semver.prerelease(currentVersion) && semver.prerelease(currentVersion)[0]);

const inc = i => semver.inc(currentVersion, i, preId);

const versionIncrements = [
  'patch',
  'minor',
  'major',
  ...(preId ? ['prepatch', 'preminor', 'premajor', 'prerelease'] : []),
];

(async function main() {
  let targetVersion = args._[0];
  const { release } = await prompt({
    type: 'select',
    name: 'release',
    message: 'Select release type',
    choices: versionIncrements.map(i => `${i} (${inc(i)})`).concat(['custom']),
  });

  if (release === 'custom') {
    targetVersion = (
      await prompt({
        type: 'input',
        name: 'version',
        message: 'Input custom version',
        initial: currentVersion,
      })
    ).version;
  } else {
    targetVersion = release.match(/\((.*)\)/)[1];
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`);
  }

  const { yes } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`,
  });

  if (!yes) {
    return;
  }

  step('\nRunning tests...');
  await runIfNotDry('yarn', ['test']);

  step('\nBuilding usevhooks...');
  await runIfNotDry('yarn', ['build']);

  step('\nGenerate changelog...');
  await runIfNotDry(`yarn`, ['changelog']);

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' });
  if (stdout) {
    step('\nCommitting changes...');
    await runIfNotDry('git', ['add', '-A']);
    await runIfNotDry('git', ['commit', '-m', `release: v${targetVersion}`]);
  } else {
    console.log('No changes to commit.');
  }

  step('\nPublishing usevhooks package...');

  await runIfNotDry(
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
      cwd: path.resolve(__dirname, '..'),
      stdio: 'pipe',
    },
  );

  step('\nPushing to GitHub...');
  await runIfNotDry('git', ['tag', `v${targetVersion}`]);
  await runIfNotDry('git', [
    'push',
    'origin',
    `refs/tags/v${targetVersion}`,
    '--no-verify',
  ]);
  await runIfNotDry('git', ['push', 'origin', 'master', '--no-verify']);

  console.log();
  console.log(chalk.green(`Successfully published v${targetVersion}`));
})();
```

#### Reference

- [create-release](https://github.com/actions/create-release)
- [element3](https://github.com/hug-sun/element3/blob/master/scripts/release.js)
- [vue-next](https://github.com/vuejs/vue-next/blob/master/scripts/release.js)
