---
title: 'Web 性能优化'
summary: '用 Core Web Vitals 和 DevTools 衡量页面性能，并了解 tree shaking、代码拆分与动态导入。'
---

一个大型的JavaScript有效载荷成本超过下载时间:浏览器必须解析，编译，并执行。 图像也需要解码，内存和渲染工作。首先要找出哪个资源或主线程任务会延迟您所关心的用户动作，然后选择一个处理延迟的更改。

该员额分为四个部分:

1. **理解性能**:重要的衡量标准以及JS捆绑大小如何影响每个尺寸。
2. **减少您捆绑的**: 包括树摇和`babel-plugin-import`在内的构建时间技术
3. **控制**时的负载: 运行时技术，包括代码拆分和动态导入
4. **将所有技术拼凑在一起**:技术如何组合在一起，最佳做法核对表

# 了解业绩

## 核心网络生命和业绩计量

Google的**Core Web Vitals**是衡量真用户体验的标准，它们侧重于加载，交互，视觉稳定性——三轴用户实际感知到的。

### 关键衡量标准

**LCP(最大内容绘画)**

LCP 测量最大可见内容元素(英雄图像，标题，或文本的块)完成渲染后，在依赖 JavaScript 渲染内容的页面上，特别是客户端的 SPA , 渲染封装会直接延迟 LCP ,因为浏览器在脚本完成执行前无法画出任何有意义的内容。

**CLS(累积布局 移动)**

CLS 测量出意料的视觉变化。虽然不直接绑定在捆绑大小上，但输入内容或动态加载字体和图像而无保留空间的脚本有助于布局变化。

**FCP(第一内容画)**

FCP是浏览器生成实际内容的第一个像素时。 Render 屏蔽`<script>`标记在`<head>`不含`async`或 减 减`defer`直接推迟FCP。

**INP(与下一张画的相互作用)**

