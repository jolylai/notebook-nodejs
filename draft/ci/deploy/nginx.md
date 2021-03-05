---
title: Nginx
group:
  title: 部署
---

## 安装

### Ubuntu

```bash
$ sudo apt-get update
$ sudo apt-get install nginx
```

文件结构

- 所有的配置文件都在`/etc/nginx` 下，并且每个虚拟主机已经安排在了`/etc/nginx/sites-available` 下
- 程序文件在`/usr/sbin/nginx`
- 日志放在了`/var/log/nginx` 中
- 并已经在`/etc/init.d/`下创建了启动脚本 nginx
- 默认的虚拟主机的目录设置在了`/var/www/nginx-default` (有的版本 默认的虚拟主机的目录设置在了/var/www, 请参考/etc/nginx/sites-available 里的配置)

## 常用命令

- `nginx -t`: 查看 nginx 安装的位置

## 上传静态文件到服务器

```bash
$ scp -r * root@198.199.103.100:/var/www/jgefroh.com
```

## 重定向

将 `http://localhost/notebook-js/assets/css/0.styles.422b1f7a.css` 重定向到 `http://localhost/assets/css/0.styles.422b1f7a.css`

```nginx
server{
 rewrite ^/notebook-js\/(.*) /$1 permanent;
}
```

## 日志

/var/log/nginx

## 配置 nginx

`cd` 到 `/etc/nginx` 这里存放 nginx 配置文件

- 默认的目录为 `/var/www/html/`
- 默认配置 `/etc/nginx`

关注 `sites-available` 和 `sites-enabled` 这两个文件夹

- `sites-available` contains individual configuration files for all of your possible static websites.
- `sites-enabled` contains links to the configuration files that NGINX will actually read and run.

在`sites-available` 文件夹中 创建 `jgefroh.com` 文件

```nginx
server {
  listen 8000 default_server;
  listen [::]:8000 default_server;
  root /var/www/jgefroh.com;
  index index.html;
  server_name _;
  location / {
    try_files $uri $uri/ =404;
  }
}
```

将文件添加到`sites-enabled`以此告诉 nginx 来启用我们的配置

```bash
ln -s <SOURCE_FILE> <DESTINATION_FILE>

ln -s /etc/nginx/sites-available/jgefroh.com /etc/nginx/sites-enabled/jgefroh.com
```

重启 nginx 并查看效果

```bash
$ sudo systemctl restart nginx
```

## nginx 配置文件

### 基础设置说明

```nginx
# 运行用户
user www-data;
# 启动进程,通常设置成和cpu的数量相等
worker_processes  1;

#全局错误日志及PID文件
error_log  /var/log/nginx/error.log;
pid        /var/run/nginx.pid;

#工作模式及连接数上限
events {
    # epoll是多路复用IO(I/O Multiplexing)中的一种方式
    # 但是仅用于linux2.6以上内核,可以大大提高nginx的性能
    use   epoll;
    #单个后台worker process进程的最大并发链接数
    worker_connections  1024;
    # multi_accept on;
}

#设定http服务器，利用它的反向代理功能提供负载均衡支持
http {
     #设定mime类型,类型由mime.type文件定义
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    #设定日志格式
    access_log    /var/log/nginx/access.log;

    # sendfile 指令指定 nginx 是否调用 sendfile 函数（zero copy 方式）来输出文件
    # 对于普通应用，必须设为 on,如果用来进行下载等应用磁盘IO重负载应用
    # 可设置为 off，以平衡磁盘与网络I/O处理速度，降低系统的uptime.
    sendfile        on;
    #tcp_nopush     on;

    #连接超时时间
    #keepalive_timeout  0;
    keepalive_timeout  65;
    tcp_nodelay        on;

    #开启gzip压缩
    gzip  on;
    gzip_disable "MSIE [1-6]\.(?!.*SV1)";

    #设定请求缓冲
    client_header_buffer_size    1k;
    large_client_header_buffers  4 4k;

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;

    #设定负载均衡的服务器列表
    upstream mysvr {
      #weigth参数表示权值，权值越高被分配到的几率越大
      #本机上的Squid开启3128端口
      server 192.168.8.1:3128 weight=5;
      server 192.168.8.2:80  weight=1;
      server 192.168.8.3:80  weight=6;
    }


    server {
      #侦听80端口
      listen       80;
      #定义使用www.xx.com访问
      server_name  www.xx.com;

      #设定本虚拟主机的访问日志
      access_log  logs/www.xx.com.access.log  main;

      #默认请求
      location / {
        root   /root;      #定义服务器的默认网站根目录位置
        index index.php index.html index.htm;   #定义首页索引文件的名称

        fastcgi_pass  www.xx.com;
        fastcgi_param  SCRIPT_FILENAME  $document_root/$fastcgi_script_name;
        include /etc/nginx/fastcgi_params;
      }

      # 定义错误提示页面
      error_page   500 502 503 504 /50x.html;
          location = /50x.html {
          root   /root;
      }

      #静态文件，nginx自己处理
      location ~ ^/(images|javascript|js|css|flash|media|static)/ {
          root /var/www/virtual/htdocs;
          #过期30天，静态文件不怎么更新，过期可以设大一点，如果频繁更新，则可以设置得小一点。
          expires 30d;
      }
      #PHP 脚本请求全部转发到 FastCGI处理. 使用FastCGI默认配置.
      location ~ \.php$ {
          root /root;
          fastcgi_pass 127.0.0.1:9000;
          fastcgi_index index.php;
          fastcgi_param SCRIPT_FILENAME /home/www/www$fastcgi_script_name;
          include fastcgi_params;
      }
      #设定查看Nginx状态的地址
      location /NginxStatus {
          stub_status            on;
          access_log              on;
          auth_basic              "NginxStatus";
          auth_basic_user_file  conf/htpasswd;
      }
      #禁止访问 .htxxx 文件
      location ~ /\.ht {
          deny all;
      }
    }
}
```

