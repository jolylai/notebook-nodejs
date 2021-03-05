---
title: GitLab CI
---

[Gitlab CI 配置文件](https://cloud.tencent.com/developer/article/1376224)

## .gitlab-ci.yml

```yml
image: ruby:2.1
services:
  - postgres

before_script:
  - bundle install

after_script:
  - rm secrets

stages:
  - build
  - test
  - deploy

job1:
  stage: build
  script:
    - execute-script-for-job1
  only:
    - master
  tags:
    - docker
```

下面列出保留字段，这些保留字段不能被定义为 job 名称

| 关键字        | 是否必须 | 描述                                 |
| ------------- | -------- | ------------------------------------ |
| image         | 否       | 用于 docker 镜像，查看 docker 文档   |
| services      | 否       | 用于 docker 服务，查看 docker 文档   |
| stages        | 否       | 定义构建阶段                         |
| types         | 否       | stages 的别名(已废除)                |
| before_script | 否       | 定义在每个 job 之前运行的命令        |
| after_script  | 否       | 定义在每个 job 之后运行的命令        |
| variable      | 否       | 定义构建变量                         |
| cache         | 否       | 定义一组文件列表，可在后续运行中使用 |

## stages

stages 用来定义可以被 job 调用的 stages。stages 的规范允许有灵活的多级 pipelines。

stages 中的元素顺序决定了对应 job 的执行顺序：

1.  相同 stage 的 job 可以平行执行。
2.  下一个 stage 的 job 会在前一个 stage 的 job 成功后开始执行。
    接下仔细看看这个例子，它包含了 3 个 stage：

```yml
stages:
  - build
  - test
  - deploy
```

- 首先，所有 build 的 jobs 都是并行执行的。
- 所有 build 的 jobs 执行成功后，test 的 jobs 才会开始并行执行。
- 所有 test 的 jobs 执行成功，deploy 的 jobs 才会开始并行执行。
- 所有的 deploy 的 jobs 执行成功，commit 才会标记为 success
- 任何一个前置的 jobs 失败了，commit 会标记为 failed 并且下一个 stages 的 jobs 都不会执行。

<Alert>
<div>1.如果.gitlab-ci.yml 中没有定义 stages，那么 job’s stages 会默认定义为 build，test 和 deploy。</div>
<div>2.如果一个 job 没有指定 stage，那么这个任务会分配到 test stage。</div>
</Alert>

## variables

GItLab CI 允许在.gitlab-ci.yml 文件中添加变量，并在 job 环境中起作用。因为这些配置是存储在 git 仓库中，所以最好是存储项目的非敏感配置，例如：

```yml
variables: DATABASE_URL:"postgres://postgres@postgres/my_database"
```

这些变量可以被后续的命令和脚本使用。服务容器也可以使用 YAML 中定义的变量，因此我们可以很好的调控服务容器。变量也可以定义成 job level。

除了用户自定义的变量外，Runner 也可以定义它自己的变量。CI_COMMIT_REG_NAME 就是一个很好的例子，它的值表示用于构建项目的分支或 tag 名称。除了在.gitlab-ci.yml 中设置变量外，还有可以通过 GitLab 的界面上设置私有变量

## Jobs

.gitlab-ci.yml 允许指定无限量 jobs。每个 jobs 必须有一个唯一的名字，而且不能是上面提到的关键字。job 由一列参数来定义 jobs 的行为。

```yml
job_name:
  script:
    - rake spec
    - coverage
  stage: test
  only:
    - master
  except:
    - develop
  tags:
    - ruby
    - postgres
  allow_failure: true
```

| 关键字        | 是否必须 | 描述                                                                |
| ------------- | -------- | ------------------------------------------------------------------- |
| script        | yes      | Runner 执行的命令或脚本                                             |
| image         | no       | 所使用的 docker 镜像，查阅使用 docker 镜像                          |
| services      | no       | 所使用的 docker 服务，查阅使用 docker 镜像                          |
| stage         | no       | 定义 job stage（默认：test）                                        |
| type          | no       | stage 的别名（已弃用）                                              |
| variables     | no       | 定义 job 级别的变量                                                 |
| only          | no       | 定义一列 git 分支，并为其创建 job                                   |
| except        | no       | 定义一列 git 分支，不创建 job                                       |
| tags          | no       | 定义一列 tags，用来指定选择哪个 Runner（同时 Runner 也要设置 tags） |
| allow_failure | no       | 允许 job 失败。失败的 job 不影响 commit 状态                        |
| when          | no       | 定义何时开始 job。可以是 on_success，on_failure，always 或者 manual |
| dependencies  | no       | 定义 job 依赖关系，这样他们就可以互相传递 artifacts                 |
| cache         | no       | 定义应在后续运行之间缓存的文件列表                                  |
| before_script | no       | 重写一组在作业前执行的命令                                          |
| after_script  | no       | 重写一组在作业后执行的命令                                          |
| environment   | no       | 定义此作业完成部署的环境名称                                        |
| coverage      | no       | 定义给定作业的代码覆盖率设置                                        |

### script

script 是 Runner 执行的 yaml 脚本

```yml
job:
  script:
    - uname -a
    - bundle exec rspec
```

有时候，script 命令需要被单引号或者是双引号包裹起来。举个例子，当命令中包含冒号(:)时，script 需要被包在双引号中，这样 YAML 解析器才可以正确解析为一个字符串而不是一个键值对(key:value)。使用这些特殊字符的时候一定要注意：:,{,},[,],,,&,\*,#,?,|,-,<,>,=,!。

### stage

stage 允许一组 jobs 进入不同的 stages。jobs 在相同的 stage 时会 parallel 同时进行。

### only and except

only 和 except 是两个参数用分支策略来限制 jobs 构建：

- `only` 定义哪些分支和标签的 git 项目将会被 job 执行。
- `except` 定义哪些分支和标签的 git 项目将不会被 job 执行。

策略规则

- only 和 except 可同时使用。如果 only 和 except 在一个 job 配置中同时存在，则以 only 为准，跳过 except
- only 和 except 可以使用正则表达式。
- only 和 except 允许使用特殊的关键字：branches，tags 和 triggers。
- only 和 except 允许使用指定仓库地址但不是 forks 的仓库(查看示例 3)。

```yml
job:
  # use regexp
  only:
    - /^issue-.*$/
    - /^release(\/|-)?.*$/
    - tags
    - triggers
  # use special keyword
  except:
    - branches
```

## 实际项目

```yml
variables:
  WEB_IMAGE: rm/rm-front
  ALI_WEB_IMAGE: xtepapp/rm-front
  DOCKER_BUILDER_IMAGE: rm_front_builder_image
  DOCKER_BUILDER_RUNNER: rm_front_builder_image_runner_$CI_COMMIT_REF_NAME-$CI_JOB_ID
  DOCKER_DIST_IMAGE: $REGISTRY/$WEB_IMAGE:dev
before_script:
  - echo "begin to run script"
  - docker login -u $HARBOR_USER -p $HARBOR_PASSWD $REGISTRY
  - docker login -u $ALI_USER -p $ALI_PASSWD $ALI_REGISTRY

stages:
  - dump
  - build
  - install
  - deploy
  - trigger

web:echo:
  stage: dump
  script:
    - echo $CI_BUILD_TAG
  only:
    - aliyun-dev
    - /^release(\/|-)?.*$/

web:dist:build:aliyun:dev:
  stage: build
  variables:
    SERVER_URL: https://47.110.222.89:18442
    EVN_CONFIG: build:dev
  before_script:
    - docker stop $DOCKER_BUILDER_RUNNER && docker rm $DOCKER_BUILDER_RUNNER
  script:
    - export TAG=aliyun-dev
    - docker build -t $DOCKER_BUILDER_IMAGE --build-arg SERVER_URL=$SERVER_URL --build-arg EVN_CONFIG=build:dev  -f ./Dockerfile.build .
    - docker stop $DOCKER_BUILDER_RUNNER && docker rm $DOCKER_BUILDER_RUNNER
    - docker run --name $DOCKER_BUILDER_RUNNER $DOCKER_BUILDER_IMAGE /bin/bash
    - docker cp $DOCKER_BUILDER_RUNNER:/src/app/packages/rm-front/dist ./docker/dist
    - docker cp $DOCKER_BUILDER_RUNNER:/src/app/packages/rm-front-pro/dist ./docker/dist/rm-front-pro
    - export ALI_DOCKER_IMAGE=$ALI_REGISTRY/$ALI_WEB_IMAGE:$CI_BUILD_REF_NAME
    - docker build --pull -t $ALI_DOCKER_IMAGE ./docker
    - docker push $ALI_DOCKER_IMAGE
  only:
    - aliyun-dev
  after_script:
    - docker stop $DOCKER_BUILDER_RUNNER && docker rm $DOCKER_BUILDER_RUNNER

web:cd:deploy:aliyun:dev:
  stage: deploy
  script:
    - docker pull $ALI_REGISTRY/xacr-basis/xtep-python3
    - docker run -v "$(pwd)/deploy":/deploy $ALI_REGISTRY/xacr-basis/xtep-python3 python3 /deploy/dockercdedas.py xrun-frontend
  only:
    - aliyun-dev

web:dist:build:aliyun:prod:
  stage: build
  variables:
    # SERVER_URL: http://120.55.227.199:8442
    SERVER_URL: https://xrc.321go.com
    EVN_CONFIG: build
  before_script:
    - docker stop $DOCKER_BUILDER_RUNNER && docker rm $DOCKER_BUILDER_RUNNER
  script:
    - export TAG=prod
    - docker build -t $DOCKER_BUILDER_IMAGE --build-arg SERVER_URL=$SERVER_URL --build-arg EVN_CONFIG=build -f ./Dockerfile.build .
    - docker stop $DOCKER_BUILDER_RUNNER && docker rm $DOCKER_BUILDER_RUNNER
    - docker run --name $DOCKER_BUILDER_RUNNER $DOCKER_BUILDER_IMAGE /bin/bash
    # - docker cp $DOCKER_BUILDER_RUNNER:/src/app/dist ./docker/dist
    - docker cp $DOCKER_BUILDER_RUNNER:/src/app/packages/rm-front/dist ./docker/dist
    - docker cp $DOCKER_BUILDER_RUNNER:/src/app/packages/rm-front-pro/dist ./docker/dist/rm-front-pro
    - docker build -t $REGISTRY/$WEB_IMAGE:$TAG --build-arg CONT_IMG_VER=prod --pull ./docker
  only:
    - /^release(\/|-)?.*$/
  after_script:
    - docker stop $DOCKER_BUILDER_RUNNER && docker rm $DOCKER_BUILDER_RUNNER

web:dist:install:aliyun:prod:
  stage: install
  before_script:
    - echo 'push aliyun images'
  script:
    - export TAG=prod
    - export ALI_DOCKER_IMAGE=$ALI_REGISTRY/$ALI_WEB_IMAGE:$CI_BUILD_REF_NAME
    - docker tag $REGISTRY/$WEB_IMAGE:$TAG $ALI_DOCKER_IMAGE
    - docker push $ALI_DOCKER_IMAGE
  only:
    - /^release(\/|-)?.*$/
#web:cd:deploy:aliyun:prod:
#  stage: deploy
#  script:
#    - docker pull $ALI_REGISTRY/xacr-basis/xtep-python3
#    - docker run -v "$(pwd)/deploy":/deploy $ALI_REGISTRY/xacr-basis/xtep-python3 python3 /deploy/dockercdedas.py xrun-frontend
#  only:
#    - feature-to-aliyun
```
