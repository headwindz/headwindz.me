---
title: '渐进式 Web 应用与 Service Worker'
summary: '从基础到生产，了解 Service Worker 生命周期、缓存策略和离线设计。'
---

# 导言

进步的Web Apps(PWA)代表了网络开发的范式转变:将网络的可及性和可访问性与本地应用程序的用户体验结合起来.一个正确执行的PWA可以安装到家用屏幕，可靠地在不良的网络条件上工作，即时加载，并提供类似应用的交互。

这个指南涵盖了你需要构建生产准备的PWA:从Service Worker的基本知识到先进的缓存策略，生命周期管理，以及现实世界的实施提示。到最后，你将有一个坚实的理解，即如何利用Service Worker来创造快速，可靠，并参与网络应用。

# 什么是PWA(美国)

一个进步的Web App(PWA)并不是一个特定的技术或框架，它是一套最佳做法和现代的Web能力，在结合后，会提供类似app的经验。

**核心原则**: 渐进增强.您的应用对每个用户都有效，不论浏览器选择如何，但随着能力可用，将逐步增强经验 。

## 主要特点

- 进步:为每个用户工作，而不论浏览器
- 独立连接:工作离线或在低质量网络上进行
- 安全:通过HTTPS服务，防止偷窥和篡改
- 重新接触:按下通知保持用户的接触
- 可安装: 添加到家用屏幕上，无需应用商店摩擦

## 实际世界效益

- 从缓存即时装入
- 离线工作或在片状网络上工作
- 没有应用商店的下载或更新
- 平滑的，类似应用的经验

# PWA核心技术

1. 全面实施《行动计划》需要三个关键组成部分:

## 1. 网络应用程序清单

JSON文件定义了您的应用程序在安装时的出现方式，包括图标、 名称、 主题颜色和启动行为。它允许`Add to Home Screen`启动时迅速并控制应用程序的外观 。

```json
{
  "name": "My Progressive Web App",
  "short_name": "MyApp",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "description": "A progressive web app example",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

在您的 HTML 中链接 :

```html
<link rel="manifest" href="/manifest.json" />
```

### 解析关键显示属性

**`name`vs`short_name`:**(中文(简体) ).

- `name`: 安装时显示全名
- `short_name`:家用屏幕上显示的图标下的名字(最大 12 个字符)

**`display`模式:**

- `standalone`:看起来像本地的应用程序(无浏览器 UI)
- `fullscreen`:游戏全屏(,浸泡应用)
- `minimal-ui`: 独立且导航控制最小
- `browser`:在普通浏览器标签中打开

**`start_url`:**

- 应用程序启动时装入 URL
- 在分析中添加查询参数以跟踪 PWA 发射
- 一定在范围之内

**`scope`:**

- 定义应用程序的 URL 空间
- 在浏览器中打开范围外的 URL
- 显示目录的默认值

**`theme_color`:**

- 自定义 OS 主题元素(状态栏，工具栏)
- 应该符合您的应用程序的主要颜色

## 2. 服务人员

一个在背景中运行的 JavaScript 工作，独立于您的网页。它充当可编程的网络代理，允许 :

- 离线功能
- 背景同步
- 推动通知
- 高级缓存策略

下一节将详细介绍这方面的情况。

## 3. HTTPS要求

Service Worker在生产中需要HTTPS(`localhost`和`127.0.0.1`可以免予开发).这对安全至关重要，因为Service Worker具有强大的能力，如果服务于不安全的连接，可以被利用。 HTTPS确保:

- 安全通讯
- 防范中层人攻击
- 值得信赖的推力通知
- 大多数现代网络API需要

# Service Worker基本知识

Service Worker建在`Web Worker`API上，它是独立于JavaScript主线程的独立线程，这意味着资源密集型操作不会阻断UI线程。

## 服务人员的主要制约因素

了解这些制约因素对于适当执行至关重要:

**1. 无法直接访问 DOM:**

- Service Worker在工人环境中经营
- 无`window`,`document`, 或 DOM API
- 通过`postMessage`与页面通信

**2. HTTPS只生产():**

- 安保需要，服务人员能力强大
- `localhost`和`127.0.0.1`免予发展
- 一些托管服务提供免费HTTPS(Netlify,Vercel,GitHub Pages)

**3.基于范围的控制:**

- 服务人员的范围由其档案地点决定
- `/app/sw.js`的工人只能控制`/app/`下的页面
- 将(`/sw.js`)放置在根上以控制整个站点
- 通过登记选项可以缩小范围，但不能扩展至文件位置以外

## 登记服务人员

在您主 HTML 或应用程序的条目点 :

```html
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/serviceWorker.js', {
          scope: '/',
        })
        console.log('Service worker registered:', registration.scope)
      } catch (error) {
        console.error('Service worker registration failed:', error)
      }
    })
  }
