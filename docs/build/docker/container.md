---
title: 容器
order: 3
---

## 创建

```shell
# 只创建容器
$ docker create

# 创建并运行 container
$ docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
```

创建并运行 container 后进入其 bash 控制台 `docker run -t -i [image] /bin/bash`

```shell
$ docker run -it centos  /bin/bash

# 查看容器内的 centos
# 基础版本 很多命名都不是完善的
[root@e41187d21e6c /]# ls
bin  dev  etc  home  lib  lib64  lost+found  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var

# 退出容器并停止运行 回到主机
# 快捷键 control + p + q 退出容器不停止运行 回到主机
[root@e41187d21e6c /]# exit
exit
```

创建并运行 container 并让其在后台运行，并端口映射

```shell
# docker run -p [port in container]:[port in physical system] -d [image] [command]
$ docker run -p 4000:8081  hello-world
```

参数

- `--name="Name"`: 容器名字，用来区分容器名字
- `-d`: 后台方式运行
- `-it`: 使用交互方式运行，进入容器查看内容
- `-p`: 指定容器的端口
- `-P`: 随机指定端口

## 查看

```bash
# 查看正在运行的所有 container 信息
$ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                NAMES
33dd05bad49b        a00be011f00a        "nginx -g 'daemon ..."   7 days ago          Up 7 days           0.0.0.0:80->80/tcp   suspicious_yonath

# 查看所有 container ，包括正在运行和已经关闭的
$ docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                     PORTS                NAMES
e41187d21e6c        centos              "/bin/bash"              10 minutes ago      Exited (0) 6 minutes ago                        peaceful_austin

# 列出容器的id
$ docker ps -q
33dd05bad49b

# 查看最后创建的 container
$ docker ps -l

# 输出指定 container 的 stdout 信息（用来看 log ，效果和 tail -f 类似，会实时输出。）
$ docker logs -f [container]

# 获取 container 指定端口映射关系
$ docker port [container] [port]

# 查看 container 进程列表
$ docker top [container]

# 查看 container 详细信息
$ docker inspect [container]
```

查看日志

```shell
docker logs -tf -tail 10 容器id
```

- `-t`: 显示时间戳
- `-f`: 跟随日志输出
- `--tail string`: 输出日志的条数（默认输出所有）

查看镜像元数据

