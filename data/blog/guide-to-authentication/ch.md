---
title: 'Web 身份验证方法完整指南'
summary: '从实现与安全边界出发，了解 Cookie 与会话、JWT、单点登录、OAuth 和扫码登录。'
---

登录流程需要回答几个不同的问题:用户如何证明身份，在之后代表登录的证书，该证书存储在何处，以及如何被撤销。库克、JWTs、OAuth、SSO和QR代码描述该流程的不同部分。它们不是五个相互排斥的认证协议。

此指南解释这些界限，然后遵循服务器管理的浏览器登录、 符号生命周期、 联合签名和交叉设备确认。 代码示例将正在讨论的机制隔离开来 。 应用程序专用数据库和身份提供者帮助者必须执行旁边声明的合同 。

## Cookie +会话认证

### 理解HTTP无国籍状态

HTTP是无国籍的: 协议不会自动使后期请求成为前一个应用程序登录的一部分。这独立于运输连接，运输连接可以保持开放或多功能请求。 应用程序会使用对后续请求的证书，将它们与经认证的会话联系起来 。[HTTP 语义学](https://www.rfc-editor.org/rfc/rfc9110.html)。

为了解决这个问题，[Lou Montulli](https://en.wikipedia.org/wiki/Lou_Montulli)于1994年引入了`cookies`.

### Cookie的操作方式

`cookie`是服务器发送并存储在客户端的一块数据，浏览器在之后向**相同的域**提出的请求中自动包括这些cookie,使服务器能够识别返回的用户。

Cookie 是一个浏览器存储和运输机制，而不是身份检查。它可以携带不透明的会话ID或一个签名的令牌。在下面的服务器侧会话设计中，服务器会验证证书并将随机会话ID与认证的用户关联。

一个`session`是服务器侧存储的(,位于内存，文件，或数据库中的),它持有用户状态信息，由独有的会话id识别。

### 执行流程

```
┌─────────┐                                  ┌──────────────┐                    ┌─────────────┐
│ Browser │                                  │  Web Server  │                    │   Session   │
└────┬────┘                                  └──────┬───────┘                    └──────┬──────┘
     │                                              │                                   │
     │  1. POST /login (username, password)         │                                   │
     │─────────────────────────────────────────────>│                                   │
     │                                              │                                   │
     │                                              │  2. Validate credentials          │
     │                                              │  (check against database)         │
     │                                              │                                   │
     │                                              │  3. Create session                │
     │                                              │  sessionId = generateId()         │
     │                                              │──────────────────────────────────>│
     │                                              │                                   │
     │                                              │  4. Store session data            │
     │                                              │  { userId, loginTime, ... }       │
     │                                              │<──────────────────────────────────│
     │                                              │                                   │
     │  5. Set-Cookie: sessionId=abc123;            │                                   │
     │     HttpOnly; Secure; SameSite=Strict        │                                   │
     │<─────────────────────────────────────────────│                                   │
     │                                              │                                   │
     │  6. GET /dashboard                           │                                   │
     │     Cookie: sessionId=abc123                 │                                   │
     │─────────────────────────────────────────────>│                                   │
     │                                              │                                   │
     │                                              │  7. Retrieve session              │
     │                                              │  GET session by sessionId         │
     │                                              │──────────────────────────────────>│
     │                                              │                                   │
     │                                              │  8. Return session data           │
     │                                              │  { userId: 123, valid: true }     │
     │                                              │<──────────────────────────────────│
     │                                              │                                   │
     │  9. Return protected resource                │                                   │
     │     (dashboard HTML)                         │                                   │
     │<─────────────────────────────────────────────│                                   │
     │                                              │                                   │
     │  10. GET /api/profile                        │                                   │
     │      Cookie: sessionId=abc123                │                                   │
     │─────────────────────────────────────────────>│                                   │
     │                                              │  Session automatically validated  │
     │  11. Return user profile                     │  (repeat steps 7-8)               │
     │<─────────────────────────────────────────────│                                   │
```

**初始登录:**

1. 用户访问`example.com/page`并输入证书
2. 服务器验证证书并创建独特的会话 ID
3. 会话 id是存储在服务器侧(的内存，Redis, 数据库等.)
4. 服务器用包含会话 id 的`Set-Cookie`头响应
5. 浏览器自动存储Cookie

**后续请求:**

1. 用户导航到`example.com/another-page`
2. 浏览器在请求中自动包含会话 id cookie
3. 服务器使用会话 ID 检索会话数据
4. 如果有效，服务器将允许访问请求的资源

### 限制

`Cookie + Session`认证虽然经过了战斗测试，但有一些缺点:

**可扩展性问题:**

- 活动会话需要服务器侧存储，它可以是外部数据存储而非应用程序处理内存
- 在集群环境中，会话必须在服务器之间同步进行(使用 Redis 或粘度会话)
- 横向规模的扩大需要审慎的共享会话或路线战略；这在本质上并非不可能

**安全问题:**

- 易遭CSRF(跨场请求 Forgery)攻击
- 需要仔细的域和路径配置

**跨域挑战:**

- 曲奇不在不同领域工作
- 微服务架构需要变通操作

### 安保最佳做法

执行`Cookie + Session`认证时，总是:

- **设置`HttpOnly`旗**- 防止 JavaScript 访问，减轻XSS 攻击
- **设置`Secure`旗子**-确保 cookie只通过 HTTPS 发送
- **设置`SameSite`属性**- 防止CSRF攻击(`SameSite=Strict`或`SameSite=Lax`),同时为改变状态的请求提供相应的CSRF保护。

E.g.

```bash
Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict; Max-Age=3600; Path=/
```

## 基于托肯的认证(JWT)

签名访问令牌是另一种代表认证访问的方法，也可以用Cookie来携带，因此区分证书格式与浏览器传输。

### 何为符号。

**令牌**是证书。它可能是服务器向上查找的不透明随机值，也可能是签名的 JWT 等结构化值。 签名的 JWT可以携带一个资源服务器在不加载会话记录的情况下验证的主张。 存储、 撤销和授权政策仍然需要服务器侧面状态 。

### 执行流程

```
┌─────────┐                                  ┌──────────────┐
│ Client  │                                  │  API Server  │
└────┬────┘                                  └──────┬───────┘
     │                                              │
     │  1. POST /api/login                          │
     │     { username, password }                   │
     │─────────────────────────────────────────────>│
     │                                              │
     │                                              │  2. Validate credentials
     │                                              │     (check database)
     │                                              │
     │                                              │  3. Generate token
     │                                              │     - Create payload
     │                                              │     - Sign with secret
     │                                              │
     │  4. Return token                             │
     │     { token: "eyJhbGc...", expiresIn }       │
     │<─────────────────────────────────────────────│
     │                                              │
     │  5. Store token locally                      │
     │     (e.g. localStorage/memory)               │
     │                                              │
     │  6. GET /api/profile                         │
     │     Authorization: Bearer eyJhbGc...         │
     │─────────────────────────────────────────────>│
     │                                              │
     │                                              │  7. Extract token from header
     │                                              │
     │                                              │  8. Verify token signature
     │                                              │     (using secret key)
     │                                              │
     │                                              │  9. Check token expiration
     │                                              │     (exp claim)
     │                                              │
     │                                              │  10. Decode payload
     │                                              │      (extract user info)
     │                                              │
     │  11. Return user data                        │
     │      { id, name, email, ... }                │
     │<─────────────────────────────────────────────│
     │                                              │
     │  12. GET /api/posts                          │
     │      Authorization: Bearer eyJhbGc...        │
     │─────────────────────────────────────────────>│
     │                                              │
     │                                              │  Token validation
     │                                              │  (repeat steps 7-10)
     │                                              │
     │  13. Return posts                            │
     │<─────────────────────────────────────────────│
```

**初始登录:**

1. 用户通过用户名/密码词，MFA等认证(.)
2. 服务器生成一个令牌并将其返回客户端
3. 客户端按照它的威胁模式存储此令牌。 浏览器内存、 持续存储和 HttpOnly Cookie 具有不同的XSS、 CSRF 和寿命权衡

**后续请求:**

1. 客户端包含请求头中的符号(通常为`Authorization: Bearer <token>`)
2. 服务器验证符号签名和过期
3. 如果有效，服务器处理请求

### 利弊

**优点:**

- **无国籍**- 不需要服务器侧会话存储
- **可缩放**-在分布/集群环境中无缝工作
- **跨域**-可以以信头发送，绕过 cookie 域限制

**缺点:**

- **无法轻易撤销**- 签发后，令牌一直有效到到期
- **较大有效载荷**- 托肯斯大于会话代号，消耗更多的带宽
- **存储问题**-如果存储在本地Storage中，则易受XSS的影响

### 理解 JWT(JSON 网络符号)

最受欢迎的代号格式是**JWT**,它由三个部分组成，由点分隔成(`.`):

```bash
header.payload.signature
```

#### 1. 标题

指定算法和符号类型 :

```javascript
const header = {
  alg: 'HS256', // HMAC-SHA256 algorithm
  typ: 'JWT', // Token type
}
```

#### 2. 有效载荷

包含索赔(用户数据和元数据):

```js
const payload = {
  sub: '123456', // Subject (user ID)
  name: 'headwindz', // User name
  iat: 1422779638, // Issued at timestamp
  exp: 1422783238, // Expiration timestamp
  role: 'admin', // Custom claim
}
```

1.**标准索赔:**

- `iss`(发行商)-谁发行的代号
- `sub`(主题)- 用户标识符
- `aud`(观众)- 预定接收者
- `exp`(过期)- 过期时间
- `iat`(在)发行 - 托肯创建时间
- `nbf`(不在)之前 - 托肯在此之前无效

#### 3. 签署

保证标志性完整性和真实性:

```js
// Generate signature
const base64Header = base64UrlEncode(JSON.stringify(header))
const base64Payload = base64UrlEncode(JSON.stringify(payload))
const unsignedToken = `${base64Header}.${base64Payload}`

// Sign with secret key
const signature = HMAC_SHA256(secretKey, unsignedToken)
const base64Signature = base64UrlEncode(signature)

// Final token
const token = `${base64Header}.${base64Payload}.${base64Signature}`
```

**示例 jwt:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

由于JWTs是基数64编码的，因此可以方便地解码它们来检查头和有效载荷:

[JWT解码器](https://toolhub.run/tools/jwt-decoder)

注意: JWTs 默认为**不加密**, 只能编码和签名，因此，避免将敏感信息放入有效载荷中。 后端应该总是先验证签名并验证索赔，然后再将数据寄托到符中 。

### B. 接受核查的进程

使用保持的 JWT 执行，而不是比较手写 HMAC 和 解码 。例如，在节点服务中与`jsonwebtoken`:

```js
import jwt from 'jsonwebtoken'

function verifyToken(token, secretKey, issuer, audience) {
  const payload = jwt.verify(token, secretKey, {
    algorithms: ['HS256'],
    issuer,
    audience,
  })
  if (typeof payload === 'string' || typeof payload.exp !== 'number') {
    throw new Error('An exp claim is required')
  }
  return payload
}
```

允许的算法和密钥必须由服务器选择，而不是从一个不可信符号头中接受。 需要您应用程序所依赖的主张，包括过期，并匹配发件人和收件人与符号合同。不要将解码作为验证。 后面的缩写撤销片段侧重于数据存储检查；在整合时应用相同的验证合同 。[JWT当前的最佳做法](https://www.rfc-editor.org/rfc/rfc8725.html)。

### 刷新符号和符号旋转

短寿命访问符限制了失窃访问证书的使用时间。 刷新符使客户端无需再次要求密码即可获得替换。 寿命取决于应用程序；15分钟访问符和7天刷新会话是实例选择，而不是普遍的安全要求 。

客户端必须拥有刷新证书。 服务器保存一个验证/ 撤销记录，最好是使用不透明随机符号的散列，而不是保留原始的无记名密码。对于同一地点的浏览器应用程序，服务器可以在`HttpOnly; Secure; SameSite=Lax`cookie 中设置证书并返回内存存储访问证书 。 浏览器不会从 JavaScript 中设置 HtpOnly cookie 。

<Mermaid
chart={`sequenceDiagram
  participant B as Browser
  participant A as Auth server
  participant D as Token store
  B->>A: Login credentials over HTTPS
  A->>D: Create refresh family and hashed token record
  A->>B: Access token and HttpOnly refresh cookie
  B->>A: Refresh request with cookie and CSRF protection
  A->>D: Atomically consume old token and store replacement
  D->>A: Rotation committed
  A->>B: New access token and replacement refresh cookie
  Note over A,D: Reuse of a consumed token revokes the refresh family`}
/>

#### 原子旋转合同

以下为数据存储假码。`transaction`提供行锁定或等效的比较和设置保证；两个同时提出的请求不能同时消耗相同的活动符号。 保留已消耗的记录，直到家族到期，才能确认再使用。

```text
refresh(request):
    validate the request's CSRF protection and expected origin
    require the HttpOnly refresh cookie
    presented_hash = SHA256(cookie_value)
    replacement = cryptographically_random_secret()

    transaction:
        old = lock token record by presented_hash
        if missing or expired or its family is revoked:
            outcome = REJECT
        else if old was already consumed:
            revoke its refresh family
            outcome = REUSE_DETECTED
        else:
            mark old as consumed
            insert hash(replacement), same family, same absolute family expiry
            outcome = ROTATED
    commit transaction, including any family revocation

    if outcome is not ROTATED:
        clear refresh cookie and require login
    otherwise:
        set replacement HttpOnly cookie
        return a new short-lived access token
```

不要在交易中以回滚方式丢弃重复使用撤销。 协调客户端的刷新请求，这样标签就不会经常与同样的证书进行竞争。如果在旋转后丢失了回复，旧的证书可能不再可用；选择并记录您的恢复政策，而不是盲目重试它 。

撤销刷新家族会防止进一步的刷新。 已经发布的访问令牌一直可以使用到到期，除非资源服务器也检查撤销状态。 设备元数据可能有助于检测异常，但指纹不是密码学证明证书留在一个设备上。[OAuth rest-token replay protection](https://www.rfc-editor.org/rfc/rfc9700.html#section-4.14.2)。

#### 验证生命周期

检查一个有效的刷新返回一个替换，消耗的证书无法再次刷新，重复使用意味着家庭吊销，两个同时刷新都无法成功 。另外，检查过期、 登录、 缺少Cookie、 无效的 CSRF 保护以及丢失的回复后恢复。 这些情况不同于仅仅接受有效的 JWT 签名 。

### Token 撤销策略

即使有刷新符号，您也需要**立即失效符号**(的方法，例如用户登录，安全漏洞，账户暂停).

#### 战略1:象征性黑名单(简单)

维护被撤销的令牌的服务器侧列表。当一个令牌被显示时，请检查它是否被列入黑名单 。

**Pros:**简单执行，为所有符号类型工作

**Cons:**每个受保护的请求都需要使用定义的新鲜度政策进行撤销查询；使用索引标识符，并在令牌过期时过期记录。

#### 战略2:追踪标识符

在每个符号中添加一个独特的标识符(`jti`), 并跟踪哪些符号无效 。这可以使记录比存储整个符号小，但仍需查找和过期/ 清理政策 。

**Pros:**带有紧凑标识符的 Per-token 撤销。 下面的允许列表示例存储已发布的标识符；拒绝列表将转而存储已撤销的标识符 。

**Cons:**需要数据存储检查，保存政策和一致的故障处理

```js
// Generate token with JTI
const jti = generateRandomId() // Unique token ID
const token = jwt.sign(
  {
    userId: user.id,
    jti: jti, // Add unique ID
    type: 'access',
  },
  SECRET,
  { expiresIn: '15m' }
)

// Store JTI in database when issued
await db.tokenJtis.create({
  jti: jti,
  userId: user.id,
  issuedAt: new Date(),
  expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  isRevoked: false,
})

// Logout - revoke by marking JTI as revoked
app.post('/logout', verifyAccessToken, async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  const payload = jwt.decode(token)

  await db.tokenJtis.updateOne({ jti: payload.jti }, { isRevoked: true })

  res.json({ message: 'Logged out successfully' })
})

// Verification middleware
async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]

  try {
    const payload = jwt.verify(token, SECRET)

    // Check if JTI is revoked
    const jti = await db.tokenJtis.findOne({ jti: payload.jti })
    if (!jti || jti.isRevoked) {
      return res.status(401).json({ error: 'Token has been revoked' })
    }

    req.user = payload
    next()
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' })
  }
}
```

#### 战略3:象征性版本/轮调 -- -- 高级

指定一个版本编号为符号，并在登录时旋转。只有当前版本的符号才有效 。

**Pros:**1 数据库查询 每位用户(不每令牌),即时撤销，可以撤销所有用户令牌

**Cons:**需要每个用户的跟踪，颗粒小于 JTI

```js
// Login - include user's current token version
const tokenVersion = user.tokenVersion // Read the stored value; do not reset it at login.
const token = jwt.sign(
  {
    userId: user.id,
    version: tokenVersion,
  },
  SECRET,
  { expiresIn: '15m' }
)

// User logout - increment their token version
app.post('/logout', verifyAccessToken, async (req, res) => {
  await db.users.updateOne(
    { id: req.user.userId },
    { $inc: { tokenVersion: 1 } } // Invalidates all existing tokens for this user
  )

  res.json({ message: 'Logged out, all devices logged out' })
})

// Verification - compare token version against user's current version
async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]

  try {
    const payload = jwt.verify(token, SECRET)
    const user = await db.users.findOne({ id: payload.userId })

    if (!user || payload.version !== user.tokenVersion) {
      return res.status(401).json({ error: 'Token has been revoked' })
    }

    req.user = payload
    next()
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' })
  }
}
```

#### 选择取消颗粒度

| 战略                 | 存储状态                         | 撤销的效果                 |
| -------------------- | -------------------------------- | -------------------------- |
| 托肯拒绝列表         | 翻转的符号散列或标识符，直到到期 | 根据已检查的请求拒绝该符号 |
| 已发行的托存允许列表 | 活动符号标识符和过期的           | 拒绝已删除或已撤销的标识符 |
| 用户/会场版本        | 该范畴的当前版本                 | 拒绝该范畴中的旧符号       |

所有三个版本都需要一个当前搜索，直接或通过一个带有明确新鲜度策略的缓存。一个索引可以使每盘搜索高效；每个用户的版本并不能消除咨询状态的需要。选择登录和事件响应所需的范围，而不是将策略排为可通用的可扩展或不可扩展的级别。

### 安保建议

1. **使用强大的密钥**-至少256位，随机生成
2. **永不暴露秘密**- 保密密钥安全，使用环境变量
3. **设定适当的过期**- 平衡安全和用户体验
4. **避免有效载荷中的敏感数据**- jwt有效载荷为基数64编码，不加密

## 与 OAuth 和 OpenID 连接的联邦签名

**OAuth 2.0**提供授权:应用程序获得对资源的范围化访问.**OpenID Connect(OIDC)**增加了身份层和标识符，用于登录。 Google支持OIDC;其他提供者可以曝光不同身份API.不要假设任何提供者的OAuth访问符本身就是登录断言.[OIDC Core](https://openid.net/specs/openid-connect-core-1_0.html).

### 为什么是奥奥特？

**用户:**

- 不需要再创建一个账户
- 加快登记进程
- 已建立的信任提供商的安全
- 少一个口令可以记住

**开发者:**

- 减少开发时间(不需要从零开始建立认证)
- 供应商处理的(密码存储安全风险降低)
- 使用权限访问用户数据(电子邮件，配置图片等.)

### OAuth 2.0 流量

以下例子使用一个保密的服务器侧网页应用程序和Google OIDC.它的后端持有客户端秘密，只有浏览器应用程序等公共客户端不能安全地持有该秘密，并使用其提供者支持的授权码/PKCE流量。

#### 设置阶段

1. **注册您的应用程序**位于[Google 云控台](https://console.cloud.google.com/)
2. **创建 OAuth 2.0 证书**并接收:
   - `client_id`-您的应用程序的公开标识符
   - `client_secret`- 服务器通信的秘密密钥
3. **配置授权重定向 URIs**(,例如`https://yourapp.com/auth/google/callback`)

#### 认证流程

```
┌─────────┐                                  ┌──────────┐                     ┌─────────────┐
│  User   │                                  │ Your App │                     │   Google    │
└────┬────┘                                  └────┬─────┘                     └──────┬──────┘
     │                                            │                                  │
     │  1. Click "Login with Google"              │                                  │
     │───────────────────────────────────────────>│                                  │
     │                                            │                                  │
     │  2. Redirect to Google OAuth               │                                  │
     │<───────────────────────────────────────────│                                  │
     │                                                                               │
     │  https://accounts.google.com/o/oauth2/v2/auth?                                │
     │     client_id=YOUR_CLIENT_ID&                                                 │
     │     redirect_uri=yourapp.com/callback&                                        │
     │     response_type=code&                                                       │
     │     scope=openid%20profile%20email                                            │
     │                                                                               │
     │  3. User logs in & authorizes                                                 │
     │──────────────────────────────────────────────────────────────────────────────>│
     │                                            │                                  │
     │                                              4. Redirect back with code       │
     │                                              yourapp.com/callback?code=xx     │
     │                                            |<─────────────────────────────────│
     │                                            │                                  │
     │                                            │                                  │
     │                                            │  5. Exchange code for token      │
     │                                            │  POST /oauth/token               │
     │                                            │  - code: xx                      │
     │                                            │  - client_id                     │
     │                                            │  - client_secret                 │
     │                                            │─────────────────────────────────>│
     │                                            │                                  │
     │                                            │  6. Return access_token          │
     │                                            │<─────────────────────────────────│
     │                                            │                                  │
     │                                            │  7. Fetch user info              │
     │                                            │  GET /api/user                   │
     │                                            │  Authorization: Bearer TOKEN     │
     │                                            │─────────────────────────────────>│
     │                                            │                                  │
     │                                            │  8. Return user data             │
     │                                            │<─────────────────────────────────│
     │                                            │                                  │
     │  9. Create session & redirect              │                                  │
     │<───────────────────────────────────────────│                                  │
```

### 详细步骤

**步骤1:启动登录**

用户点击您网站上的"Login with Google".

**步骤2: 重定向给 OAuth 提供者**

应用程序需要为下面的临时状态配置一个服务器侧会话。 配置安全的 cookie 和一个生产会话商店。这些 Express 风格的节选显示状态和 PKCE 值的活性位置；使用提供者维护的 OIDC 库在一个已部署的应用程序中进行发现和符号验证 。

```js
import { randomBytes, createHash } from 'node:crypto'

app.get('/auth/google', (req, res) => {
  const state = randomBytes(32).toString('base64url')
  const codeVerifier = randomBytes(32).toString('base64url')
  req.session.oauth = { state, codeVerifier, createdAt: Date.now() }

  const query = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: CALLBACK_URL,
    response_type: 'code',
    scope: 'openid profile email',
    state,
    code_challenge: createHash('sha256').update(codeVerifier).digest('base64url'),
    code_challenge_method: 'S256',
  })
  // Persist the session before following the redirect.
  req.session.save((error) => {
    if (error) return res.sendStatus(500)
    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${query}`)
  })
})
```

**第3步:用户授权**

用户登录到谷歌(如果还没有)并批准请求的许可(配置文件、电子邮件等。)

**第4步: 提供方以代码**重定向

Google 重定向到您的指定回调 :

```
https://yourapp.com/callback?code=AUTHORIZATION_CODE&state=RANDOM_STATE&scope=openid+profile+email
```

**第5步: 访问符交换码**

对于这个保密的网络客户端，服务器在交换代码前会验证并消耗状态。`codeVerifier`是从同一会话中读取的；它不是一个客户端秘密。然后服务器交换代码 :

```js
// Inside the server callback, before the token request:
const pending = req.session.oauth
delete req.session.oauth // Consume state once.
if (
  !pending ||
  typeof req.query.state !== 'string' ||
  req.query.state !== pending.state ||
  Date.now() - pending.createdAt > 10 * 60 * 1000 ||
  typeof req.query.code !== 'string'
) {
  return res.sendStatus(400)
}
const authorizationCode = req.query.code
const codeVerifier = pending.codeVerifier
// Persist state consumption even if the exchange later fails.
await new Promise((resolve, reject) => {
  req.session.save((error) => (error ? reject(error) : resolve()))
})

const response = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    code: authorizationCode,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: CALLBACK_URL,
    code_verifier: codeVerifier,
    grant_type: 'authorization_code',
  }),
})