INP在访问页面时测量交互的响应性。 漫长的任务，昂贵的事件处理器，以及渲染工作可以在交互后延迟下一张油漆。 INP于2024年3月加入LCP和CLS作为核心Web Vital.[INP和核心Web Vitals](https://web.dev/blog/inp-cwv-march-12).

**三丁基锡化合物(总阻断时间),实验室诊断**

三丁基锡化合物在页载量测量中将长主线的阻塞部分相加起来。它有助于诊断灯塔的JavaScript负载成本，但不能取代实地真实相互作用的测量。TTI是灯塔10.[灯塔10 变化](https://developer.chrome.com/blog/lighthouse-10-0)的历史计量标准。

### 如何将大小图捆绑到度量衡

| Metric         | 初级捆绑大小影响                       |
| -------------- | -------------------------------------- |
| LCP            | 大型渲染阻塞捆绑延迟第一次有意义的涂料 |
| FCP            | 同步脚本在`<head>`摊位中初始渲染为     |
| INP            | 昂贵的任务延迟处理和绘画交互           |
| 三丁基锡化合物 | 实验室页载追踪过程中的长任务 阻断主线  |
| CLS            | 动态脚本注入内容而不保留维度           |

## 与 DevTools 和灯塔进行诊断

**在优化前先识别瓶颈。**本文章中的每个技术都有成本: 添加构建复杂度，延迟模块加载和更加简洁的导入。 不加计量地应用它们意味着你盲目地支付这些费用，可能在不慢的代码路径上支付。 瓶颈很少出现在您期望的地方 。

诊断工作流程是:

1. **措施**——获得基准分数并识别哪些度量标准失败。
2. **Profile**– 追踪失败的度量符到特定的资源，模块或代码路径
3. **优化**——应用定点固定
4. **重新测量**–在不引入回归的情况下验证改进

跳过1–2步和跳到3步是最常见的性能错误。 优化错误会浪费精力，并可以引入回归。

### 灯塔

灯塔是起点。 打开 Chrome DevTools →**灯塔**标签，选择**性能**类别，并进行审核。 报告会给出:

- 实验室性能测量，如LCP、FCP、速度指数、三丁基锡化合物和CLS;分别收集现场LCP、INP和CLS
- **机会**:可操作项目，如"Reduce unused JavaScript","Eliminate 渲染阻塞资源",以及"Avoid Service 遗留的JavaScript"等。
- **诊断**:主线工作断裂和网络请求计数等支持数据。

### 网络标签

网络标签显示实际下载的内容。 由**JS**过滤以查看您的块 。要查找的关键内容 :

- **Chunk 大小**:任何超过500 KB(未压缩的单个文件)是一个拆分或懒散加载的候选文件。
- **请求计算初始负载**: 过度的并行性有其自身的成本。 太多的小块会伤害 HTTP/1.1 站点 。
- **缓存头**: 含有内容散列文件名的块应该有较长的`max-age`值。 选择适合部署的新鲜度和重新验证规则；单独拆分不能建立缓存行为 。
- **瀑布**: 阻断 DOMContentLAAD的脚本出现在蓝线前，移动到`async`/`defer`或懒惰加载它们

### 性能标签(火焰图)

在**性能**标签中记录一个页面负载。请查看 :

- **"评价脚本"条目**:主线线上黄色块。 宽块意味着昂贵的剖析/编译。如果单个条目跨百毫秒，该模块是拆分的候选条件 。
- **长任务(红色三角形)**: JavaScript 执行通常是罪犯

### Webpack 捆绑分析器

`webpack-bundle-analyzer`在识别捆绑过大后，揭示* why*:

```bash
npm install --save-dev webpack-bundle-analyzer
```

```js
// webpack.config.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = {
  plugins: [new BundleAnalyzerPlugin()],
}
```

交互式树图可视化显示哪些模块最大，哪些依赖性被复制，以及您认为是树形的库是否仍然被完全捆绑。

### 实际诊断工作流程

```
Lighthouse → identify which metrics are failing
     ↓
Bundle analyzer → find which modules/deps are bloating those files
     ↓
Apply: tree shaking / babel-plugin-import / splitChunks / dynamic import
     ↓
Re-measure (Lighthouse) to verify improvement
```

# 减少你捆绑的东西

本节涵盖**建设时**技术，以确保未使用的代码永远不会在第一时间进入最后捆绑.有两种互补的方法:

- `Tree shaking`: 捆绑者静态分析您的进口，并删除从未使用过的输出
- `babel-plugin-import`:一个 Babel 编译时间转换，将命名广泛的进口改为目标路径进口，对不支持无害环境管理的图书馆实现同样的效果

## 树摇晃

树摇是构建时的死码消除。 捆绑者分析哪些输出符号实际上是导入和使用，然后将未使用的符号排除在最终输出之外。 名称来源于摇动依赖树直到枯枝掉落的想法 。

### 为什么无害环境管理帮助树摇摆

ES模块暴露了静态进出口，这使得未使用的编码分析更具有可预测性。邦德勒斯也可以优化一些常见的JS模式，但动态出口和`require`调用限制了它们可以安全推断的东西。对于静态无害环境管理进口:

- `import`路径必须是字符串字元(不运行时间变量)
- `import`语句必须出现在(顶层，不在`if`块或函数内)
- 导入的装订物是不可改变的，无法在运行时重新分配

这些限制允许捆绑者在编译时构建完整的依赖性图表，而无需执行任何代码。 CommunityJS(`require`)是相反的:它在运行时解决，路径可以是动态表达式，导出可以有条件地在循环中添加。 捆绑者必须保留无法安全分析的行为。

```js
// ESM — statically analyzable, tree-shakeable
import { add } from './math'

// CommonJS — dynamic, not tree-shakeable
const math = require('./math')
```

在使用具有无害环境管理意识的构件时，更倾向于`lodash-es`,并检查产出，而不是假设每个进口形式都会产生同样的捆绑。

### `sideEffects`字段

上下文中的**副作用**是指任何由于导入模块而运行的代码，无论您是否使用它导出的东西.例如: 注册全局多填充，附加一个`<style>`标记，写入`window`。

默认情况下，捆绑者必须假定每个模块都有副作用，即使没有从模块中导入任何东西，也要保留它。这是安全但昂贵的选择。

你可以用它来控制它`sideEffects`字段内`package.json`:

```json
{
  "name": "your-library",
  "sideEffects": false
}
```

`false`告诉捆绑者，这个包中没有任何模块具有副作用，这样可以安全地移除每一个未使用的导出。`lodash-es`声明这一点，这就是为什么它成为树摇晃-意识构建的首选版本。

对于确实有一些副作用文件的软件包，您可以将它们指定为数组 :

```json
{
  "sideEffects": ["dist/*", "es/**/style/*", "*.less"]
}
```

当一个软件包的发布结构包括这些路径时，它可能使用这样的允许列表: CSS和Less文件有副作用(它们注入样式),但组件逻辑文件没有。

在Webpack自己的配置中，有两个相关的选项值得理解:

- `module.rules[].sideEffects`(一个可选的规则级别凌驾于)上——将规则处理的\_模块标记为副作用。通常为`true`用于 CSS 规则，以防止样式文件被丢弃
- `optimization.sideEffects` (默认 :`true`生产中)- 告诉Webpack尊重`sideEffects`说明来自`package.json`优化期间

### 杀死树木摇晃的生物

**默认对象导出**

```js
// Not tree-shakeable: bundler must retain the whole object
export default {
  add(a, b) {
    return a + b
  },
  subtract(a, b) {
    return a - b
  },
}
```

**类出口**

```js
// Not tree-shakeable: bundler cannot remove individual methods
export class MathUtils {
  add(a, b) {
    return a + b
  }
  subtract(a, b) {
    return a - b
  }
}
```

Webpack和Rollup只在顶层的`export`声明上执行tree shaking，它们不能进行内观和有选择地从输出对象或类中移除方法，因为这些方法可以通过运行时的动态属性访问(`obj[someVar]()`).

**副作用再出口**

```js
export function add(a, b) {
  return a + b
}
export const memoizedAdd = window.memoize(add) // window.memoize is unknown — side effect
```

由于捆绑者无法知道`window.memoize`做什么，它必须假设它有副作用，并保留整个模块。

### 摇树友好型模式:原子命名出口

```js
// Preferred: each export is independently removable
export function add(a, b) {
  return a + b
}

export function subtract(a, b) {
  return a - b
}
```

每个函数都是顶级命名导出，没有副作用。未使用的函数被完全消除。这是`date-fns`和`lodash-es`等保存良好的公用工具库所使用的模式。

## `babel-plugin-import`作为 CommunityJS 库的倒计时

当一个库只舰船CommonJS和树摇不是选项时，`babel-plugin-import`提供了一个替代方案.它是最初由Ant Design团队建造的Babel插件，在编译时重写命名的进口，以引导路径导入。

基于此源代码 :

```js
import { Button, Input, TimePicker } from 'antd'
```

`babel-plugin-import`将其转换为:

```js
import _Button from 'antd/lib/button'
import _Input from 'antd/lib/input'
import _TimePicker from 'antd/lib/time-picker'
```

机制是 Babel AST(抽象语法树)路段。插件截取`ImportDeclaration`节点，根据可配置模板解决每个命名的指定符到其相应的文件路径，并重写节点。没有运行时间超时，因为这纯粹是一个编译时间转换。

`.babelrc`配置 :

```json
{
  "plugins": [["import", { "libraryName": "antd", "style": "css" }]]
}
```

这种方法适用于任何在可预测的目录结构中传输个人文件的图书馆，而不仅仅是`antd`。当无害环境管理路径不可用时，它是一个可靠的倒置，但比真正的树摇摇晃要简单得多，因为它依赖于图书馆的文件组织保持稳定。

## 文件夹文件

一个**桶文件**是`index.ts`(或`index.js`),它从目录中重新输出所有东西，给消费者一个单一的导入路径:

```ts
// components/index.ts
export { Button } from './Button'
export { Input } from './Input'
export { Modal } from './Modal'
export { DatePicker } from './DatePicker'
// ... 50 more exports
```

然后消费者写道:

```ts
import { Button } from '@/components'
```

人机学很有吸引力，但桶式文件是大代码库中捆绑bloat最常见的原因之一。

### 当枪管再出口保留额外代码时

问题不在于桶装文件的存在，而是它们迫使捆绑者评估所有再出口的模块，然后才能确定您实际需要哪个模块。当一个桶装从具有副作用的模块中再出口，或者当这些模块从其他桶装入时，捆绑者必须保留整个过渡图。

将桶文件嵌入的单体和组件库中的效果化合物:

```
pages/Dashboard.tsx
  → imports from @/components (barrel)
    → re-exports Modal (modal/index.ts)
      → imports './modal-animations' (side effect: registers a global)
```

尽管`Dashboard.tsx`只需要`Button`,但最终却在`modal-animations`中拉动，因为捆绑器无法证明枪管链是无副作用的。 单枪管并不能将每个组件强制输出。 保留副作用和依赖图决定哪个模块在优化后存活；用生产捆绑分析器验证。

### 解决方案

**直接导入**是最简单的固定。从源文件而不是枪管导入 :

```ts
// Before — pulls in the entire barrel
import { Button } from '@/components'

// After — only Button is evaluated
import { Button } from '@/components/Button'
```

**`optimizePackageImports`**(Next.js 13.5+)是零迁移的替代方案，它告诉Next.js在建设时自动重写枪管进口，以引导路径进口，而不需要更改来源:

```js
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ['@/components', 'lucide-react', '@radix-ui/react-icons'],
  },
}
```

这相当于`babel-plugin-import`对`antd`所做的，但被构建到Next.js中。 大众图标和UI库(`lucide-react`,`@heroicons/react`,`@radix-ui/react-icons`)即使没有配置，默认也会得到优化。

**避免为包含许多不相关的模块的内部目录创建新的桶**. Barrels在真实的公用API边界(,例如一个已公布的软件包)的导出时有用.然而，在一个应用程序编码库中，它们会在不相关的模块之间创建无形的耦合。

| 情景                  | 建议的办法                         |
| --------------------- | ---------------------------------- | ---------------- |
| 内部`components/`目录 | 直接进口或`optimizePackageImports` |
| 已发布 API            | Barrel是合适的。在`sideEffects`    | 中标记副效果文件 |
| 第三方共同JS库        | `babel-plugin-import`              |

# 控制何时的负载

上一节涉及减少捆绑商包括的内容。**何时**浏览器实际在运行时获取并执行代码。有两种互补技术:

- **代码拆分**(`splitChunks`):在建设时将构建分割为可缓存块，这样稳定的依赖性永远不会被不必要地重新下载
- **动态导入**: 将块的装载推迟到实际需要时进行，使初始有效载荷保持小

## 按需加载与按需捆绑

在进入技术细节之前，值得澄清社区中经常混杂的两个术语，因为没有普遍商定的命名公约。

**点播捆绑**是一个构建时的考虑，它只意味着在运行时实际需要的最后捆绑中包含代码，通过`tree shaking`和`babel-plugin-import`等技术实现。 捆绑者在编译时决定排除什么。

**点播时加载**是一个运行时的担忧，这意味着推迟一个代码模块的下载和执行，直到用户交互或导航实际需要它。它通过动态`import()`实现。浏览器在运行时决定要获取什么 。

区分关系在于它们解决不同问题并在管道的不同点上运行。 点播捆绑会减少生产过的代码总量，点播捆绑会控制初始页面载荷中发送的代码数量。 这两种代码都是优化应用所必需的。 缓发捆绑仍然会将所有前置的，推迟装载而不捆绑的，只会延迟下载膨胀模块 。

## 用`splitChunks`拆分代码

代码拆分和动态导入是相关但截然不同的。 动态导入控制*当* 代码负载时，代码拆分控制* 如何* 构建为块 。

核心问题分割 Chunks 地址 :不分割，每个输入点都会将所需的所有内容，包括共享的依赖性 。 使用 React 的两页都会在 捆绑中最后有 2 份 React 。 更关键的是，每次应用程序代码更改，即使 React 本身没有改变，整个 捆绑文件也必须被用户重新下载 。

代码拆分通过将稳定的依赖性与频繁更改的应用程序代码区分出来来解决这个问题。包含React和其他第三方包的第三方依赖 chunk可以被浏览器无限地缓存(, 使用长长的`Cache-Control`最长缓存时间的)内容- hash文件名。每次部署时只需要重新调整小的应用程序块 。

### Webpack 的自动分割条件

Webpack的`SplitChunksPlugin`模块按照块选择，大小阈值，共享使用，以及请求限制进行分组。 默认值因版本和模式不同而异。 当前的webpack 文档列出生产默认值，包括`minSize: 20000`,`maxAsyncRequests: 30`,`maxInitialRequests: 30`,和`chunks: 'async'`;这些不是通用的性能目标。

对照您已安装的版本检查[SplitChunksPlugin 参考](https://webpack.js.org/plugins/split-chunks-plugin/)。在 Next.js 或另一个框架中，在假定独立网页包默认之前检查其生成的配置 。

### 共同的手工战略

为了明确的控制，典型的生产配置将三个关注点分开:

```js
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: -10,
          reuseExistingChunk: true,
        },
      },
    },
  },
}
```

- **`vendors`块**:所有`node_modules`代码。 变化很少，缓存寿命很长 。
- **`common`块**:两个或两个以上切入点使用的应用程序代码，偶尔会更改。
- **条目块**: 页面专用代码。 经常更改 。

每层都有不同的缓存无效频率，这正是你想要的。

> **警告词**: 调和分裂的Chunks 阈值很诱人。在不进行剖面分析的情况下进行阻力。 分解太猛烈地增加了平行请求和HTTP 圆通路，这可能会损害性能，特别是在移动或高纬度连接上。

## 动态导入和按需加载

静态`import`语句在构建时解决。从一个入口到达的每个模块都会被编译到捆绑中，即使该代码路径在给定的用户会话中从未被触发 。

动态`import()`在所有现代浏览器中都可以本土化使用，并推迟加载到运行时间。它返回一个`Promise`,它会解析到模块的名称空间对象 :

```js
// Loaded eagerly — always in the initial bundle
import { heavyChart } from './chart-library'

// Loaded on demand — separate chunk, fetched when called
const { heavyChart } = await import('./chart-library')
```

### 常用案例

**路基分割**

动态导入最有效果的应用。 单页应用程序的每个路由都是单独的块，只有用户浏览时才能加载。在反应中 :

```jsx
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings = lazy(() => import('./pages/Settings'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  )
}
```

在 Next.js App 路由器中，`app/`中的每个页面都是自动代码拆分的。您可以免费进行基于路由的分割，无需配置 。

**条件特性装入**

有些特性很贵，但很少使用。 只有在触发时才装入 :

```js
async function handleExport() {
  const { exportToPDF } = await import('./pdf-exporter')
  exportToPDF(data)
}
```

PDF导出库可能是几百千字节，除非用户明确点击"Export",否则永远不会下载。

### 预装和预装

动态导入会推迟加载直到需要块。如果您可以预测需要块*soon*(,例如，用户正在一个通常导致下一个)的页面上，您可以提示浏览器在闲置时间使用 Webpack 魔法注释获取 :

```js
// Prefetch: low-priority background fetch during idle time
const { Dashboard } = await import(/* webpackPrefetch: true */ './pages/Dashboard')

// Preload: high-priority fetch in parallel with the current chunk
const { HeavyEditor } = await import(/* webpackPreload: true */ './HeavyEditor')
```

Webpack 发送`<link rel="prefetch">`表示`webpackPrefetch`,`<link rel="preload">`表示`webpackPreload`. 区分事项:

| 提示       | 优先级 | 当获取                         | 使用                      | 时  |
| ---------- | ------ | ------------------------------ | ------------------------- | --- |
| `prefetch` | 低速   | 浏览器闲置时间，在当前页面加载 | 之后 下一个可能的导航     |
| `preload`  | 高     | 与当前页面平行                 | 资源 当前页面绝对需要很快 |

当预期好处证明带宽和设备成本合理时，预选下一条路段。在与页面关键资源竞争时，请谨慎使用`preload`,如果使用过度，可能会损害性能 。

在Next.js中，`<Link>`在生产建设中进入景点时会自动预选目标路由，因此在没有任何配置的情况下会获得路由预选。

# 拼凑起来

## 技术如何共同运作

tree shaking、代码拆分和动态导入在不同阶段运作，并处理不同的问题。它们组合起来最为有效。

<Mermaid
chart={`
flowchart TD
src[Source code and dependencies]
src --> ts[Tree shaking]
ts -->|Removes unused exports from each module| sc[Code splitting]
sc -->|Divides output into cacheable chunks| di[Dynamic import]
di -->|Defers non-critical chunks to runtime| result[Optimized delivery]

subgraph build[Build time]
ts
sc
end
subgraph runtime[Runtime]
di
end

style ts fill:#3b82f6,color:#fff
style sc fill:#8b5cf6,color:#fff
style di fill:#10b981,color:#fff
style result fill:#f59e0b,color:#fff
`}
/>

典型的分层策略:

1. **tree shaking**通过消除死代码来减小每个模块的大小。 这样做发生在块内，因此它使以后的每一步都更加有效 。
2. **分裂的Chunks**将(已经树形的)构建成稳定的第三方依赖 chunk和频繁更新的应用程序块，在部署中最大限度地实现缓存命中率。
3. **动态导入**将整块延迟到运行时需要，缩小了初始负载的关键路径。

每种技术都可以独立帮助。但是，不需要tree shaking，分裂的Chunks会分裂膨胀块。没有分裂的Chunks, 动态导入仍然可能迫使重新下载稳定依赖性。没有动态导入，即使是完全优化的捆绑在启动时也会装入所有东西 。

## 最佳做法

**优先无害环境管理-本土图书馆**

使用( U)`lodash-es`改为`lodash`。优先出版`"exports"`字段内`package.json`指向无害环境管理文件。这使得tree shaking无需附加配置。

**在自己的包中宣告`sideEffects`**

如果您正在建设一个库，甚至一个大型的内部单列软件包，请添加`"sideEffects": false`给您的`package.json`如果软件包真的无副作用。如果只添加特定文件，则添加数组变体(如CSS进口)具有副作用。这是捆绑者需要且无法推断的选入信息。

**原子导出**

在单个默认导出对象或类别上优先选择指定出口的颗粒:

```js
// Good — each function can be independently shaken
export function formatDate(d) { ... }
export function parseDate(s) { ... }

// Avoid — bundler retains the whole object
export default { formatDate, parseDate }
```

**对普通JS库使用`babel-plugin-import`,您无法替换**

如果一个库没有建立无害环境管理，而你只使用其API的一小部分，`babel-plugin-import`是一种实用的倒置，提供了树摇的捆绑大小的大部分好处。

**从应用程序代码**拆分销售商

长寿`Cache-Control`第三方依赖 chunk头(e.g. `max-age=31536000, immutable`)表示返回的用户不会重新下载 React, lodash- es, 或其他稳定的依赖性，除非其内容散列变化。 应用程序块在每次部署时都会改变，保持小块 。

**对路线和可选特性使用动态导入**

作为拇指规则:用户在初始页面载荷上没有看到的任何内容都不应该在初始捆绑中。 Route组件，模式，导出特性，admin面板，以及locale消息都是懒散载的自然候选。

**不过度分割**

拆分成几十个小块会降低回报。每个 HTTP 请求都带有高端。在 HTTP/1.1 连接上，过多的平行请求会损害性能。 使用您安装的捆绑器默认值作为基线，然后在更改请求或大小阈值之前测量具有代表性的页面载荷和导航 。

# 结论

从一个缓慢的用户体验开始，您可以测量，然后追踪到负责的资源和浏览器工作。树摇可以减少未使用的代码，代码拆分可以组织发送和再利用，动态导入会推迟可选功能，直到需要它们。选择解决你发现的瓶颈的技术。

每次修改后，检查生成的捆绑，并在可比条件下再次测量。请检查初始加载、 后期互动和重复访问，这样一个路径的改进不会隐藏另一个路径的回归。 保留让使用应用程序的人更快体验的修改 。
