---
title: '理解第三方 Cookie'
summary: '理解第三方 Cookie、跨源请求的配置要求，以及现代浏览器如何限制跨站跟踪。'
---

# 第三方Cookie是什么？

Cookie的主机范围决定了它可以发送到哪里。 其使用是第一方还是第三方取决于顶级页面的站址和请求上下文，而不仅仅是两个主机名称是否不同。

**源代码**包含方案、主机和端口。对于这里讨论的 cookie 上下文，**站点**使用方案并注册域。这些 HTTPS 示例说明了区别 :

| Page                      | 请求目的地                    | 关系           |
| ------------------------- | ----------------------------- | -------------- |
| `https://app.example.com` | `https://app.example.com/api` | 同一来源和地点 |
| `https://app.example.com` | `https://api.example.com`     | 跨源，同址     |
| `https://app.example.com` | `https://widget.example.org`  | 跨源、跨地点   |

一个嵌入式服务在不同网站使用的Cookie通常被称为第三方Cookie. 在同一站点子域之间共享一个父域Cookie本身并不能使该Cookie成为第三方.见[同一站点相对于同一来源的](https://web.dev/articles/same-site-same-origin).

诊断 cookie 失败分为四个部分:主机/路径范围、 SameSite 资格、请求的证书模式和浏览器隐私政策。对于跨源响应的脚本访问，也检查 CORS 。

# 在铬中查看Cookie

1. 打开铬脱硫槽(`F12`或`Cmd+Option+I`)
2. 导航到**应用程序**标签
3. 扩展**存储**→**Cookie**
4. 选择要查看 cookie 的域

**Protip**:点击Cookie可以查看其所有属性(域，路径，过期，Htp Only,安全，SameSite等.)

# 常用案例

一些整合使用第三方Cookie用于:

- 嵌入式或静默式签名检查；基于重定向的SSO 内在不需要第三方 cookie
- 嵌入内容(社交媒体部件，支付表)
- 分析和跟踪
- 广告和重新瞄准目标
- 跨域购物车的坚持性

**示例情景**:`payments.example.org`的付款部件嵌入在`shop.example.com`上。它的Cookie正在跨站点上下文中使用。 相比之下，`shop.example.com`和`blog.example.com`共享的 HTTPS 拖车是同一站点的子域箱；它需要合适的 cookie主机范围，而不是第三方状态 。

# Cookie 安全属性

理解Cookie属性对于安全和适当的功能至关重要:

## 仅限

防止 JavaScript 访问 cookie , 减轻XSS(跨块脚本)攻击 :

```bash
Set-Cookie: sessionId=abc123; HttpOnly
```

**效应:**

```js
// ❌ Cannot access HttpOnly cookies
document.cookie // sessionId won't appear here

// ✅ Only accessible by server
// Sent automatically with HTTP requests
```

**最佳实践**:总是为认证符和敏感Cookie设置`HttpOnly`.

## 安全

确保Cookie仅通过HTTPS传输，防止拦截:

```js
Set-Cookie: authToken=xyz789; Secure
```

**重要**:

- 生产环境要求
- 浏览器会给 HTTPS 常规要求设定本地主机例外。 校验您的浏览器，并使用 HTTPS 进行类似制作的跨站测试 。
- 使用`SameSite=None`时必须使用

## 域 域

指定哪些主机可以接收 cookie :

```bash
# Host-only cookie: only the host that set it
Set-Cookie: id=1; Path=/

# Parent domain and its subdomains; a leading dot is ignored
Set-Cookie: id=1; Domain=example.com; Path=/
```

**密钥差异:**

- **无域属性**: Cookie只发送到精确域(无子域名)
- **有域属性**: Cookie 发送到域和所有子域

**安全注释**:在域范围上要谨慎 - 范围更广会增加攻击表面。

## 路径

将 cookie 限制在特定的 URL 路径 :

```http
Set-Cookie: pref=dark; Path=/settings
```

仅随请求发送到`/settings`,`/settings/profile`等，不发送到`/`,`/about`等。

## 相同区域

第三方Cookie行为最关键的属性:

```bash
Set-Cookie: token=abc; SameSite=Strict|Lax|None
```

**相同Site值:**

| 值            | 行为                                   | 使用例             |
| ------------- | -------------------------------------- | ------------------ |
| **严格**      | 从未发送过跨地点                       | 高安全会议         |
| **Lax**(默认) | 同一站点请求和跨站点顶层安全导航       | 大多数网站         |
| **无人**      | 合格跨站点，以浏览器政策(`Secure`需要) | 嵌入式iframes, SSO |

**详细实例:**

```bash
# Strictest - never leaves your site
Set-Cookie: session=xyz; SameSite=Strict; Secure; HttpOnly

# Balanced - sent when user clicks links from other sites
Set-Cookie: preference=dark; SameSite=Lax

# Required for third-party contexts
Set-Cookie: widget_state=collapsed; SameSite=None; Secure
```

# CORS 和第三方Cookie

CORS 规范脚本是否可以读取跨源响应。对于认证的跨源响应`fetch`,请允许特定的请求源和证书。这与 cookie 是否有资格发送是分开的。 图像、 iframe 导航和顶级导航并不都使用相同的 CORS 响应- 访问规则。 简单的跨源请求即使隐藏在调用脚本中，也可以发送 。

## 飞行前请求

对于"复杂"请求，浏览器会发送一个`OPTIONS`预飞:

```http
OPTIONS /api/data HTTP/1.1
Host: api.example.com
Origin: https://app.example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: content-type
```

**服务器响应:**

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

**飞行前触发时:**

- 非简单方法(PUT, DELETE, PATCH)
- 自定义标题(除接受，接受-语言，内容-语言)
- `application/x-www-form-urlencoded`,`multipart/form-data`,`text/plain`以外的内容类型

## 简单请求

无需为:

```javascript
fetch('https://api.example.com/data', {
  method: 'GET',
  credentials: 'include',
})
```

# 对第三方Cookie的要求

对于交叉源代码获取请求，请检查下面的适用条件。同一站点要求取决于请求是否也是交叉站点 。

## 1. 浏览器设置

隐私行为因浏览器、模式、用户设置以及存储是否被分割而异。您所支持的浏览器默认设置测试而不是要求用户允许全球跟踪。

Chrome没有在2024–2025年完成之前宣布的全面停用。 2025年4月22日，Google表示将维持用户选择方法。 Safari限制第三方Cookie,而Firefox的Total Cookie保护分区则按顶级网站处理。 将此视为过时的政策背景，而不是对每个浏览器配置的承诺.[Google的公告](https://privacysandbox.google.com/blog/privacy-sandbox-next-steps),[Firefox Total Cookie 保护](https://support.mozilla.org/en-US/kb/introducing-total-cookie-protection-standard-mode).

## 2. 服务器配置

**对于需要跨站点资格的Cookie,设置`SameSite=None; Secure`.同站点子域请求在本质上并不需要`None`:**

```bash
Set-Cookie: auth=token123; SameSite=None; Secure; HttpOnly
```

需要的**COURS 信头:**

```bash
Access-Control-Allow-Origin: https://specific-origin.com
Access-Control-Allow-Credentials: true
```

**安全警告**: 永远不要使用有资质的`Access-Control-Allow-Origin: *`:

```http
# ❌ Invalid - will fail
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true

# ✅ Valid - specific origin
Access-Control-Allow-Origin: https://trusted-site.com
Access-Control-Allow-Credentials: true
```

## 3. 客户配置

**获取 API:**

```js
fetch('https://api.example.com/user', {
  method: 'POST',
  credentials: 'include', // Required for cross-origin cookies
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ data: 'value' }),
})
```

**证书选项:**

- `'omit'`:不要发送cookie或接受响应cookie.
- `'same-origin'`(默认):仅对同源请求使用证书。
- `'include'`: 也允许跨源请求的证书。 Cookie scope, SameSite, 浏览器隐私限制仍然适用。

**轴:**

```js
import axios from 'axios'

// Global configuration
axios.defaults.withCredentials = true
// Or per-request
axios.get('https://api.example.com/user', {
  withCredentials: true,
})
// With interceptor for all requests
axios.interceptors.request.use((config) => {
  config.withCredentials = true
  return config
})
```

**XMLHttp 请求:**

```js
const xhr = new XMLHttpRequest()
xhr.open('GET', 'https://api.example.com/data')
xhr.withCredentials = true
xhr.send()
```

# 共同问题和调试

## 问题1:Cookie没有设置

**Symptoms**:`Set-Cookie`头作为回应，但cookie不出现在浏览器中

**明细表:**

1. Cookie是否符合上下文条件？跨站点获取需要`SameSite=None`; 跨站点生成/ 同一站点获取本质上不需要 。
2. `Secure`属性设置吗?(需要与`SameSite=None`)一起使用
3. 是连接 HTTPS ,还是支持的本地主机例外？
4. `Access-Control-Allow-Credentials: true`是回应吗？
5. `credentials: 'include'`在请求中吗？
6. 浏览器是否允许此 cookie在嵌入语境中，包括任何分区规则？

**铬脱硫工具中的调试 :**

```
Network tab → Select request → Response Headers → Set-Cookie
Issues tab → Check for cookie warnings
```

## 问题2:没有随请求发送Cookie

**症状**: Cookie 存在，但并未随跨源请求发送

**明细表:**

1. `credentials: 'include'`是否在获取/ 轴中设置？
2. 如果请求是跨站点的，那么根据SameSite和浏览器的隐私政策，Cookie是否符合条件？
3. - Cookie域正确吗？
4. - Cookie过期了吗？
5. 路径是否与请求 URL 匹配？

**调试:**

```js
// Check cookies being sent
fetch('https://api.example.com/debug', {
  credentials: 'include',
})
  .then((res) => res.json())
  .then((data) => console.log('Cookies received by server:', data))
```

## 问题3:中央遥感系统飞行前故障

**症状**:在达到实际终点之前，CORS 错误请求失败 。

**常见原因:**

```bash
# ❌ Missing credentials header
Access-Control-Allow-Origin: https://app.com
# Missing: Access-Control-Allow-Credentials: true

# ❌ Wildcard with credentials
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true

# ❌ Insufficient allowed methods
Access-Control-Allow-Methods: GET
# Request uses POST

# ❌ Missing allowed headers
# Missing: Access-Control-Allow-Headers: Content-Type
```

**Fix:**服务器必须用所有需要的标题响应选项:

```js
// Express.js example
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})
```

# 保护隐私的替代办法

**1. 带有子域的第一党Cookie**

```bash
Set-Cookie: session=xyz; Domain=.example.com
```

`app.example.com`、`api.example.com`、`shop.example.com`之间的工程

**2. 具有合适Cookie背景的服务器侧会话**

```js
// After credential verification; the session ID remains a bearer credential.
app.post('/login', async (req, res) => {
  const user = await validateCredentials(req.body)
  if (!user) return res.sendStatus(401)
  const sessionId = generateSecureId()
  sessions.set(sessionId, { userId: user.id })
  res.cookie('sid', sessionId, { httpOnly: true, secure: true })
})
```

服务器侧会话不会绕过 cookie 限制。在适当的第一当事方上下文中托管会话结束点，或者使用基于方向的签名流 。

**3.基于托肯的认证(JWT)**

```js
// Store token in Authorization header
fetch('https://api.example.com/user', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
```

**优点**：支持跨源使用，无需 Cookie。
**Cons**:如果存储在本地Storage中，则易受XSS影响

**4. 跨源存储APIs**

```http
Set-Cookie: session=xyz; Partitioned; Secure; SameSite=None
```

分区的Cookie被范围化到顶级站点。 存储访问API是一个单独的机制，具有浏览器特定权限和用户激活要求:

```js
// Run from an eligible embedded document in response to user interaction.
document.requestStorageAccess().then(
  () => console.log('access granted'),
  () => console.log('access denied')
)
```

# 最佳做法

## 1. 尽量减少第三方Cookie的使用

```bash
// ❌ Avoid if possible
Set-Cookie: tracker=123; SameSite=None; Secure

// ✅ Use first-party when feasible
Set-Cookie: session=abc; SameSite=Lax; Secure; HttpOnly
```

## 2. 总是设置安全属性

```bash
Set-Cookie: auth=token;
  Secure;
  HttpOnly;
  SameSite=Strict;
  Max-Age=3600;
  Path=/;
  Domain=example.com
```

## 3. 执行适当的CORS

```js
// Whitelist specific origins
const allowedOrigins = ['https://app.example.com', 'https://dashboard.example.com']

app.use((req, res, next) => {
  const origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
    res.vary('Origin')
    res.header('Access-Control-Allow-Credentials', 'true')
  }
  next()
})
```

## 4. 使用环境特定组合

```js
const cookieOptions = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax', // Choose 'none' only for a required cross-site context over HTTPS.
  httpOnly: true,
}

res.cookie('session', sessionId, cookieOptions)
```

# 结论

当一个 cookie 丢失时，请先确定请求是同源的，跨源的/同源的站点，还是跨站点的站点 。然后检查其范围、 SameSite 资格、 证书模式和浏览器存储策略 。 配置 CORS , 用于脚本访问证书化的跨源响应 。 更改一个层不会覆盖其它层 。