</script>
```

**重要注释:**

- `load`事件注册以避免与初始页面负载竞争
- `scope`选项定义了服务人员控制的 URL
- 注册返回`ServiceWorkerRegistration`对象

# Service Worker生命周期

了解生命周期对于适当实施《妇女行动计划》至关重要。

- 注册:当页面注册Service Worker脚本时
- 安装:当浏览器安装Service Worker时
- 安装的(等待): 安装后，如果旧版本仍在运行，新工人将等待。如果您关闭了由旧工人控制的所有标签，或者呼叫`skipWaiting()`,新工人将立即激活 。
- 激活 :当新工人开始活动并控制页面时，您可以立即调用`self.clients.claim()`来控制所有页面 。没有它，页面必须重新装入才能由新工人控制 。
- 激活: 服务人员现在控制并处理取回事件。它准备截取网络请求，管理缓存，并执行背景任务 。
- 冗余:如果在旧Service Worker活动时检测到新Service Worker，则新Service Worker会被安装，但将等待旧Service Worker不再控制任何客户端后再激活，这将确保平稳过渡而不会干扰用户体验。

<SketchDiagram
  src="/static/images/pwa/service-worker-lifecycle.svg"
  alt="Service worker lifecycle showing installing, installed and waiting, activating, activated, and redundant; registration slots and the effects of waitUntil, skipWaiting, and clients.claim."
  width={1000}
  height={1530}
/>
_从[delapuente/ service-works - 101](https://github.com/delapuente/service-workers-101)重新提取，对[Service Worker进行生命周期详细检查
规格](https://www.w3.org/TR/service-workers/)_

## 生命周期阶段

### 1. 安装

当Service Worker首次注册或发现新版本时触发。

```js
self.addEventListener('install', (event) => {
  event.waitUntil(
    // Open cache and pre-cache critical resources
    caches
      .open('app-v1')
      .then((cache) => {
        // Pre-cache critical resources
        return cache.addAll(['/', '/index.html', '/styles.css', '/app.js'])
      })
      .then(() => {
        // Skip waiting to activate new worker immediately
        self.skipWaiting()
      })
  )
})
```

**关键点:**

- `caches`API 通常用于安装时存储资产。 详见[MDN Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
- `event.waitUntil()`将安装事件延长至Promise 完成
- 安装时缓存关键资源
- `skipWaiting()`立即激活新工人(谨慎使用)

### 2. 安装的(等待)

成功安装后，新Service Worker等待旧版本是否仍然活跃。

**为什么等待?**

- 确保一致性:由老工人控制的旧网页
- 防止版本冲突
- 新工人在老工人控制的所有页面关闭时激活

**跳过等待:**

```js
// In service worker
self.skipWaiting()

// Or from page
registration.waiting.postMessage({ type: 'SKIP_WAITING' })
```

### 3. 激活

当Service Worker成为活跃的(时，即刻或当老工人释放)后，触发。

```js
self.addEventListener('activate', (event) => {
  event.waitUntil(
    // Clean up old caches
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.filter((name) => name !== 'app-v1').map((name) => caches.delete(name))
        )
      })
      .then(() => {
        // Take control of all pages immediately
        self.clients.claim()
      })
  )
})
```

**关键点:**

- 清理这里的旧缓存
- `clients.claim()`立即控制所有页面
- 没有`claim()`, 页面必须重新装入才能被控制

### 4. 启动

Service Worker现在掌握了一切，将处理接送事件。

# 重要的非生命周期服务人员活动

## `fetch`事件

解除了每个网络请求的控页。Service Worker的功能核心 。

```js
self.addEventListener('fetch', (event) => {
  const { request } = event

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return cached response if found
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(request).then((networkResponse) => {
        // Cache successful responses
        if (networkResponse.status === 200) {
          const responseClone = networkResponse.clone()
          caches.open('app-v1').then((cache) => {
            cache.put(request, responseClone)
          })
        }
        return networkResponse
      })
    })
  )
})
```

**常用案例:**

- 执行缓存策略
- 离线后退
- 请求操纵
- 应对转变

## `push`事件

收到服务器的按键通知时解除。

```js
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  const title = data.title || 'New notification'
  const options = {
    body: data.body || 'You have a new message',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    data: data,
  }

  event.waitUntil(self.registration.showNotification(title, options))
})
```

**常用案例:**

- 显示按键通知
- 在背景中更新缓存数据
- 徽章计数更新

## `message`事件

`page`向Service Worker发送消息时被解除。

```js
// In service worker
self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((names) => {
        return Promise.all(names.map((name) => caches.delete(name)))
      })
    )
  }
})

