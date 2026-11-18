---
title: '理解 HTTP 协议'
summary: '理解 HTTP 方法、状态码、请求头与响应头、代理模式，以及 CORS、XSS 和 CSRF 涉及的安全边界。'
---

# 导言

HTTP 描述请求和响应语义: 方法意味着什么，一个状态如何报告结果，以及信头如何控制解释和缓存。这是这些决定的参考，然后是中介和运输安全概览。 完整的登录流程，请参见[认证指南](/blog/guide-to-authentication)。

# HTTP 状态代码

HTTP 状态代码是三位数，表示HTTP 请求的结果。 参考[完整的 HTTP 状态代码列表](https://toolhub.run/tools/http-status-code),作为充分参考.让我们探索一些最重要和相关的数字:

## 301 - 永久重新定向

301 状态代码显示请求的资源已被永久移动到一个新的 URL 。这对 SEO 至关重要，因为搜索引擎会更新索引以指向新位置 。

**使用大小写:**

- 网站域名变化
- URL 结构重组
- 合并重复内容

```js
// Example: express.js permanent redirect
app.get('/old-page', (req, res) => {
  res.redirect(301, '/new-page')
})
```

## 302 - 临时改道

与301不同的是，302状态代码表示临时重定向。 原URL仍应用于未来请求。

**使用大小写:**

- A/B 测试不同的页面版本
- 临时维护页面
- **URL 缩短服务**- 短链接使用302重定向来保存原短URL上的解析功能

**能重定向 ajax 请求吗?**

是的，ajax 请求可以自动跟踪方向。然而，行为取决于 HTTP 方法 :

- `GET`请求: 浏览器会自动跟踪方向
- `POST`请求:浏览器可能将方法更改为`GET`当跟随方向调整时(取决于状态代码)

```js
// Ajax will automatically follow redirects
fetch('/api/endpoint').then((response) => {
  // If there was a redirect, response.url will show the final URL
  console.log('Final URL:', response.url)
  return response.json()
})
```

## 304 -未修改的(缓存)

304状态代码用于**有条件请求**以杠杆浏览器缓存。当一个客户端拥有缓存版本的资源时，它可以发送一个带有`If-Modified-Since`或`If-None-Match`等信头的有条件请求。如果资源没有改变，服务器会以 304 响应，浏览器会使用其缓存版本。

```http
// Request with conditional headers
GET /style.css HTTP/1.1
Host: example.com
If-Modified-Since: Wed, 21 Oct 2025 07:28:00 GMT

// Response (resource not modified)
HTTP/1.1 304 Not Modified
Cache-Control: max-age=3600
```

这大大降低了带宽的使用，并改进了页面载荷时间。

## 401 - 需要认证

401状态代码表示请求需要**认证**. 客户端必须提供访问资源的有效证书。

```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="example"
```

**常见认证方法:**

- 基本认证
- (JWT)持枪手代号
- 奥奥特
- 证交会
- QRCodes 参数

关于认证方法的完整指南，参见[网络认证方法的完整指南](https://headwindz.me/blog/guide-to-authentication)

## 403 - 禁止(授权)

虽然401大约是**认证**(证明你是谁),但403大约是**授权**(允许您做什么)。即使拥有有效的证书，您也可能没有访问资源的权限。例如，一个普通用户可能被认证并允许在一个论坛查看帖子，但在试图删除另一个用户创建的帖子时，他们会得到一个403错误，因为他们缺乏必要的授权，如管理员特权或职位所有权等。

```js
// Authentication
if (!user) {
  return res.status(401).json({ error: 'Authentication required' })
}
// Authorization
if (!user.hasPermission('admin')) {
  return res.status(403).json({ error: 'Insufficient permissions' })
}
```

## 429 - 请求过多

一个429状态代码表明，用户在给定的时间内发送了太多的请求(率限制).

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 3600
```

**常用案例:**

- 防止虐待的API比率限制
- 防止DDoS攻击
- 确保公平使用资源

```js
// Express rate limiting example
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests, please try again later',
})