if (!response.ok) throw new Error('Token exchange failed')
const { access_token, id_token } = await response.json()
```

**为什么这个后端?**这个例子可以使用它的服务器持有的秘密认证一个机密客户端。 授权码交换并非普遍只使用后端；公共客户端使用一个支持的PKCE流而不嵌入一个共享的秘密。

**步骤 6-8:验证身份并获取剖面数据**

使用一个维护的[Google/OIDC 库](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token)在创建登录前验证ID标志的签名，签发者，受众，过期，以及任何需要绑定的非ce 。 已验证的`(issuer, sub)`对称识别账户；不仅仅因为电子邮件字符串匹配而自动合并账户 。如果您获取用户信息，请验证其`sub`匹配已验证的ID 标志 。 HTTP 调用下面仅显示配置检索；它不替换这些检查 。

```js
// Install google-auth-library for this Node.js example.
import { OAuth2Client } from 'google-auth-library'

const oidcClient = new OAuth2Client(CLIENT_ID)
const ticket = await oidcClient.verifyIdToken({ idToken: id_token, audience: CLIENT_ID })
const identity = ticket.getPayload()
if (!identity?.sub) throw new Error('Missing verified subject')

const userResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
  headers: {
    Authorization: `Bearer ${access_token}`,
  },
})

