---
title: 命令行工具
---

## 封装 shell 命令

通过 `npm init -y` 快速创建一个新的 npm 项目

```json
{
  "name": "snippet",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

这会在我们的项目中创建一个新的 package.json 文件，那时我们将需要创建一个 JS 文件包含我们的脚本。让我们根据 Node.js 的传统命名为 index.js。

```shell
#!/usr/bin/env node
console.log('Hello, world!');
```

注意我们必须加一些 东西 来告诉我们的 shell 如何处理我们的脚本。

接下来我们需要在我们 package.json 里面的最顶级增加 bin 部分。设置的属性（在我们的例子中是 snippet）将会变成用户在他们的终端处理脚本使用的命令，属性值就是相对于 package.json 的脚本位置。

```shell
...
  "author": "Tim Pettersen",
  "license": "Apache-2.0",
  "bin": {
    "snippet": "./index.js"
  }
```

现在我们已经有一个可以工作的 shell 命令了！让我们安装它并且测试结果。

```shell
$ npm install -g
$ snippet
Hello, world!
```

<Alert>
bash: /usr/local/bin/snippet: Permission denied<br/>
chmod +x index.js
</Alert>

真整洁！ npm install -g 实际上是将我们脚本链接到 path 变量的位置，所以我们能够在任何地方使用它。

```shell
$ which snippet
/usr/local/bin/snippet
$ readlink /usr/local/bin/snippet
../lib/node_modules/bitbucket-snippet/index.js
```

在开发环境中我们实际上使用 npm link 便利地将我们的 index.js 软链接到 path 变量的位置。

```shell
$ npm link
/usr/local/bin/snippet -> /usr/local/lib/node_modules/bitbucket-snippet/index.js
/usr/local/lib/node_modules/bitbucket-snippet -> /Users/kannonboy/src/bitbucket-snippet
```

当我们开发完成的时候，我们可以通过 npm publish 将我们的脚本发布到公共 npm 仓库，然后任何人都可以下载安装到他们的机器上：

```shell
$ npm install -g bitbucket-snippet
```

但是让我们先让我们的脚本能够工作先！

## 解析命令行参数

获取命令行中传入参数的值

安装 `commander`

```shell
yarn add commander
```

修改 `index.js`

```js
#!/usr/bin/env node
var program = require('commander');

program
  .arguments('<file>')
  .option('-u, --username <username>', 'The user to authenticate as')
  .option('-p, --password <password>', "The user's password")
  .action(function(file) {
    console.log(
      'user: %s pass: %s file: %s',
      program.username,
      program.password,
      file,
    );
  })
  .parse(process.argv);
```

快速测试

```shell
$ snippet -u name -p 123 index.js
user: name pass: 123 file: index.js
```

`commander` 还提供一些简单的帮助输出给我们，基于我们上面提供的配置。

```shell
$ snippet --help
Usage: snippet [options]

Options:
  -u, --username <username>  The user to authenticate as
  -p, --password <password>  The user's password
  -h, --help                 display help for command
```

## 从输入流中读取文本和密码

安装

```shell
yarn add co co-prompt
```

修改`index.js`

```js
#!/usr/bin/env node
var co = require('co');
var prompt = require('co-prompt');
var program = require('commander');

program
  .arguments('<file>')
  .option('-u, --username <username>', 'The user to authenticate as')
  .option('-p, --password <password>', "The user's password")
  .action(function(file) {
    co(function*() {
      var username = yield prompt('username: ');
      var password = yield prompt.password('password: ');
      console.log('user: %s pass: %s file: %s', username, password, file);
    });
  })
  .parse(process.argv);
```

快速测试

```shell
$ snippet laiguolin$ snippet index.js
username: name
password: ***
user: name pass: 123 file: index.js
```

ES6 的 yield，所以这只能在用户运行在 node 4.0.0+上面。但是我们可以在`index.js`加入 --harmony 标志让 0.11.2 版本的也可以正常使用。

```js
- #!/usr/bin/env node
+ #!/usr/bin/env node --harmony
```

- [使用 Node.js 创建命令行脚本工具](https://aotu.io/notes/2015/12/23/building-command-line-tools-with-node-js/)
- [CI 构建能力](https://juejin.im/post/5e835ef6f265da47a7411b06#heading-6)
- [curl](https://www.ruanyifeng.com/blog/2019/09/curl-reference.html)