// From page
navigator.serviceWorker.controller.postMessage({
  type: 'SKIP_WAITING',
})
```

**常用案例:**

- 触发服务人员更新
- 在程序上清除缓存
- 发送配置数据

# 缓存战略

不同的资源需要不同的缓存方法。主要模式如下:

## 1. 缓存第一个(缓存返回网络)

**Best for**:静态资产 很少改变(CSS,JS,图像，字体)

```js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request)
    })
  )
})
```

**流量:**

1. 先检查缓存
2. 找到后返回缓存回复
3. 如果快取失败，从网络获取

## 2. 网络第一个(网络掉回缓存)

**Best for**:API呼叫，经常更新的内容

```js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    // Try network first
    fetch(event.request)
      .then((response) => {
        // Clone and cache the response
        const responseClone = response.clone()
        caches.open('app-v1').then((cache) => {
          cache.put(event.request, responseClone)
        })
        return response
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request)
      })
  )
})
```

**流量:**

1. 先试试网络
2. 缓存成功响应
3. 如果网络失败，返回到缓存

## 3. 暂停时重审(SWR)

**Best for**:内容可略为过时(社交媒体素材，新闻)

```js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open('app-v1').then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          cache.put(event.request, networkResponse.clone())
          return networkResponse
        })
        // Return cached immediately, update in background
        return cachedResponse || fetchPromise
      })
    })
  )
})
```

**流量:**

1. 立即返回缓存版本
2. 在背景中从网络获取
3. 更新下一次请求的缓存

## 4. 仅限网络

**Best for**:实时数据，POST请求，分析

```js
self.addEventListener('fetch', (event) => {
  if (event.request.method === 'POST') {
    event.respondWith(fetch(event.request))
  }
})
```

## 5. 仅缓存

**Best for**: 预选离线页面，很少使用

```js
self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request))
})
```

## 选择正确的战略

| 资源类型    | 建议战略                 | 为什么             |
| ----------- | ------------------------ | ------------------ |
| App shell   | 缓存先期                 | 危急，很少更改     |
| CSS/JS 捆绑 | 缓存 首个                | 版本，不可变的     |
| 图像/fonts  | 缓存先是                 | 较大，很少改变     |
| API数据     | 网络首先需要             | 新鲜数据           |
| 用户生成的  | Stale- while- revalidate | 平衡新鲜度和速度   |
| 解析器      | 网络只使用               | 实时，不使用临界的 |
| 离线后退    | 缓存仅                   | 永不需要更新       |

# 连接点: 一步一步地演示示例

这个演示集了上述核心概念:注册、生命周期、缓存和离线功能。

## 文件结构

以`demos/pwa-service-worker/`创建此最小设置 :

```txt
demos/pwa/
├─ index.html
├─ app.js
├─ app.css
├─ serviceWorker.js
```

## 关键文件

**指数.html:**

```html
<!doctype html>
<html>
  <head>
    <title>PWA Demo</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="app.css" />
  </head>
  <body>
    <h1>PWA Service Worker Demo</h1>
    <button id="test-fetch">Test Fetch</button>
    <pre id="container"></pre>
    <script src="app.js"></script>
  </body>
</html>
```

**app.js**(Service Worker登记 早前的)节:

```js
const log = (msg) => {
  const el = document.getElementById('container')
  el.textContent += `[${new Date().toLocaleTimeString()}] ${msg}\n`
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('serviceWorker.js', { scope: './' })
      log(`✓ Registered. Scope: ${reg.scope}`)
    } catch (err) {
      log(`✗ Failed: ${err.message}`)
    }
  })
}

document.getElementById('test-fetch').addEventListener('click', () => {
  fetch('https://jsonplaceholder.typicode.com/todos/1')
    .then((res) => res.json())
    .then((data) => log(`Fetched data: ${JSON.stringify(data)}`))
    .catch((err) => log(`Fetch error: ${err.message}`))
})
```

**app.cs**(简单造型保持UI可读):

```css
body {
  max-width: 640px;
  margin: 40px auto;
  padding: 0 16px;
}

#container {
  margin-top: 16px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  min-height: 120px;
  white-space: pre-wrap;
}
```

**ServiceWorker.js**(结合了来自前几节的):

下方的服务人员结合安装的(预切),激活(清理的),并获取(缓存-首个)模式已经解释过:

```js
const CACHE = 'app-v1'
const ASSETS = ['./index.html', './app.js', './app.css']

// Install: pre-cache critical assets (pattern from "Installing" section)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => {
        console.log('[SW] Pre-caching assets')
        return cache.addAll(ASSETS)
      })
      .then(() => {
        console.log('[SW] Skip waiting')
        self.skipWaiting()
      })
  )
})

// Activate: clean up old caches (pattern from "Activating" section)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
  )
  self.clients.claim()
})

