---
title: 规范检查
group:
  title: 自动化
  order: 2
---

## 前言

commit-msg/pre-commit
post-checkout
pre-push

## Prettier

安装 [`Prettier`](https://prettier.io/)

```shell
yarn add prettier -D
```

创建 `.prettierrc` 文件，配置 `Prettier` 如何格式化代码 ，以下是常用配置，更多配置可以查看[](https://prettier.io/docs/en/options.html)

```js
{
  "printWidth": 120,               // 换行字符串阈值
  "semi": true,                    // 句末加分号
  "singleQuote": true,             // 用单引号
  "trailingComma": "none",         // 最后一个对象元素加逗号
  "bracketSpacing": true,          // 对象，数组加空格
  "jsxBracketSameLine": false,     // jsx > 是否另起一行
  "arrowParens": "avoid",          // (x) => {} 是否要有小括号
  "requirePragma": false,          // 是否要注释来决定是否格式化代码
  "proseWrap": "preserve"          // 是否要换行
}
```

创建 `.prettierignore` 文件，告诉 `Prettier` 哪些文件不需要格式化

```
# Ignore artifacts:
build
coverage

# Ignore all HTML files:
*.html

**/*.svg
**/*.ejs
package.json
.umi
.umi-production
.umi-test
```

使用命令行格式化文件

```shell
# 格式化所有文件
yarn prettier --write .

# 格式化某些文件夹下的文件
yarn prettier --write app/

# 格式化具体文件
yarn prettier --write app/components/Button.js

# 格式化所有匹配到的文件
yarn prettier --write "app/**/*.test.js
```

## Eslint

安装 `eslint`

```shell
yarn add eslint -D
yarn run eslint --init
```

创建 `.eslintrc`, 配置 `eslint` 如何效验代码

- `env`: 环境提供了预定义的全局变量。
- `globals`: 脚本在执行过程中访问的其他全局变量。
- `rules`:启用了哪些规则，在什么错误级别上。
- `plugins`: 第三方插件定义额外的规则、环境、配置等，供 ESLint 使用。

```json
{
  "env": {
    "browser": true,
    "node": true
  },
  "globals": {
    "ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION": true,
    "page": true,
    "REACT_APP_ENV": true
  }
}
```

使用命令行检查文件代码

```shell
yarn eslint .
```

## 打码提交前检查

```shell
yarn add yorkie lint-staged -D
```

`package.json`

```json
{
  "gitHooks": {
    "pre-commit": "lint-staged"
  },
  "lint-staged": {
    "*.{js,vue}": ["eslint", "prettier --write"],
    "*.ts?(x)": ["eslint", "prettier --parser=typescript --write"]
  }
}
```

现在来解释下各个钩子的含义：

1. `"pre-commit": "npm run lint"`，在 git commit 前执行 npm run lint 检查代码格式。
2. `"commit-msg": "node script/verify-commit.js"`，在 git commit 时执行脚本 verify-commit.js 验证 commit 消息。如果不符合脚本中定义的格式，将会报错。
3. `"pre-push": "npm test"`，在你执行 git push 将代码推送到远程仓库前，执行 npm test 进行测试。如果测试失败，将不会执行这次推送。

## 提交信息检查

安装依赖

```shell
yarn add chalk -D
```

创建 `/scripts/verifyCommit.js` 检查提交信息规范

```js
// Invoked on the commit-msg git hook by yorkie.

const chalk = require('chalk');
const msgPath = process.env.GIT_PARAMS;
const msg = require('fs')
  .readFileSync(msgPath, 'utf-8')
  .trim();

const commitRE = /^(revert: )?(feat|fix|docs|dx|style|refactor|perf|test|workflow|build|ci|chore|types|wip|release)(\(.+\))?(.{1,10})?: .{1,50}/;
const mergeRe = /^(Merge pull request|Merge branch)/;

if (!commitRE.test(msg)) {
  if (!mergeRe.test(msg)) {
    console.log(msg);
    console.error(
      `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(
        `invalid commit message format.`,
      )}\n\n` +
        chalk.red(
          `  Proper commit message format is required for automated changelog generation. Examples:\n\n`,
        ) +
        `    ${chalk.green(`feat(compiler): add 'comments' option`)}\n` +
        `    ${chalk.green(
          `fix(v-model): handle events on blur (close #28)`,
        )}\n\n` +
        chalk.red(
          `  See https://github.com/vuejs/vue-next/blob/master/.github/commit-convention.md for more details.\n`,
        ),
    );
    process.exit(1);
  }
}
```

配置 `package.json`

```json
{
  "gitHooks": {
    "commit-msg": "node scripts/verifyCommit.js"
  }
}
```

## 生成更新日志

安装 [conventional-changelog-cli](https://github.com/conventional-changelog/conventional-changelog)

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