app.use('/api/', limiter)
```

## 500 - 内部服务器错误

一个500状态代码显示服务器遇到了一个意外的条件，使其无法满足请求。

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{"error": "An unexpected error occurred"}
```

**常见原因:**

- 服务器代码中未处理的例外
- 数据库连接失败
- 缺少配置
- 代码错误

**最佳实践:**总是记录500个错误，并将通用消息还给客户端(不暴露内部细节).

## 502 - 坏门

一个502状态代码表示，一个作为`gateway`或`proxy`的服务器收到了来自上游服务器的无效响应。

```http
HTTP/1.1 502 Bad Gateway
```

**常见原因:**

- 后端应用程序服务器已下线
- 无效或不完整的上游反应。 通常报告超时为504次
- 反向代理无法到达后端
- DNS 解析失败

## 503 - 服务不可用

一个503状态代码表示服务器暂时无法处理请求，通常是由于维护或超载。

```http
HTTP/1.1 503 Service Unavailable
Retry-After: 120
```

**常见原因:**

- 预定维修
- 服务器超载
- 部署期间顺利关闭
- 数据库维护

```js
// Maintenance mode example
app.use((req, res, next) => {
  if (process.env.MAINTENANCE_MODE === 'true') {
    return res.status(503).json({
      error: 'Service temporarily unavailable for maintenance',
    })
  }
  next()
})
```

## 504 - 网关超时