```shell
$ docker inspect 33dd05bad49b
[
    {
        "Id": "33dd05bad49b9b2f4a331e7746bb540a41e150ec0b82ca5d40219aa2d5573f29",
        "Created": "2020-05-20T08:48:53.443385321Z",
        "Path": "nginx",
        "Args": [
            "-g",
            "daemon off;"
        ],
        "State": {
            "Status": "running",
            "Running": true,
            "Paused": false,
            "Restarting": false,
            "OOMKilled": false,
            "Dead": false,
            "Pid": 28262,
            "ExitCode": 0,
            "Error": "",
            "StartedAt": "2020-05-20T08:48:53.676279216Z",
            "FinishedAt": "0001-01-01T00:00:00Z"
        },
        "Image": "sha256:a00be011f00a1da2aefacca299a210eebe8e643ab95bd5a7274bdd8831255254",
        "ResolvConfPath": "/var/lib/docker/containers/33dd05bad49b9b2f4a331e7746bb540a41e150ec0b82ca5d40219aa2d5573f29/resolv.conf",
        "HostnamePath": "/var/lib/docker/containers/33dd05bad49b9b2f4a331e7746bb540a41e150ec0b82ca5d40219aa2d5573f29/hostname",
        "HostsPath": "/var/lib/docker/containers/33dd05bad49b9b2f4a331e7746bb540a41e150ec0b82ca5d40219aa2d5573f29/hosts",
        "LogPath": "",
        "Name": "/suspicious_yonath",
        "RestartCount": 0,
        "Driver": "overlay2",
        "MountLabel": "",
        "ProcessLabel": "",
        "AppArmorProfile": "",
        "ExecIDs": null,
        "HostConfig": {
            "Binds": null,
            "ContainerIDFile": "",
            "LogConfig": {
                "Type": "journald",
                "Config": {}
            },
            "NetworkMode": "default",
            "PortBindings": {
                "80/tcp": [
                    {
                        "HostIp": "",
                        "HostPort": "80"
                    }
                ]
            },
            "RestartPolicy": {
                "Name": "no",
                "MaximumRetryCount": 0
            },
            "AutoRemove": false,
            "VolumeDriver": "",
            "VolumesFrom": null,
            "CapAdd": null,
            "CapDrop": null,
            "Dns": [],
            "DnsOptions": [],
            "DnsSearch": [],
            "ExtraHosts": null,
            "GroupAdd": null,
            "IpcMode": "",
            "Cgroup": "",
            "Links": null,
            "OomScoreAdj": 0,
            "PidMode": "",
            "Privileged": false,
            "PublishAllPorts": false,
            "ReadonlyRootfs": false,
            "SecurityOpt": null,
            "UTSMode": "",
            "UsernsMode": "",
            "ShmSize": 67108864,
            "Runtime": "docker-runc",
            "ConsoleSize": [
                0,
                0
            ],
            "Isolation": "",
            "CpuShares": 0,
            "Memory": 0,
            "NanoCpus": 0,
            "CgroupParent": "",
            "BlkioWeight": 0,
            "BlkioWeightDevice": null,
            "BlkioDeviceReadBps": null,
            "BlkioDeviceWriteBps": null,
            "BlkioDeviceReadIOps": null,
            "BlkioDeviceWriteIOps": null,
            "CpuPeriod": 0,
            "CpuQuota": 0,
            "CpuRealtimePeriod": 0,
            "CpuRealtimeRuntime": 0,
            "CpusetCpus": "",
            "CpusetMems": "",
            "Devices": [],
            "DiskQuota": 0,
            "KernelMemory": 0,
            "MemoryReservation": 0,
            "MemorySwap": 0,
            "MemorySwappiness": -1,
            "OomKillDisable": false,
            "PidsLimit": 0,
            "Ulimits": null,
            "CpuCount": 0,
            "CpuPercent": 0,
            "IOMaximumIOps": 0,
            "IOMaximumBandwidth": 0
        },
        "GraphDriver": {
            "Name": "overlay2",
            "Data": {
                "LowerDir": "/var/lib/docker/overlay2/7721d11faf86cf9c741b93ffbf4a7e28ce3ff13c087978d5268030d5e5904b73-init/diff:/var/lib/docker/overlay2/45b6662c0db2ffcee7ee370e00625d6827731ab7c00ce6e381f808207bc95b99/diff:/var/lib/docker/overlay2/10763c8cd0e3058d6047fd1563b669613ca1e694627b5067acb0541d47086fc7/diff:/var/lib/docker/overlay2/8931916e6317886ef55876eccc106bf4b08e189e6df0c48224dbe099456c2651/diff:/var/lib/docker/overlay2/64d0daf1a0541ca1fb76d0fc558f32490362416048d0c96100fc36a3b559235a/diff:/var/lib/docker/overlay2/fc0efc2d2ed8e657b59e0363d3bc1359a73128f0075c576ee604714177c81bc1/diff:/var/lib/docker/overlay2/4186e39c8ea1643203b1f7fbae09c1397d92d67c7c8b414ca33841a88cbee99b/diff",
                "MergedDir": "/var/lib/docker/overlay2/7721d11faf86cf9c741b93ffbf4a7e28ce3ff13c087978d5268030d5e5904b73/merged",
                "UpperDir": "/var/lib/docker/overlay2/7721d11faf86cf9c741b93ffbf4a7e28ce3ff13c087978d5268030d5e5904b73/diff",
                "WorkDir": "/var/lib/docker/overlay2/7721d11faf86cf9c741b93ffbf4a7e28ce3ff13c087978d5268030d5e5904b73/work"
            }
        },
        "Mounts": [],
        "Config": {
            "Hostname": "33dd05bad49b",
            "Domainname": "",
            "User": "",
            "AttachStdin": false,
            "AttachStdout": false,
            "AttachStderr": false,
            "ExposedPorts": {
                "80/tcp": {}
            },
            "Tty": false,
            "OpenStdin": false,
            "StdinOnce": false,
            "Env": [
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                "NGINX_VERSION=1.15.2"
            ],
            "Cmd": null,
            "ArgsEscaped": true,
            "Image": "a00be011f00a",
            "Volumes": null,
            "WorkingDir": "",
            "Entrypoint": [
                "nginx",
                "-g",
                "daemon off;"
            ],
            "OnBuild": null,
            "Labels": {
                "maintainer": "NGINX Docker Maintainers <docker-maint@nginx.com>"
            },
            "StopSignal": "SIGTERM"
        },
        "NetworkSettings": {
            "Bridge": "",
            "SandboxID": "7d3a43d31e7c0f0ccaa73eda5e663716d6b164b53cbf961d92d8cade9f778654",
            "HairpinMode": false,
            "LinkLocalIPv6Address": "",
            "LinkLocalIPv6PrefixLen": 0,
            "Ports": {
                "80/tcp": [
                    {
                        "HostIp": "0.0.0.0",
                        "HostPort": "80"
                    }
                ]
            },
            "SandboxKey": "/var/run/docker/netns/7d3a43d31e7c",
            "SecondaryIPAddresses": null,
            "SecondaryIPv6Addresses": null,
            "EndpointID": "2b9041999d673331037c77b74e1257b6d0edc9244f959b9a67ebaca33348d4ed",
            "Gateway": "172.17.0.1",
            "GlobalIPv6Address": "",
            "GlobalIPv6PrefixLen": 0,
            "IPAddress": "172.17.0.2",
            "IPPrefixLen": 16,
            "IPv6Gateway": "",
            "MacAddress": "02:42:ac:11:00:02",
            "Networks": {
                "bridge": {
                    "IPAMConfig": null,
                    "Links": null,
                    "Aliases": null,
                    "NetworkID": "b962758317f273281ea8983b7c0b773f0606912988733773fb54ead5f49707da",
                    "EndpointID": "2b9041999d673331037c77b74e1257b6d0edc9244f959b9a67ebaca33348d4ed",
                    "Gateway": "172.17.0.1",
                    "IPAddress": "172.17.0.2",
                    "IPPrefixLen": 16,
                    "IPv6Gateway": "",
                    "GlobalIPv6Address": "",
                    "GlobalIPv6PrefixLen": 0,
                    "MacAddress": "02:42:ac:11:00:02"
                }
            }
        }
    }
]
```