if (!userResponse.ok) throw new Error('UserInfo failed')
const userData = await userResponse.json()
if (userData.sub !== identity.sub) throw new Error('Subject mismatch')
```

**步骤9: 创建会话**

为用户创建自己的应用程序会话/磁盘 :

```js
// Create user in your database (if new)
const user = await User.findOrCreate({
  issuer: identity.iss,
  subject: identity.sub,
  email: userData.email,
  name: userData.name,
  picture: userData.picture,
})

// Generate your app's session token
const sessionToken = jwt.sign({ userId: user.id }, YOUR_SECRET, {
  algorithm: 'HS256',
  expiresIn: '15m',
})

// Set cookie or return token to client
res.cookie('session', sessionToken, { httpOnly: true, secure: true, sameSite: 'lax' })
```

### OAuth 范围

范围定义您的应用程序可以访问的数据。每个提供者都有自己的一套范围。例如。

| 范围      | 描述                   |
| --------- | ---------------------- |
| `openid`  | 请求 OpenID 连接认证   |
| `profile` | 基本剖面图(名称，图片) |
| `email`   | 电子邮件地址:          |
| `repo`    | GitHub 仓库(GitHub)    |

**重要:**仅请求您实际需要的范围！用户不太可能授权请求过多权限的应用 。

### 安全考虑

1. 如上所示，在同一服务器会话中验证启动登录的一次性状态。 浏览器`sessionStorage`无法访问服务器端的回调 。
2. 使用PKCE和提供者支持的代码流；在服务器上保留保密客户秘密。
3. 在创建应用程序会话前验证 OIDC 身份断言并绑定主题 。
4. 成功登录后重新生成应用程序会话标识符，设置 cookie 安全属性，并限制登录后重定向到允许应用程序路由。

[OAuth安保最佳现行做法](https://www.rfc-editor.org/rfc/rfc9700.html).

### 大众 OAuth 供应商

| 提供商       | 使用案例         | 文档                                                                                         |
| ------------ | ---------------- | -------------------------------------------------------------------------------------------- |
| **谷歌( G)** | 一般用途，范围广 | [Google OAuth (谷歌 OAuth) (英语).](https://developers.google.com/identity/protocols/oauth2) |
| **GitHub**   | 开发工具，代码库 | [GitHub OAuth](https://docs.github.com/en/developers/apps/building-oauth-apps)               |

### 为什么要交换密码？

一个授权代码是短寿命的，单用，并绑定在客户端上，并重定向URI. PKCE额外绑定了为该请求创建的验证器的赎回。 浏览器可以将代码带回应用程序，而不在重定向URL中放置API访问符。

此示例中的后端处理是一个客户端架构，而不是每个 OAuth 流的属性。 代码也可以泄露，因此保护回调 URL、 日志、会话绑定和 符号交换 。 保留访问权限并刷新证书 URL 。

## (SSO)单号

**单签名-在(SSO)**允许用户认证一次，并获得多个应用程序的访问权限而无需重新进入证书，是一种企业环境中常用的集中认证机制。

### SSO 问题解决

想象一个具有多个内部应用的大型组织:

- 人力资源门户
- 项目管理工具
- 客户关系管理系统

没有特别服务单位，用户需要:

- 记住每个系统不同的密码
- 单独登录到每个应用程序
- 处理多个平台的密码重置请求

SSO通过为所有服务提供`one authentication point`来解决这个问题。

### SSO如何运作

SSO依赖于一个**中央认证服务器**(经常被称为身份提供商或所有应用程序都信任的IDP).

```
┌─────────┐                 ┌──────────┐                 ┌──────────┐                 ┌──────────┐
│  User   │                 │  App A   │                 │  App B   │                 │   SSO    │
└────┬────┘                 └────┬─────┘                 └────┬─────┘                 └────┬─────┘
     │                           │                            │                            │
     │  1. Visit app-a.com       │                            │                            │
     │──────────────────────────>│                            │                            │
     │                           │                            │                            │
     │                           │  2. No session found       │                            │
     │                           │     redirect to SSO        │                            │
     │                           │                            │                            │
     │  3. Redirect to SSO login                                                           │
     │     sso.com?returnUrl=app-a.com&appId=app-a                                         │
     │────────────────────────────────────────────────────────────────────────────────────>│
     │                           │                            │                            │
     │  4. Show login page                                                                 │
     │<────────────────────────────────────────────────────────────────────────────────────│
     │                           │                            │                            │
     │  5. Submit credentials and authenticates                                            │
     │────────────────────────────────────────────────────────────────────────────────────>│
     │                           │                            │                            │
     │                           │                            │  6. Validate credentials   │
     │                           │                            │     Create session         │
     │                           │                            │     Generate ticket        │
     │                           │                            │                            │
     │  7. Redirect with ticket                                                            │
     │     app-a.com?ticket=xyz123                                                         │
     │     Set-Cookie: ssoSession=abc (sso.com domain)                                     │
     │<────────────────────────────────────────────────────────────────────────────────────│
     │                           │                            │                            │
     │  8. Request with ticket   │                            │                            │
     │──────────────────────────>│                            │                            │
     │                           │                            │                            │
     │                           │  9. Validate ticket (server-to-server)                  │
     │                           │     POST sso.com/validate                               │
     │                           │     { ticket: "xyz123", appId: "app_a" }                │
     │                           │────────────────────────────────────────────────────────>│
     │                           │                            │                            │
     │                           │  10. Return user info      │                            │
     │                           │      { userId, email, name, valid: true }               │
     │                           │<────────────────────────────────────────────────────────│
     │                           │                            │                            │
     │                           │  11. Create session        │                            │
     │                           │                            │                            │
     │ 12.Return app-a.com page                               │                            │
     │    Set-Cookie: appASession                             │                            │
     │<──────────────────────────│                            │                            │
     │                           │                            │                            │
     │  --- User now has 2 sessions: sso.com & app-a.com ---  │                            │
     │                           │                            │                            │
     │  13. Visit app-b.com                                                                │
     │───────────────────────────────────────────────────────>│                            │
     │                           │                            │                            │
     │                           │                            │  14. No session            │
     │                           │                            │      redirect to SSO       │
     │                           │                            │                            │
     │  15. Redirect to SSO                                                                │
     │     sso.com?returnUrl=app-b.com&appId=app-b                                         │
     │────────────────────────────────────────────────────────────────────────────────────>│
     │                           │                            │                            │
     │                           │                            │  16. Check SSO cookie      │
     │                           │                            │      Session exists!       │
     │                           │                            │      No login needed       │
     │                           │                            │      Generate ticket       │
     │                           │                            │                            │
     │  17. Redirect with ticket                              │                            │
     │      app-b.com?ticket=abc789                           │                            │
     │<────────────────────────────────────────────────────────────────────────────────────│
     │                           │                            │                            │
     │  18. Request with ticket                               │                            │
     │───────────────────────────────────────────────────────>│                            │
     │                           │                            │                            │
     │                           │                            │  19. Validate ticket       │
     │                           │                            │──────────────────────────> │
     │                           │                            │                            │
     │                           │                            │  20. Return user info      │
     │                           │                            │<────────────────────────── │
     │                           │                            │                            │
     │                           │                            │  21. Create session        │
     │                           │                            │                            │
     │  22. Return app-b.com page                                                          │
     │      Set-Cookie: appBSession                                                        │
     │<───────────────────────────────────────────────────────│                            │
     │                           │                            │                            │
     │  --- User now has 3 sessions: sso.com, app-a.com, app-b.com ---                     │
