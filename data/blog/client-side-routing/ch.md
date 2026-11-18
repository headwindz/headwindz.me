---
title: '理解单页应用的客户端路由'
summary: '理解单页应用中的 Hash 路由与 History API 路由，并了解它们各自的部署配置。'
---

# 客户端路由是什么？

客户端路由更新应用程序的视图和 URL 而不替换整个文档。路由器可以根据需要获取更多数据或代码。过渡成本取决于这些请求和提供下一个视图所需的工作。

# 下一步.js`Link`组件如何工作

在下一个.js中，`Link`组件允许客户端在页面之间进行导航:

```jsx
import Link from 'next/link'

function Navigation() {
  return (
    <nav>
      <Link href="/about">About</Link>
      <Link href="/blog">Blog</Link>
    </nav>
  )
}
```

对于内部客户端导航，Next.js 更新路由而不替换整个 HTML 文档。它可能仍然会请求路由数据或服务器发送的有效载荷。这可以提供:

- 没有重新装入完整页面
- 更快的页面转换
- 共享布局和仍然挂载的组件中保留状态；路由组件仍可重置
- 更好的用户体验

# 如何验证客户端导航

有简单的方法可以验证客户端导航是否有效:

1. 打开您的浏览器开发者工具
2. 使用元素/督察面板将`<html>`的背景 CSS 属性更改为黄色 :
   ```css
   html {
     background: yellow;
   }
   ```
3. 点击导航链接在页面之间移动
4. 注意页面转换之间黄色背景持续

如果背景颜色持续，它证实浏览器没有进行完整页面重载，客户端导航确实在起作用！

## 补充审定方法

- **网络 Tab**: 以 dev 工具监视网络标签。通过客户端路由，您可以看到XHR/ Fetch 数据请求而不是完整的 HTML 文档请求
- **装入指标**: 浏览器在地址栏中的本地装入旋转器不会在客户端导航时出现 。

# Hash 路由与 History API 路由

实施客户方路线有两种主要办法:

## Hash 路由

Hash 路由使用 URL 片段标识符(联合 国`#`符号)用于管理路线:

```
http://www.example.com/#/about
http://www.example.com/#/blog/post-1
```

**如何工作:**如何工作:

- URL 的散列部分(之后的一切 都结束了`#`)在 HTTP 请求中未发送到服务器
- 改变散列不会触发页面重载
- `hashchange`事件在 URL 散列变化时发生火灾，允许 JavaScript 更新视图

**实例:**

```js
// Listen for hash changes
window.addEventListener('hashchange', (event) => {
  const hash = window.location.hash // e.g., "#/about"
  // Update the view based on the new hash
  renderView(hash)
})

// Navigate programmatically
window.location.hash = '#/about'
```

**Pros:**(英语).

- 在所有浏览器中工作，包括旧浏览器
- 不需要服务器配置
- 易于执行

**康斯:**

- `#`符号的 URL 似乎不太干净
- 对SEO来说并不理想(虽然现代搜索引擎可以处理它)
- 无法调用完整浏览器历史 API

## History API 路由

历史 api 提供了不重新装入页面而操纵浏览器会话历史的方法 :

```js
// Navigate to a new URL
history.pushState({ page: 'about' }, 'About', '/about')

// Listen for navigation events
window.addEventListener('popstate', (event) => {
  console.log('Location:', window.location.pathname)
  console.log('State:', event.state)
  // Update the view based on the new URL
  renderView(window.location.pathname)
})
```

**关键方法:**

- **`pushState(state, title, url)`**:在浏览器历史中添加新条目
- **`replaceState(state, title, url)`**:修改当前历史条目
- **`popstate`事件**:用户使用浏览器回/前方向按钮导航时起火。

**Pros:**(英语).

- 没有散列符号的干净语义 URL
- 更适合SEO的动作
- 完全控制浏览器历史
- 可以通过每个历史条目的状态对象

**康斯:**

- 需要服务器配置来处理直接 URL 访问
- 只在现代浏览器(中工作，尽管今天这很少是)的 问题

# History API 路由的服务器配置

对于一个静态的，客户端的SPA, 配置服务器返回到`index.html`, 以便直接访问可以到达客户端路由器。下面的例子描述了该部署模式。 Next. js 这样的服务器端框架通过自己的服务器或支持的托管设置处理路由请求。不要用毛毯式SPA倒置替换这些处理器 。

## 用于本地开发设置的 Webpack dev 服务器

```js
module.exports = {
  entry: {
    app: './src/index.js',
  },
  devServer: {
    // This line is the important part for history api routing
    historyApiFallback: true,
    port: 3000,
    hot: true,
  },
}
```

`historyApiFallback: true`选项告诉dev服务器为任何404个响应服务`index.html`.

## 用于生产设置的 Nginx 配置

```nginx
server {
  listen 80;
  server_name example.com;

  location / {
    root /home/dist;
    index index.html index.htm;
    try_files $uri $uri/ /index.html;
  }
}
```

`try_files`指令试图为请求的文件服务，然后是目录，如果两者均不存在，最后会降回`index.html`.

# 结论

客户端的路由对于现代网络应用至关重要，它提供了快速，无缝的导航体验。虽然Hash 路由更为简单，而且随处可见，但 html5 历史 api 提供了更清洁的urls和更好的SEO,其代价是需要适当的服务器配置。当构建类似下个.js,反应路由器，或vue路由器的框架时，这种复杂性大部分被抽象化了——但理解基本机制有助于您调试问题并做出知情的建筑决策。

# 参考资料

- [MDN: SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA)(英语).
- [MDN: 历史.push State()](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState)
- [MDN:流行态事件](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event)