## 容器交互模式

进入容器交互模式

```bash
$ docker exec -it <CONTAINER NAME> /bin/bash
$ docker exec -it <CONTAINER NAME> /bin/sh
```

退出容器交互模式

```bash
exit

# 或者

Ctrl+P+Q
```

## 帮助命令

```bash
# 查看docker 版本信息
docker version

docker info
```

## 删除

```shell
# 删除指定容器
docker rm 容器id

# 不能删除正在运行的容器
$ docker rm 293413ff8b67
Error response from daemon: You cannot remove a running container 293413ff8b67f65b4b1b034abc35785f5e3f1376ab1cb20f4cf11934aa526e44. Stop the container before attempting removal or use -f

# 强制删除指定的容器
$ docker rm -f 293413ff8b67
293413ff8b67

# 删除所有的容器
$ docker rm -f $(docker ps -aq)
$ docker ps -a -q|xargs docker rm

# 删除 container
$ docker rm [container]

$ docker rm $(docker ps --filter ancestor=ubuntu)

# 删除所有已退出的容器
$ docker rm $(docker container ls -f "status=exited" -q)
```

## 启动

```shell
# 启动一个已经停止的 container
docker start 容器id

# 重启 container (若 container 处于关闭状态，则直接启动)
docker restart 容器id
```

## 停止

```shell
# 停止当前正在运行的容器
$ docker stop [container]

# 停用所有的运行中的容器
$ docker stop $(docker ps -q)

# 强制停止容器
$ docker kill [container]
```

## 删除

```shell
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
docker rmi $(docker images -f "dangling=true" -q)
```