一个网关或代理在无法从完成请求所需的上游服务器及时收到回复时返回504。将其上游时间和错误日志与后端日志进行比较。一个502转而表示一个无效的上游响应。[HTTP网关状态代码为](https://www.rfc-editor.org/rfc/rfc9110.html#section-15.6)。

# HTTP页眉

HTTP 信头是随请求和回复而发送的密钥值对，用于传送通信元数据。它们控制缓存、认证、内容类型、安全政策等等。

## 请求信头

请求信头由客户端发送，以提供有关请求和客户端本身的信息。

### 主机头

`Host`头在HTTP/1.1及后期版本中至关重要，它指定了服务器的域名，并可以选择TCP端口号。

**为什么重要?**

单一的IP地址可以托管多个网站(虚拟托管).`Host`头条告诉服务器客户端想要访问哪个网站。

```http
GET /index.html HTTP/1.1
Host: www.example.com
```

**没有主机头**,当多个域指向同一个IP地址时，服务器不会知道要服务哪个网站。

```nginx
// Nginx virtual host configuration example
server {
  listen 80;
  server_name example.com;
  root /var/www/example;
}

server {
  listen 80;
  server_name another.com;
  root /var/www/another;
}
```

### 内容类型标题(请求)

当将数据发送到 POST 中的服务器(, PUT, 或 PATCH 请求)时，`Content-Type`头条会告诉服务器如何解释请求体。这对正确分析数据至关重要 。

#### 1. 申请/Json

现代API中最常见的内容类型。 曾发送结构化数据。

```js
// Client-side example
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John', email: 'john@example.com' }),
})
```

```http
<!-- Raw http -->
POST /api/users HTTP/1.1
Host: example.com
Content-Type: application/json
{"name": "John", "email": "john@example.com"}
```

**后端解析:**

```js
// Node.js (vanilla HTTP server)
const http = require('http')

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/users') {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', () => {
      const data = JSON.parse(body) // Parse JSON string
      console.log(data.name) // "John"
      console.log(data.email) // "john@example.com"
      res.end(JSON.stringify({ success: true }))
    })
  }
})
```

#### 2. 应用程序/x-www-form-urlencoded

用于简单的 HTML 格式提交。数据被编码为由`&`分隔的密钥值对 。

```html
<form action="/login" method="POST">
  <input type="text" name="username" />
  <input type="password" name="password" />
  <button type="submit">Login</button>
</form>
```

```http
<!-- Raw http -->
POST /login HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded

username=john_doe&password=secretpass123
```

**后端解析:**

```js
// Node.js (vanilla HTTP server)
const http = require('http')
const querystring = require('querystring')

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/login') {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', () => {
      // Parse form-encoded data: key1=value1&key2=value2
      const data = querystring.parse(body)
      console.log(data.username) // "john_doe"
      console.log(data.password) // "secretpass123"
      res.end(JSON.stringify({ authenticated: true }))
    })
  }
})
```

#### 3.多部分/形式数据

在通过 HTML 格式上传文件时使用。它允许发送二进制数据(如图像、视频、PDF)与单项请求中的文本数据一起。

```html
<form action="/upload" method="POST" enctype="multipart/form-data">
  <input type="text" name="username" />
  <input type="file" name="avatar" />
  <button type="submit">Upload</button>
</form>
```

**后端解析:**

服务器需要解析多段数据以提取单个字段和文件，正文被分隔成以边界分隔的部分。

```http
POST /upload HTTP/1.1
Host: example.com
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="username"

john_doe
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="avatar"; filename="photo.jpg"
Content-Type: image/jpeg

[binary data]
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

```js
// Node.js (vanilla - simplified example)
const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/upload') {
    // Extract boundary from Content-Type header
    const boundary = req.headers['content-type'].split(';')[1].trim().replace('boundary=', '')

    // Manually parse multipart body (complex - usually handled by libraries)
    let body = Buffer.alloc(0)
    req.on('data', (chunk) => {
      body = Buffer.concat([body, chunk])
    })

    req.on('end', () => {
      // Split by boundary and extract parts
      const parts = body.toString().split(`--${boundary}`)
      // Further parsing needed to extract fields and files
      res.end('Upload received')
    })
  }
})
```

**注:**多段解析是复杂的，所以大多数框架和语言都为这个内容类型提供内置或库支持。

#### 文本/说明

原始文本数据发送到服务器 。

```http
<!-- Raw http -->
POST /api/logs HTTP/1.1
Host: example.com
Content-Type: text/plain
```

**后端解析**

```js
// Node.js (vanilla HTTP server)
const http = require('http')

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/logs') {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', () => {
      console.log('Received log:', body) // Raw text string
      res.end(JSON.stringify({ received: true }))
    })
  }
})
```

### 用户代理信头

识别请求的客户端应用程序。 可用于记录、 分析、 兼容性决定 。

```bash
GET /index.html HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
```

### 接受信头

告诉服务器客户端可以处理什么内容类型。服务器应当优先返回所请求的格式。

```bash
GET /api/data HTTP/1.1
Host: api.example.com
Accept: application/json, application/xml;q=0.9, */*;q=0.8
```

`q`参数表示质量/首选(1.0是最高的).

### 参考页眉

指定请求的页面的 URL。可用于解析和安全(CSRF 保护)。

```bash
GET /article/123 HTTP/1.1
Host: example.com
Referer: https://example.com/search?q=javascript
```

**注:**标题名称因历史原因被误拼为"参考",而非"参考".

## 答复信头

响应信头由服务器发送，以提供有关响应和服务器行为的信息。

### 内容类型标题(响应)

在回应中，`Content-Type`告诉客户端如何解释响应体，由服务器根据返回的资源设置。

```bash
HTTP/1.1 200 OK
Content-Type: application/json

{"id": 1, "name": "John"}
```

常见响应内容类型 :

- `text/html`- HTML 文档
- `application/json`- JSON 数据
- `text/css`- CSS 样式表
- `application/javascript`- JavaScript文件
- `image/png`,`image/jpeg`- 图像
- `application/pdf`- PDF 文档

### 缓存控制头

控制浏览器和代理器的缓存行为，减少带宽和改善性能。

```bash
# Public resource, cached for 1 hour
HTTP/1.1 200 OK
Cache-Control: public, max-age=3600

# Private resource, cached for 24 hours
HTTP/1.1 200 OK
Cache-Control: private, max-age=86400

# Always revalidate before using
HTTP/1.1 200 OK
Cache-Control: no-cache, must-revalidate
```

共同指令:

- `max-age=<seconds>`- 资源是否有效
- `public`-可以被任何缓存缓存
- `private`-只有客户端可以缓存，而不是代理
- `no-cache`-在使用前必须重新验证服务器
- `no-store`-从不缓存

### 设置曲奇页眉

向客户端发送 cookie , 以便存储并随未来请求一起发送。

```bash
HTTP/1.1 200 OK
Set-Cookie: sessionId=abc123; Path=/; HttpOnly; Secure; SameSite=Strict
```

安全属性 :

- `HttpOnly`- Cookie通过 JavaScript(无法访问 防止XSS 盗窃)
- `Secure`-只通过 HTTPS 发送
- `SameSite`- 防范CSRF攻击(严格，Lax,或无)

### 访问控制- 低源头

CORS的一部分，告诉浏览器哪些来源可以访问此资源。

```bash
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://trusted-site.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

### 安保头

加强安全的重要信头:

```bash
HTTP/1.1 200 OK
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
```

- `Strict-Transport-Security`- 强制 HTTPS 连接
- `X-Content-Type-Options`- 防止MIME 类型嗅觉
- `X-Frame-Options`- 防止点击劫持
- `Content-Security-Policy`- 控制哪些资源可以装入

# HTTP 方法

HTTP 定义了几种方法来表示对资源的理想行动 :

## 获取( G)

**检索**数据来自服务器。应该**专有** (多项相同的请求应具有同等效力)没有副作用。

```js
fetch('/api/users/123').then((res) => res.json())
```

## 员额

**提交**数据以创建新资源。不是一元数据:多个相同的请求可能创建多个资源 。

```js
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John', email: 'john@example.com' }),
})
```

## 装入

**完全替换**现有资源。同上:多个相同的请求应具有同样的效果。

```js
fetch('/api/users/123', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John Doe', email: 'john@example.com' }),
})
```

## 补丁

**部分更新**a 资源。根据执行情况，May 或 可能不是 idepotenty 。

```js
fetch('/api/users/123', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'newemail@example.com' }),
})
```

## 删除

**删除**a 资源.同上:删除相同的资源多次，其效果与删除一次相同。

```js
fetch('/api/users/123', {
  method: 'DELETE',
})
```

# 代理和网关

## 网关

在 HTTP 术语中，一个**网关**, 也叫反向代理，接受请求，好像它是一个源服务器，并将其转发到后端服务。它可能翻译协议，但不需要翻译 。 应用程序**API网关**经常会添加认证，速率限制，并请求路径到这个服务器连接的边界 。

**前置代理**由客户端选择代表客户端发送请求。 有用的区分是哪一方选择中间体以及它如何呈现自己，而不是两个连接是否使用相同的协议.见[HTTP 中间体定义](https://www.rfc-editor.org/rfc/rfc9110.html#section-3.7).

## 代理角色

### 转发代理

一个前置代理在客户端和互联网之间坐落着。 客户端明确向代理端发送请求，然后由代理端转发到目的地服务器。

**福利:**

- 匿名:从目标服务器中隐藏客户端 IP 地址
- 内容过滤: 封锁对某些网站或内容的访问
- 缓存:改进经常访问资源的性能
- 附带地理限制:从不同区域获取内容
- 监测:跟踪和记录客户活动

**使用大小写:**

- 公司网络安全:监测雇员互联网的使用
- ISP级缓存:减少带宽使用
- VPN服务: 隐藏实际IP地址

```
Client → Forward Proxy → Internet → Destination Server
```

### 反转代理

一个反向代理坐在网络服务器前，将客户端请求转发到相应的后端服务器，客户端不知道自己正在和代理服务器通信，他们认为自己在和源服务器交谈。

**福利:**

- 负载平衡:在多个后端服务器之间均匀分布流量
- 缓存:存储经常访问的静态和动态内容
- 安全性: 隐藏后端服务器细节，充当防火墙
- 压缩:在发送到客户端前压缩响应
- 请求路由:基于URL,主机名或其他标准的道路。

**使用大小写:**

- Web 服务器加速: Nginx, Apache 逆向代理在应用程序服务器前
- CDN:云浮，阿卡迈作为全球反向代理
- API 缩放:在多个后端服务器中分配 API 请求
- 零下限部署:服务器版本之间逐步转移流量

```
Client → Internet → Reverse Proxy → Backend Server 1
                                  → Backend Server 2
                                  → Backend Server 3
```

**示例设置:**

```nginx
# Nginx reverse proxy configuration
upstream backend {
  server backend1.example.com:8080;
  server backend2.example.com:8080;
  server backend3.example.com:8080;
}

server {
  listen 80;
  server_name api.example.com;

  location / {
    proxy_pass http://backend;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

**大众反向代词:**Nginx, Apache, HAProxy, Cloudflare, AWS ALB

## 在需要时合并责任

| 角色                 | 边界          | 典型责任                         |
| -------------------- | ------------- | -------------------------------- | -------------- |
| 转发代理             | 由客户端      | 输出访问策略，转发，缓存         |
| 逆向代理 / HTTP 网关 | 向客户端      | 后端路由，TLS 终止，负载平衡     | 呈现一个源接口 |
| 应用程序 API网关     | 应用程序 APIs | 认证，配额，路由，任择议定书翻译 |

一个服务可以执行其中的几个任务.一个应用程序可能会将Nginx放到API网关前，但额外的hop需要一个单独的所有权或政策要求等原因；它不是名词所要求的。

# 警卫

## 交叉来源资源共享(CORS)

Web浏览器为安全执行**Same-Origin Policy**,它限制了一个来源的文档或脚本如何与另一个来源的资源互动。

**起源**由以下部分组成: 1.

- 协议(HTTP/HTTPS)
- 域名(例如.com)
- (80, 443等港口)

```js
// Same origin
https://example.com/page1
https://example.com/page2

// Different origins
https://example.com (different protocol)
http://example.com

https://api.example.com (different subdomain)
https://example.com

https://example.com:8080 (different port)
https://example.com
```

**CORS头部**允许服务器指定哪些源头可以访问其资源:

```js
// Server-side CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://trusted-site.com')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
})
```

**飞行前请求:**对于复杂的请求(非简单化方法，自定义标题),浏览器会先发送一个选项请求，以检查是否允许实际请求。

要测试请求是否会触发 CORS 限制，请使用[Will It CORS ?](https://toolhub.run/tools/will-it-cors)

## XSS(跨站脚本)

XSS 发生在攻击者将恶意脚本注入其他用户浏览的网页时。 发生在用户输入未在提供前正常进行静态处理时。

**示例易译代码:**

```js
// Dangerous! User input directly inserted into HTML
app.get('/search', (req, res) => {
  const query = req.query.q
  res.send(`<h1>Search results for: ${query}</h1>`)
})

// Attack: /search?q=<script>alert('XSS')</script>
```

**预防:**

1. **在渲染前退出用户输入**
2. 使用**内容安全政策(CSP)**标题
3. 将 HTML 输入设置为安全
4. 使用默认自动逃逸的现代框架(反应，Vue)

```js
// Safe: Using template engines with auto-escaping
app.get('/search', (req, res) => {
  res.render('search', { query: req.query.q }) // Auto-escaped
})

// CSP header
res.setHeader('Content-Security-Policy', "default-src 'self'")
```

### 中国SRF(跨场请求伪造)

CSRF在被认证的网络应用程序上 利用认证的用户 来实施不想要的行动

**攻击情景:**

1. 用户登录到`bank.com`
2. 用户访问恶意网站`evil.com`
3. `evil.com`包含:`<img src="https://bank.com/transfer?to=attacker&amount=1000">`
4. 浏览器随请求自动发送 cookie
5. 银行向攻击者转移资金

**预防:**

```js
// 1. CSRF tokens
app.use(csrf())

app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() })
})

// 2. SameSite cookie attribute
res.cookie('session', sessionId, {
  httpOnly: true,
  sameSite: 'strict', // or 'lax'
})

// 3. Verify Origin/Referer headers
app.use((req, res, next) => {
  const origin = req.get('origin')
  if (origin && !origin.includes('trusted-domain.com')) {
    return res.status(403).send('Forbidden')
  }
  next()
})
```

## SQL 注射

SQL注入发生在用户输入直接被压缩成SQL查询时，允许攻击者执行任意的SQL命令。

**脆弱码:**

```js
// Dangerous!
const userId = req.params.id
const query = `SELECT * FROM users WHERE id = ${userId}`
db.query(query)

// Attack: /users/1 OR 1=1-- (returns all users)
```

**预防:**

```js
// Use parameterized queries / prepared statements
const query = 'SELECT * FROM users WHERE id = ?'
db.query(query, [userId])

// Or use ORMs
const user = await User.findById(userId)
```

**通则:\*\***从不信任用户输入.\*\*在构建SQL语句或提供HTML中的用户数据时，总是验证，消毒，并使用参数化的查询。

# HTTPS 和加密

HTTPS使用TLS保护HTTP消息，提供保密性，完整性和服务器认证。 运输依赖于HTTP版本。

## http/1.1和http/2的TCP握手

对于基于TCP的HTTPS新连接，TCP握手在TLS谈判安全之前建立运输:

1. 客户端发送SYN.
2. 服务器以SYN-ACK回复。
3. 客户发送ACK。

HTTP/3在UDP上使用QUIC,并将TLS 1.3集成到QUIC的连接建立中；它并非从这个TCP交换开始.[HTTP/3规格](https://www.rfc-editor.org/rfc/rfc9114.html).

## TLS 1. 3 证书认证握手

以下是使用瞬间密钥协议的简化全握手方式，而不是PSK会议续会:

1. **客户端 Hello:**客户端提供支持的版本，算法，和密钥股份。
2. **Server Hello:**服务器选择参数并供应其密钥份额，两个对等方都获得握手流量密钥。
3. **服务器认证:**服务器发送加密的握手消息，包括证书链、 证书验证签名和完成。 客户端检查链、主机名、 有效性、 签名和完成值 。
4. **客户端完成:**客户端完成握手。 应用程序流量使用衍生的对称流量密钥。

<SketchDiagram
  src="/static/images/understanding-http/tls-handshake.svg"
  alt="TLS 1.3 handshake: client and server exchange key shares, derive handshake keys, authenticate the server, and exchange protected HTTP data."
  width={960}
  height={900}
/>

服务器的证书密钥认证握手。它不用于加密 TLS 1. 1. 3 中的客户端生成的预主机密钥。 旧的RSA 密钥传输模式已经从协议中删除 。[TLS 1. 3 规格](https://www.rfc-editor.org/rfc/rfc8446.html)。

## 关键协议、签名和对称保护

公钥机制服务于不同的工作: 密钥协议建立共享的密钥，而签名则认证对等和握手。对称认证加密，如 AES- GCM 或 ChaCha20- Poly1305 ,然后有效保护流量。 将这些加密视为单独的操作，而不是将所有公钥加密描述为用公钥加密，用私钥解密 。

# 结论

整体读取一个 HTTP 交换器: 方法表达请求的动作，状态报告结果，并且信头描述如何解释，缓存，或处理信件。 代理可以沿途添加路由和政策，而 HTTPS 则保护带这些信件的连接 。

调试时，请从您可以观察到的请求和响应开始 。请检查方法、 URL、 状态和相关标题，然后通过任何中介跟踪请求 。 TLS 失败可能使 HTTP 回复无法到达，因此在应用特定版本解释前先检查谈判的 HTTP 和 TLS 版本 。
