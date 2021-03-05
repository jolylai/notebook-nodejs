---
title: 代码质量
group:
  title: 协作
---

## 格式化代码

> [pretty-quick](https://github.com/azz/pretty-quick)

安装依赖

```bash
$ yarn add --dev prettier pretty-quick husky
```

`package.json` 中添加

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "pretty-quick --staged"
    }
  }
}
```

这样就能在代码预本地提交时将代码格式化

- `pre-commit`，预本地提交。通常会在该提交之前，进行一些语法和 lint 的检测。
- `pre-push`，预远程提交。通常会在该提交之前，运行一些测试。

## 代码 Lint

根据所需安装相应的依赖和添加对应的 script，具体可以参考 [Ant Design](https://github.com/ant-design/ant-design/blob/master/package.json)

```json
{
  "scripts": {
    "lint": "npm run lint:tsc && npm run lint:script && npm run lint:demo && npm run lint:style && npm run lint:deps",
    "lint-fix": "npm run lint-fix:script && npm run lint-fix:demo && npm run lint-fix:style",
    "lint-fix:demo": "eslint-tinker ./components/*/demo/*.md",
    "lint-fix:script": "npm run lint:script -- --fix",
    "lint-fix:style": "npm run lint:style -- --fix",
    "lint:demo": "cross-env RUN_ENV=DEMO eslint components/*/demo/*.md --ext '.md'",
    "lint:deps": "antd-tools run deps-lint",
    "lint:md": "remark components/",
    "lint:script": "eslint . --ext '.js,.jsx,.ts,.tsx'",
    "lint:style": "stylelint '{site,components}/**/*.less' --syntax less",
    "lint:tsc": "npm run tsc"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^2.0.0",
    "@typescript-eslint/parser": "^2.0.0",
    "babel-eslint": "^10.0.1",
    "eslint": "^6.1.0",
    "eslint-config-airbnb": "^18.0.0",
    "eslint-config-prettier": "^6.0.0",
    "eslint-plugin-babel": "^5.3.0",
    "eslint-plugin-import": "^2.17.3",
    "eslint-plugin-jest": "^22.6.4",
    "eslint-plugin-jsx-a11y": "^6.2.1",
    "eslint-plugin-markdown": "^1.0.0",
    "eslint-plugin-react": "^7.14.2",
    "eslint-tinker": "^0.5.0"
  }
}
```

## 代码检测

开发人员自己写测试会更友好一些。按照测试金字塔理论来说，我们需要三种类型的测试：

- `单元测试`，用于保证我们的基础函数是正常、正确工作的。
- `服务测试`，不仅仅自身的服务，也会测试第三方依赖服务。
- `UI 测试`，模仿用户操作行为的测试。

对于一个前端项目来说，我们通常只需要两种： `单元测试` 和 `E2E`测试。实际上，理论上应该还有 `UI 组件的测试`，但是一般而言，我们在选用 UI 组件的时候，会考虑到组件的稳定性。

用于保证这个项目的质量，在代码提交之后，会经过一系列的测试：

- 单元测试
- 自动化 UI 测试
- 开发人员手动进行集成测试
- 测试人员进行 3~4 轮的测试

## prettier

### .prettierrc

```js
{
  "printWidth": 120,               // 换行字符串阈值
  "semi": true,                    // 句末加分号
  "singleQuote": true,             // 用单引号
  "trailingComma": "es5",         // 最后一个对象元素加逗号
  "bracketSpacing": true,          // 对象，数组加空格
  "jsxBracketSameLine": false,     // jsx > 是否另起一行
  "arrowParens": "avoid",          // (x) => {} 是否要有小括号
  "requirePragma": false,          // 是否要注释来决定是否格式化代码
  "proseWrap": "preserve"          // 是否要换行
  "overrides": [
    {
      "files": ".prettierrc",
      "options": { "parser": "json" }
    }
  ]
}
```

### .prettierignore

```
package.json
gatsby/**
```

## ESLint

```js
module.exports = {
  rules: {
    // 缩进
    indent: ['error', 4, { SwitchCase: 1 }],
    'arrow-parens': ['error', 'as-needed'],
  },
};
```