```

#### 第一次访问流量

1. 用户访问`app-a.com`
2. App A 检查用户是否有有效的会话 ~ 否
3. 重定向到 SSO`sso.example.com?returnUrl=app-a.com`
4. 用户通过用户名/密码，MFA等在中央SSO服务器(进行认证.)
5. SSO 创建会话并将其存储在`sso.example.com`的Cookie中
6. SSO生成(一次性使用符)并重定向到`app-a.com?ticket=xyz123`
7. App A用 SSO 服务器后端对后端验证票
8. SSO确认票有效并提供用户信息
9. App A为用户创建会话并设置自己的会话 cookie
10. 用户访问请求的资源

现在用户有**两个活动会话**:

- 1台与SSO服务器(`sso.example.com`)
- 一台与 App A(`app-a.com`)

#### 访问另一个应用程序

1. 用户访问`app-b.com`
2. App B 检查用户是否有有效的会话 ~ 否
3. 重定向到 SSO`sso.example.com?returnUrl=app-b.com`
4. SSO 检测现有会话(从上文第5步起)
5. 无需登录！SSO 立即生成一张票
6. 重定向到`app-b.com?ticket=abc789`
7. App B 验证并创建自己的会话
8. 用户访问资源而不重新进入证书

### 效益和挑战

**福利:**

- 更好的 UX - 用户登录一次，访问所有信息
- 集中式安保 -- -- 安保政策、外交部、审计的单一点
- 密码疲劳减少 -要记住的密码减少
- IT效率 - 方便用户管理和访问控制

**挑战:**

- 执行的复杂性 - 需要各应用程序之间的协调
- 安全风险 -- --所有申请都暴露在SSO证书上

### 受欢迎的SSO供应商

| 提供商         | 使用案例                 | 文档                                                            |
| -------------- | ------------------------ | --------------------------------------------------------------- |
| Okta           | 企业身份管理             | [Okta 开发者](https://developer.okta.com/)                      |
| Auth0          | 开发者友好型，自定义型的 | [Auth0 Docs](https://auth0.com/docs)                            |
| Google工作空间 | Google综合组织           | [Google工作空间 SSO](https://support.google.com/a/answer/60224) |

### SSO描述的是经验，不是一张票协议

SSO意味着用户在身份提供者认证后可以到达多个应用程序而无需重新进入证书，可以使用OIDC,SAML,CAS,或其他协议执行。 上面的一次性计票表图是一个概念性的例子，而不是SSO绕过授权代码或客户端认证的规则。

内部应用程序仍需要认证交换、有限度的断言、重新定位验证和防范重播。属于一个组织并不使无记名证书安全暴露。在决定需要哪些证书和验证步骤之前，请说明您使用的协议和客户类型。

## QR 代码认证

一个 QR 代码传输数据。它本身不会认证一个用户。在交叉设备登录中，一个已经认证的手机批准一个等待的浏览器登录，服务器将批准内容绑定在启动浏览器上 。

[QRCode生成器](https://toolhub.run/tools/qr-generator)和[QRCode 解析器](https://toolhub.run/tools/qr-parser)帮助检查编码数据；不要将访问权限设置在您打算公开显示的QR中。

### 将公共标识符与符号检索分离

使用两个边界:

- 一个公共的`qrCodeId`识别出在QR中显示的待定登录。
- 一个没有QR的私人浏览器会话，授权该登录结果的投票和消费。

经认证的移动会话批准公共ID. 设备名称，IP地址，或浏览器指纹可以为确认屏幕提供上下文，但并不是投票客户端是启动浏览器的证据。

<Mermaid
chart={`sequenceDiagram
  participant B as Initiating browser
  participant S as Server
  participant M as Authenticated phone
  B->>S: Create pending login in browser session
  S->>B: Public QR ID, with private session cookie
  M->>S: Scan public QR ID using authenticated mobile session
  S->>M: Show requesting application and login context
  M->>S: Explicit approval with one-time confirmation credential
  S->>S: Bind user to pending login, enforce state and expiry
  B->>S: Poll with private browser session cookie
  S->>S: Atomically consume approved pending login
  S->>B: Rotate browser session ID and establish authenticated session`}
/>

### 服务端状态转换

以下为服务器合同的伪码，而非完整的端点执行。 浏览器端点也需要其适用的CSRF和源头检查。

```text
create(browser_session):
    create unpredictable public qrCodeId and a short expiry
    bind it to browser_session.id, state = WAITING
    return public qrCodeId; do not encode browser session secrets in the QR