// Fetch: cache-first strategy (pattern from "Cache first" section)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached

      return fetch(event.request).then((response) => {
        // Cache successful responses - clone BEFORE using the response
        if (response.status === 200) {
          const responseClone = response.clone()
          caches.open(CACHE).then((cache) => cache.put(event.request, responseClone))
        }
        return response
      })
    })
  )
})
```

## 运行和测试

将上面的文件保存在一个目录中，然后在本地服务该目录 :

```bash
http-server -p 8080
# Open http://localhost:8080
```

**测试:**

- 打开`DevTools`→`Application`→`Service Workers`:应显示已注册和正在运行的`serviceWorker.js`。
- 打开`Application`→`Cache`: 应以缓存资产查看`app-v1`
- 点击“ 测试抓取 ” : 请求日志网络
- 在 DevTools 中启用`Network`→`Offline`: 模拟离线模式
- 再次点击“ 测试抓取 ” :应显示离线消息 ->`fetch`由于缓存第一策略仍然有效
- 离线时刷新页面: 缓存页面仍在装入

# 常见陷阱

## 调试困难

**问题**:难以调试Service Worker工行为。

**解决方案:**

**1. 使用Chrome DevTools:**双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双双

- `Application`—`Service Workers`— 检查/调试/未登记
- 开发时检查`Update on reload`
- 使用`Bypass for network`进行无Service Worker的测试

**2. 增加综合记录:**

```js
const DEBUG = true

function log(...args) {
  if (DEBUG) {
    console.log('[SW]', ...args)
  }
}

self.addEventListener('fetch', (event) => {
  log('Fetch:', event.request.url)
  log('Mode:', event.request.mode)
  log('Method:', event.request.method)
})
```

## HTTPS 要求阻碍开发

**问题**:没有HTTPS就无法在移动设备上进行测试。

**解决方案:**

- 临时 HTTPS 隧道使用`ngrok`
- 使用`localhost`(豁免 HTTPS 要求)
- 使用设备符号 Chrome DevTools 远程调试
- 部署到免费的 HTTPS 托管(Netlify, Vercel, GitHub Pages)

# 现实世界 PWA

建议使用Workbox或框架集成等生产准备解决方案来简化开发。这些工具处理缓存模式、边框和优化，让您专注于您的应用程序的独特功能。

## 工作框

工作框(由`Google`)最受欢迎的PWA工具箱。它提供预置的服务人员食谱，并减少锅炉板。所有我们覆盖的缓存策略都可以通过Workbox的高级API来实施。

**Webpack集成:**

```js
// webpack.config.js
const { InjectManifest } = require('workbox-webpack-plugin')

module.exports = {
  plugins: [
    new InjectManifest({
      swSrc: './src/service-worker.js',
      swDest: 'service-worker.js',
      exclude: [/\.map$/, /manifest$/, /\.htaccess$/],
    }),
  ],
}
```

**在您的服务人员中:**

```js
// service-worker.js
// More elegant than manual caching
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

// Precache static assets
// self.__WB_MANIFEST is generated by Workbox at build time
precacheAndRoute(self.__WB_MANIFEST)

// Cache CSS/JS with cache-first
registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script',
  new CacheFirst({ cacheName: 'static-resources' })
)

// API calls with network-first
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 5 * 60 })],
  })
)

// Images with stale-while-revalidate
registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 7 * 24 * 60 * 60 })],
  })
)
```

**实用执行:**I 使用`Workbox`来为[arco. 设计文件](https://arco.design/),这是一个巨大的静态网站，有大量的文件。 执行提供了离线文件访问，并改善了负载性能 。请查看[拖动请求](https://github.com/arco-design/arco-design/pull/1172)执行细节 。它允许用户访问文件，即使**CDN为静态资源无法使用**或**用户是离线的**, 显示服务人员在现实世界情景中的力量 。

## 框架整合

**下一个.js:**

```js
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})

module.exports = withPWA({
  // Your Next.js config
})
```

**维特:**

```bash
npm install vite-plugin-pwa -D
```

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'My App',
        short_name: 'MyApp',
        // ... manifest config
      },
    }),
  ],
})
```

## MSW (西班牙语)

[Mock Services Worker(MSW)](https://mswjs.io/)是API在开发与测试环境中进行模拟的强大工具，它使用Service Worker技术拦截网络请求并提供自定义的响应，可以模拟各种情景而不需要真正的后端，这对测试边缘案例，处理错误状态，或在后端准备好之前开发特性特别有用。

# 结论

进步的Web Apps代表了Web和原生应用经验的趋同。

- **Web App Manification**提供可安装性和类似app的外观
- **Service Worker**启用离线功能、缓存和背景任务
- **HTTPS**确保安全，是Service WorkerAPI的要求。
- **缓存策略**确定资源如何存储和服务
- **生命周期事件**控制更新和缓存管理

从静态资产的缓存先到动态内容的网络先到网络先到覆盖大多数使用的案例。从那里，您可以随着 PWA 的成熟，逐步添加推移通知、背景同步以及更精密的缓存策略。
