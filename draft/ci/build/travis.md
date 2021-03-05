---
title: Travis
group:
  title: 构建
---

### Travis 生命周期

- OPTIONAL Install `apt addons`
- OPTIONAL Install `cache components`
- `before_install`
- `install`
- `before_script`
- `script`
- OPTIONAL `before_cache` (for cleaning up cache)
- `after_success` or `after_failure`
- OPTIONAL `before_deploy`
- OPTIONAL `deploy`
- OPTIONAL `after_deploy`
- `after_script`

## 更多配置

- `local_dir`: Directory to push to GitHub Pages, defaults to current directory. Can be specified as an absolute path or a relative path from the current directory.
- `repo`: Repo slug, defaults to current repo.
- `target_branch`: Branch to (force, see: keep_history) push local_dir contents to, defaults to gh-pages.
- `keep_history`: Optional, create incremental commit instead of doing push force, defaults to false.
- `fqdn`: Optional, sets a custom domain for your website, defaults to no custom domain support.
- `project_name`: Defaults to value of fqdn or repo slug, used for metadata.
- `email`: Optional, committer info, defaults to deploy@travis-ci.org.
- `name`: Optional, committer, defaults to Deployment Bot.
- `committer_from_gh`: Optional, defaults to false. Allows you to use the token’s owner name and email for commit. Overrides email and name options.
- `allow_empty`\_commit: Optional, defaults to false. Enabled if only keep_history is true.
- `github_url`: Optional, the URL of the self-hosted GitHub enterprise, defaults to github.com.
- `verbose`: Optional, be verbose about internal steps, defaults to false.
- `deployment_file`: Optional, defaults to false, enables creation of deployment-info files.

## 相关文章

