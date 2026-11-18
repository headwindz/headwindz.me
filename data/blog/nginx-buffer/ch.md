---
title: 'Nginx 缓冲区：修复 ERR_CONTENT_LENGTH_MISMATCH'
summary: '排查 Nginx 下的 ERR_CONTENT_LENGTH_MISMATCH，并了解几种修复方法。'
---

## 背景情况

我每天的开发工作一直使用Nginx作为[反向代理](https://en.wikipedia.org/wiki/Reverse_proxy). 升级Nginx后，它停止了对大文件的正确服务:一个从webpack中构建的`vendor.js`文件没有得到适当的服务。 Chrome Conferme 显示:

```bash
GET http://nginx.example.com/dist/js/vendor.js net::ERR_CONTENT_LENGTH_MISMATCH
```

### 初步意见

- Chrome DevTools 网络标签显示`vendor.js`请求，状态代码为 200
- 响应信头看起来正确，但是在 Chrome DevTools 中没有内容预览
- 响应内容- Length页眉匹配实际文件大小(4.6MB)

```bash
# ls -l : get the size in bytes
-rw-r--r--  1  michaelzheng  staff   4844863 Jul  2 17:00 vendor.js

# ls -lh : get the size in human readable format
-rw-r--r--  1  michaelzheng  staff   4.6M Jul  2 17:00 vendor.js
```

- 下一个诊断步骤是将失败的代理 URL 与 Nginx 错误日志中显示的上游 URL 相比较。 记录每个浏览器或`curl`请求的用途 。 仅一个成功的请求并不能确定它是否绕过 Nginx 。

## 理解 Nginx 代理缓冲

调试前，了解Nginx代理缓冲如何工作很重要:

### 什么是代理缓冲？

当Nginx作为反向代理时，它可以在发送到客户端之前缓冲上游服务器的响应.这样Nginx就可以:

1. **更快地释放上游连接**- 上游可以向其他请求移动
2. **处理慢客户端**- Nginx 缓冲响应并按客户端的速度发送
3. **优化吞吐量**- 减少系统调用次数，提高整体性能。

### 当使用缓冲时

由于`proxy_buffering on`(是默认的), Nginx在向客户端发送数据时将上游响应读入内存缓冲器。如果响应无法在这些缓冲器内处理，它可以在代理临时文件设置下将部分响应写入临时文件。 缓冲和磁盘溢出是不同的阶段 。

见[Nginx代理缓冲文件](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffering).

### 缓冲等级

Nginx使用双层缓冲系统:

1. **内存缓冲器**- 由`proxy_buffers`(快速控制，有限)
2. **磁盘缓冲器**- 由`proxy_temp_path`(控制较慢，容量较大)

当内存缓冲器满载时，Nginx会将数据溢出到`proxy_temp_path`的临时文件中。

## 调试步骤

### 1. 定位 Nginx 配置

```bash
nginx -t
# nginx: the configuration file /usr/local/etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /usr/local/etc/nginx/nginx.conf test is successful
```

此命令显示配置文件位置并验证语法 。

### 2. 查找错误日志位置

请检查access-date=中的日期值 (帮助)`nginx.conf`为`error_log`指令。 E.

```nginx
error_log /usr/local/var/log/nginx/error.log warn;
```

### 3. 检查错误日志

```bash
tail -f /usr/local/var/log/nginx/error.log
```

关键错误揭示:

```bash
2018/07/02 22:29:27 [crit] 14586#0: *3641 open() "/usr/local/var/run/nginx/proxy_temp/1/08/0000000081" failed
(13: Permission denied) while reading upstream, client: 127.0.0.1, server: nginx.example.com,
request: "GET /dist/js/vendor.js HTTP/1.1", upstream: "http://127.0.0.1:8080/dist/js/vendor.js",
host: "nginx.example.com", referrer: "http://nginx.example.com/testabc"
```

**关键洞察**:文件对内存缓冲器来说太大，因此Nginx试图写入`proxy_temp`,但缺乏权限。

### 4. 验证 Nginx 进程所有者

```bash
ps -eo user,group,args | grep nginx
# Inspect both USER and GROUP for the nginx worker process.
# The master can run as root while workers use a different identity.
```

工人流程运行为`nobody`,需要写入`proxy_temp`.

### 5. 检查目录权限

```bash
ls -la /usr/local/var/run/nginx/proxy_temp
# drwx------  2 root  wheel  64 Jul  2 17:00 proxy_temp
```

该目录由`root`拥有，拥有`700`权限，阻止了`nobody`的写作。

## 解决方案

### 解决方案1:固定目录权限(推荐)

使用您机器上观察到的工人用户和组。下面的原始所有者命令使用`nobody:admin`。在调整前验证工人在安装上的实际用户和组。 工人需要写入和翻转访问临时目录。 仅将根属目录更改为`755`并不允许非所有者写入 :

```bash
# Change owner to nginx worker user
sudo chown -R nobody:admin /usr/local/var/run/nginx/proxy_temp
# Or set broader permissions (less secure)
sudo chmod 755 /usr/local/var/run/nginx/proxy_temp
```

**Pros:**(英语).

- 在启用缓冲时保持最佳性能
- 允许 Nginx 高效处理大文件
- 不需要更改配置

**康斯:**

- 在 Nginx 升级后可能重新设置
- 需要 root 访问

### 解决方案2: 禁用代理缓冲

添加到您的`nginx.conf`或服务器块中 :

```nginx
location / {
  proxy_pass http://upstream_server;
  proxy_buffering off;
}
```

**Pros:**(英语).

- 完全取消许可问题
- 更简单的配置
- 内存使用率较低

**康斯:**

- 大型响应的性能较慢
- 上游连接开口时间更长
- 不建议与慢客户生产

### 解决方案 3: 更改缓冲目录位置

指定 Nginx有权限的自定义路径 :

```nginx
http {
  proxy_temp_path /var/tmp/nginx/proxy_temp;
}
```

创建和设定权限 :

```bash
sudo mkdir -p /var/tmp/nginx/proxy_temp
sudo chown -R nobody:admin /var/tmp/nginx/proxy_temp
sudo chmod 755 /var/tmp/nginx/proxy_temp
```

**Pros:**(英语).

- 保持缓冲性能
- 对缓冲位置的更多控制
- 可以指定更大的磁盘空间

**康斯:**

- 需要改变配置
- 需要确保目录在反复出现时持续

## 结论

在此事件中，Nginx 错误日志识别出一个临时指令权限失败。 浏览器错误仅表示响应与声明的长度不符。其他原因需要不同的修正。 了解 Nginx 的缓冲机制有助于您选择正确的解决方案 :

- **在大多数情况下**: 修补权限(解决方案 1)
- **用于流线/实时**: 禁用缓冲(解决方案 2)
- **用于复杂设置**:自定义临时路径(解决方案 3)

更改所有权或配置后，验证配置，必要时重新装入 Nginx, 并重复相同的代理请求。确认完整响应到达，并且权限错误不再出现在日志中。如果不匹配仍然存在，则比较上游响应；然后在改变生产中的缓冲行为之前用一个慢客户端进行测试 。
