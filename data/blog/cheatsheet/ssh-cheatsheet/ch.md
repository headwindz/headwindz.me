---
title: '我的 SSH 速查表'
summary: '开发者常用的 SSH 命令与配置速查。'
---

> sh(SSH 客户端)是一个用于登录远程机器以及执行远程机器命令的程序。它旨在通过一个不安全的网络提供两个未信任主机之间的加密安全通信。

SSH通常用于:

- 安全远程服务器管理
- 文件传输
- 隧道和端口转发
- 部署和自动化

## 基本 SSH 命令

连接到远程服务器 :

```bash
ssh username@remote_host
```

使用特定身份(私钥):

```bash
ssh -i path/to/key_file username@remote_host
```

使用特定端口 :

```bash
ssh username@remote_host -p 2222
```

远程运行命令 :

```bash
ssh remote_host command -with -flags
```

## 高级 SSH 使用

动态端口在本地主机上转发(SOCKS 代理: 9999):

```bash
ssh -D 9999 -C username@remote_host
```

SSH 跳跃:通过跳动主机(多个跳跃连接，以逗号)分隔 :

```bash
ssh -J username@jump_host username@remote_host
```

## 公钥认证

本地系统有一个加密密钥对- 公钥和私钥。 服务器配置是为了通过添加到[~. ssh/ 授权\_ keys](https://www.ssh.com/ssh/authorized_keys/)中来识别公钥。 任何拥有对应私钥的人都会被允许访问服务器 。

### 如何设置公钥认证

1. 生成密钥对 :
   ```bash
   ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
   ```
2. 复制您的公钥到服务器(`ssh-copy-id`必须安装在您的本地机)上 :
   ```bash
   ssh-copy-id username@remote_host
   ```
3. 在单独的终端中，与`ssh -i ~/.ssh/id_rsa username@remote_host`(连接，替换您生成的)键。确认您使用密钥到达了预定的账户。一个密钥密码句会提示解锁本地密钥。它不同于远程账户密码。在检查新登录方法时，保持您现有的会话的开放 。

**安全提示:**从不分享您的私人密钥。 保持安全，并考虑使用密码句 。

## 客户端配置设置

而不是烦人的打字

```bash
ssh root@203.0.113.10 -p 2333
```

我们可以在`~/.ssh/config`中设置 ssh 配置

```bash
Host remoteServer           # host name alias that is easy to memorize
HostName 203.0.113.10     # host ip or host name
User root                   # user
Port 2333                   # port
IdentityFile ~/.ssh/id_rsa  # private key location
```

然后我们就可以用简单的打字来做等效的:

```bash
ssh remoteServer
```

## 参考资料

- [SSH 手册](https://man.openbsd.org/ssh)
- [SSH 配置指南](https://www.ssh.com/academy/ssh/config)