scan(qrCodeId, authenticated_mobile_session):
    require WAITING, not expired, and a valid mobile login
    bind the approving user and a one-time confirmation credential
    set state = SCANNED
    return login context and confirmation credential to that mobile session

approve(qrCodeId, confirmation_credential, authenticated_mobile_session):
    atomically require SCANNED, matching user/credential, and not expired
    consume confirmation credential; set state = APPROVED

consume(qrCodeId, browser_session):
    atomically require APPROVED, not expired, and the initiating browser binding
    set state = CONSUMED; return the approved user to the server handler
    regenerate the browser session ID and establish the application login
    never return a login token merely because a caller knows qrCodeId
```

也支持明确取消和过期。 完成、取消或过期时停止浏览器投票；投票间隔不是一个安全财产。 使消费原子化，使两个请求不能同时交换同样的批准。

### 校验跨设备边界

使用相同的公共 QR ID , 不同的浏览器会话不能检索或消费已核准的登录。 过期后拒绝批准，来自不同用户的确认证书，重复使用。 测试取消和丢失的网络响应以及成功路径 。

中继或替换的QR 仍然可以欺骗一个人批准攻击者浏览器。 显示请求的应用程序和上下文，需要明确批准，而文件显示扫描本身并不是意图的证据。 临时的无记名证书会限制其寿命；它不会独立地证明消息来自一个物理设备 。

## 比较和最佳做法

### 选择相关层

| 问题                                  | 机制                            | 仍为                                   | 的设计工作 |
| ------------------------------------- | ------------------------------- | -------------------------------------- | ---------- |
| 浏览器如何携带证书?                   | Cookie                          | 主机范围，SameSite, CSRF, 安全属性     |
| 如何代表登录?                         | 服务器会话 ID 或访问令牌        | 存储，过期，验证，撤销                 |
| 如何断言外部身份 ?                    | OIDC 或另一服务商专用的登录协议 | 客户端类型 重定向/状态绑定，断言验证   |
| 几个应用程序如何重新使用身份提供登录? | SSO                             | 协议选择，每个应用程序会话，登录范围   |
| 手机如何批准浏览器登录 ?              | QR 辅助跨设备流                 | 私人浏览器绑定，到期，批准和一次性消费 |

对于同一站点的浏览器应用程序，从服务器管理的会话开始，安全Cookie,除非要求证明有不同的安排。对于资源 API,请决定一个不透明的信使或一个签名的访问信使是否更符合验证和撤销需要。联邦和QR批准可以建立两种应用程序的登录；它们不会取代这些决定。

使用 HTTPS , 验证输入和重定向，保护状态变化请求，以及根据威胁模式的速率限制登录尝试 。在支持时考虑密码或其他防钓认证 。 Token life, 锁闭时间，和重试限制是应用政策，而不是固定的普遍数 。

在接受一个执行之前，测试其失败路径: 过期的证书、 重播、 登录、同时刷新、 被拒绝 、 丢失的回复，以及另一个浏览器试图使用 QR 批准。 仅成功登录并不能验证这些边界 。
