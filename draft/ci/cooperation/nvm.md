---
title: nvm
---

## [安装](https://github.com/nvm-sh/nvm)

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

source   ~/.bashrc
```

如果安装是出现请求拒接则 `vim /etc/hosts` 修改 host 文件

```shell
199.232.28.133 raw.githubusercontent.com
```

## 常用命令

查看 NVM 版本 list

```shell
nvm ls-remote
```

安装需要的 node 版本

```shell
nvm install v8.12.0
```

查看当前机器已安装版本号

```shell
nvm list
```

切换 node 版本

```shell
nvm use v8.12.0
```

设置默认的 node 版本

```shell
nvm alias default v9.5.0
```

## Linux

不要在 `Ubuntu` 中使用 `apt-get` 安装 `nodejs` 如果你已经安装了，使用以下命令去除

```shell
sudo apt-get purge nodejs && sudo apt-get autoremove && sudo apt-get autoclean
```