### 设置负载均衡

```nginx
#运行用户
user www-data;
# 启动进程,通常设置成和cpu的数量相等
worker_processes  1;

# 全局错误日志及PID文件
error_log  /var/log/nginx/error.log;
pid        /var/run/nginx.pid;

#工作模式及连接数上限
events {
    # epoll是多路复用IO(I/O Multiplexing)中的一种方式
    # 但是仅用于linux2.6以上内核,可以大大提高nginx的性能
    use   epoll;
    worker_connections  1024;#单个后台worker process进程的最大并发链接数
    # multi_accept on;
}

# 设定http服务器，利用它的反向代理功能提供负载均衡支持
http {
     #设定mime类型,类型由mime.type文件定义
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    #设定日志格式
    access_log    /var/log/nginx/access.log;

    # sendfile 指令指定 nginx 是否调用 sendfile 函数（zero copy 方式）来输出文件
    # 对于普通应用，必须设为 on,如果用来进行下载等应用磁盘IO重负载应用
    # 可设置为 off，以平衡磁盘与网络I/O处理速度，降低系统的uptime.
    sendfile        on;
    #tcp_nopush     on;

    #连接超时时间
    #keepalive_timeout  0;
    keepalive_timeout  65;
    tcp_nodelay        on;

    #开启gzip压缩
    gzip  on;
    gzip_disable "MSIE [1-6]\.(?!.*SV1)";

    #设定请求缓冲
    client_header_buffer_size    1k;
    large_client_header_buffers  4 4k;

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;

    #设定负载均衡的服务器列表
     upstream mysvr {
    #weigth参数表示权值，权值越高被分配到的几率越大
    #本机上的Squid开启3128端口
    server 192.168.8.1:3128 weight=5;
    server 192.168.8.2:80  weight=1;
    server 192.168.8.3:80  weight=6;
    }


   server {
    #侦听80端口
        listen       80;
        #定义使用www.xx.com访问
        server_name  www.xx.com;

        #设定本虚拟主机的访问日志
        access_log  logs/www.xx.com.access.log  main;

    #默认请求
    location / {
          root   /root;      #定义服务器的默认网站根目录位置
          index index.php index.html index.htm;   #定义首页索引文件的名称

          fastcgi_pass  www.xx.com;
         fastcgi_param  SCRIPT_FILENAME  $document_root/$fastcgi_script_name;
          include /etc/nginx/fastcgi_params;
        }

    # 定义错误提示页面
    error_page   500 502 503 504 /50x.html;
        location = /50x.html {
        root   /root;
    }

    #静态文件，nginx自己处理
    location ~ ^/(images|javascript|js|css|flash|media|static)/ {
        root /var/www/virtual/htdocs;
        #过期30天，静态文件不怎么更新，过期可以设大一点，如果频繁更新，则可以设置得小一点。
        expires 30d;
    }
    #PHP 脚本请求全部转发到 FastCGI处理. 使用FastCGI默认配置.
    location ~ \.php$ {
        root /root;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME /home/www/www$fastcgi_script_name;
        include fastcgi_params;
    }
    #设定查看Nginx状态的地址
    location /NginxStatus {
        stub_status            on;
        access_log              on;
        auth_basic              "NginxStatus";
        auth_basic_user_file  conf/htpasswd;
    }
    #禁止访问 .htxxx 文件
    location ~ /\.ht {
        deny all;
    }
  }
}
```

## 重启

```bash
$ sudo systemctl start nginx
$ sudo systemctl reload nginx
```
