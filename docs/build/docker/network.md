---
title: docker 网络
group:
  title: 网络管理
---

![](https://cy-picgo.oss-cn-hangzhou.aliyuncs.com/docker-network.png)

```shell
$ ip addr
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 00:16:3e:14:54:f7 brd ff:ff:ff:ff:ff:ff
    inet 172.18.100.102/20 brd 172.18.111.255 scope global dynamic eth0
       valid_lft 298946510sec preferred_lft 298946510sec
3: docker0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default
    link/ether 02:42:ba:cc:06:b0 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 scope global docker0
       valid_lft forever preferred_lft forever
```

启动 nginx 容器

```shell
$ docker run -d -P --name nginx  nginx:1.15.2-alpine
$ docker run -d -P --name --net bridge nginx  nginx:1.15.2-alpine
```

查看容器内部网络地址

```shell
$ docker exec -it nginx ip addr
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
57: eth0@if58: <BROADCAST,MULTICAST,UP,LOWER_UP,M-DOWN> mtu 1500 qdisc noqueue state UP
    link/ether 02:42:ac:11:00:03 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.3/16 brd 172.17.255.255 scope global eth0
       valid_lft forever preferred_lft forever
```

docker 分配了一个`eth0@if58` 网络，ip 为`172.17.0.3`，使用 ping 试下网络能不能使用

```shell
$ ping 172.17.0.3
PING 172.17.0.3 (172.17.0.3) 56(84) bytes of data.
64 bytes from 172.17.0.3: icmp_seq=1 ttl=64 time=0.080 ms
64 bytes from 172.17.0.3: icmp_seq=2 ttl=64 time=0.067 ms
```