[travis-deploy-to-gh-pages](https://voorhoede.github.io/front-end-tooling-recipes/travis-deploy-to-gh-pages/)

## 阿里云

自动部署项目到自己的服务器

## 配置服务器

> [自动部署](https://juejin.im/post/5a9e1a5751882555712bd8e1#heading-12)

安装 ruby 版本管理工具 rvm

```bash
curl -sSL https://get.rvm.io | bash -s stable

rvm version
```

安装 ruby

```bash
rvm install ruby
ruby --version

# 切换镜像源
$ gem sources --add https://gems.ruby-china.com/ --remove https://rubygems.org/

# 查看是切换成功
# 确保只有 gems.ruby-china.com
$ gem sources -l
https://gems.ruby-china.com

# 这里请翻墙一下
$ gem update --system

# 查看版本号
$ gem -v
2.6.3
```

安装 travis

```bash
$ gem install travis
```

### ssh

配置 ssh 登录服务器

如果还没有生成过秘钥可以使用以下命令生成秘钥，已生成过的可以使用已生成的

```bash
# 然后一路回车即可
ssh-keygen -t rsa
```

执行完成后会生成两文件 `id_rsa`（私钥） id_rsa.pub（共玥）

```bash
# 将 key 复制到黏贴板

# Git Bash on Windows / Windows PowerShell
cat ~/.ssh/id_rsa.pub | clip

# macOS
pbcopy < ~/.ssh/id_rsa.pub

# Linux
xclip -sel clip < ~/.ssh/id_rsa.pub

# Windows
type %userprofile%\.ssh\id_rsa.pub | clip
```

使用以上命令复制共玥，然后登录自己的服务器后台，绑定密钥。

服务器配置完成后，测试写能否可以用 ssh 登录服务器

```bash
# ssh-copy-id 可能需要另行安装
# 如果ssh默认端口是22，则不需要 -p
ssh-copy-id <登录部署服务器用户名>@<部署服务器地址> -p <部署服务器ssh端口>

# 测试是否可以用ssh登录服务器
ssh <登录部署服务器用户名>@<部署服务器地址> -p <部署服务器ssh端口>
```

## 加密私钥到 travis 环境变量

切换目录到项目根路径下

```bash
# --auto自动登录github帐号
$ travis login --auto

# 此处的--add参数表示自动添加脚本到.travis.yml文件中
# 这个命令会自动把 id_rsa 加密传送到 .git 指定的仓库对应的 travis 中去
$ travis encrypt-file ~/.ssh/id_rsa --add
```

```yaml {4,5}
addons:
  ssh_known_hosts: 服务器地址
before_install:
  - openssl aes-256-cbc -K $encrypted_2a01126f8b17_key -iv $encrypted_2a01126f8b17_iv
    -in id_rsa.enc -out ~/.ssh/id_rsa -d
  # 权限
  - chmod 600 ~/.ssh/id_rsa
  - echo -e "Host 106.12.140.131\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
```

因为 travis-ci 默认只添加了 github.com, gist.github.com 和 ssh.github.com 为 known_hosts，rsync 执行时会提示是否添加，但是 travis-ci 里不能输入确认，所以需要将自动服务器的域名和商品添加到 known_hosts

::: tip
travis 自动生成的会有`\`，需要自己删除
:::

## 执行自己的服务器命令

### 上传文件

```yaml
# 没有修改过端口的，可以用这个，上传目录要加 -r 参数
- scp -o stricthostkeychecking=no -r 要上传的文件或目录 用户@域名或IP:/路径
# 由于我修改了默认的port，所以在这里也进行了加密处理
- scp -o stricthostkeychecking=no -P $PORT -r 要上传的文件或目录 用户@域名或IP:/路径
```

最后，就是在 after_success 周期中，添加上传服务器的指令即可，在这里要注意，如果没有 stricthostkeychecking=no 参数，将构建失败，详细原因请参考通过 travis 部署代码到远程服务器

## 完整的 `.travis.yml` 文件

```yaml
language: node_js
node_js: 8
branches:
  only:
    - master
addons:
  ssh_known_hosts: 106.12.140.131
install:
  - yarn install
script:
  - yarn run docs:build
deploy:
  provider: pages
  skip-cleanup: true
  github-token: '$GITHUB_TOKEN'
  keep-history: true
  local_dir: docs/.vuepress/dist
  on:
    branch: master
before_install:
  - openssl aes-256-cbc -K $encrypted_2a01126f8b17_key -iv $encrypted_2a01126f8b17_iv
    -in id_rsa.enc -out ~/.ssh/id_rsa -d
  - chmod 600 ~/.ssh/id_rsa
  - echo -e "Host 106.12.140.131\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
after_success:
  - scp -o stricthostkeychecking=no -r docs/.vuepress/dist root@106.12.140.131:/root
```

## 常用配置

### 添加授信主机

部署项目到自己服务器的时候需要添加

```yaml
addons:
  ssh_known_hosts: 106.12.140
```

### 部署到 gh-pages

```yaml
deploy:
  provider: pages
  skip-cleanup: true
  github-token: '$GITHUB_TOKEN'
  keep-history: true
  local_dir: docs/.vuepress/dist
  on:
    branch: master
```

### 缓存

```yaml
cache:
  directories: node_modules
```

### 文件压缩并上传至服务器

使用了一下，经常遇到 scp 很或者失败的问题

```yaml
after_deploy:
  - cd public/
  - zip -r dist.zip .
  - chmod 600 ~/.ssh/id_rsa
  - ssh root@"$HOST" -o StrictHostKeyChecking=no 'rm -rf /var/www/happy-little-stack/ && mkdir /var/www/happy-little-stack/'
  - scp -o stricthostkeychecking=no -r dist.zip root@"$HOST":/var/www/happy-little-stack/
  - ssh root@"$HOST" -o StrictHostKeyChecking=no 'unzip -o -d /var/www/happy-little-stack /var/www/happy-little-stack/dist.zip'
  - cd ..
  - yarn run notification
```

## 模板

```yaml
language: node_js
node_js: 8
cache:
  directories: node_modules
sudo: required
services:
  - docker
branches:
  only:
    - master
addons:
  ssh_known_hosts: 106.12.140
before_install:
  - openssl aes-256-cbc -K $encrypted_2a01126f8b17_key -iv $encrypted_2a01126f8b17_iv
    -in id_rsa.enc -out ~/.ssh/id_rsa -d
  - chmod 600 ~/.ssh/id_rsa
  - echo -e "Host $HOST\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
install:
  - yarn install
before_script:
  -
script:
  - yarn run docs:build
before_cache:
  -
after_success:
  - scp -o stricthostkeychecking=no -r docs/.vuepress/dist root@"$HOST":/root
after_failure:
  -
before_deploy:
  -
deploy:
  provider: pages
  skip-cleanup: true
  github-token: "$GITHUB_TOKEN"
  keep-history: true
  local_dir: docs/.vuepress/dist
  on:
    branch: master
after_deploy:
  - yarn run notification
  # 执行服务器上的命令
  - ssh root@"$HOST" -o StrictHostKeyChecking=no 'docker pull jolylai/notebook && docker run -d -p 80:80'
after_script: -
```
