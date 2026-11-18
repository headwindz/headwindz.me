---
title: '实用的 Chrome DevTools 技巧'
summary: '在日常调试中用得上的 Chrome DevTools 技巧。'
---

这些是Chrome DevTools技术，我用来检查瞬间UI、跟踪请求和调查慢相互作用。每个提示都以您可以在相关面板中尝试的动作开始。

## 断点( P)

**延迟后暂停**: 用于调试工具提示等瞬时UI元素或悬浮状态，当您点击右键检查时会消失。

```js
// Pause the page after 3 seconds
setTimeout(() => {
  debugger
}, 3000)
```

这使得您有时间在元素上徘徊，触发工具提示，或者在调试器暂停前设置任何UI状态。

## 屏幕截图抓取( C)

**全页截图**:

- 命令菜单(Cmd+Shift+P)→`Capture full size screenshot`

**元素(节点)截图**:

- `Elements`面板 ~ 右键单击节点 ~`Capture node screenshot`

[抓取节点截图](/static/blogs/dev-tool/capture-node-screenshot.png)

## 元素面板提示

**强制伪态**:

- `Elements`面板 → 选择一个节点 → 右键单击 →`Force state`→`:hover`,`:focus`,`:active`等，用于样式/测试而无需用户交互

![部队的伪状态](/static/blogs/dev-tool/force-pseudo-state.png)

**快速复制CSS申报**:

- 右键单击声明 →`Copy declaration`或`Copy all declarations`

![复制样式](/static/blogs/dev-tool/copy-style.png)

**跳转到源声明**:

- 在`Styles`面板中，单击文件名/ 线条链接打开样式表以精确规则

![样式声明](/static/blogs/dev-tool/style-declaration.png)

## 来源面板提示

**DOM断点**:捕捉出乎意料的DOM突变。

- `Elements`面板 ~ 右键单击节点 ~`Break on`~
  - **子树修改**:当子节点或内容改变时暂停
  - **属性修改**:当属性(像`className`)变化时暂停。
  - **节点移除**: 节点从 DOM 中移除时暂停

![Dom 休息时间为](/static/blogs/dev-tool/dom-break-on.png)!

## 网络面板

**模拟离线和节流带宽**: 复制慢连接或离线情景，以测试您的应用的行为。

- `Network`面板 →`throttle`下拉 → 选择`Slow 4G`,`Fast 4G`,`Offline`或创建自定义配置

![网络节流阀](/static/blogs/dev-tool/network-throttle.gif)

**定位请求源**:查看网络请求是在哪里触发的。

- `Network`面板 → 选择请求 → 检查`Initiator`调用堆栈 → 点击跳转到源代码

![网络发起人](/static/blogs/dev-tool/network-initiator.png)

**在DevTools打开**时禁用缓存 :

- `Network`面板 – 检查`Disable cache`以避免调试时出现停滞的资源

![禁用缓存](/static/blogs/dev-tool/network-disable-cache.png)

**预保存日志**:保持`Network`和`Console`日志跨页重载。

- `Network/Console`面板—请检查date=中的日期值 (帮助)`Preserve log`

![保存日志](/static/blogs/dev-tool/preserve-log.png)

**复制为获取/ cURL**:

- `Network`面板 → 右键点击 →`Copy`→`Copy as fetch`或`Copy as cURL`用于复制请求
- 用于共享请求或调试 API 调用

![网络复制](/static/blogs/dev-tool/network-copy.png)

**块请求**:

- `Network`面板 ~ 右键单击请求 ~`Block request domain`或`Block request URL`
- 添加模式(,例如`*.analytics*`)模拟第三方失败
- 用于测试您的应用程序如何处理缺失资源

![网络块请求](/static/blogs/dev-tool/network-block-request.png)

**自定义列**:

- `Network`面板 → 右击列标题 → 检查想要的列 。

![网络自定义列](/static/blogs/dev-tool/network-customize-columns.gif)

**网络摘要**:在面板底部查看关键度量。

[网络资源信息](/static/blogs/dev-tool/network-resources-info.png)

从左到右:

- **请求**: 请求总数(仅在 DevTools 打开)后计算请求
- **传输**:通过网络发送的压缩数据大小
- **资源**:所有资源的未压缩总规模
- **完成事件**:上一次资源装入完成的时间
- **DOMContent LOADADED事件**:DOMContentLADEDED事件发射时间
- **负载事件**:负载事件发射的时间

## 渲染

**渲染工具**:可视化性能问题。

- 命令菜单(Cmd+Shift+P)→`Show Rendering`→ 启用:
  - **绘画闪光**:绿色亮点显示重新油漆区域
  - **布局变换区域**:突出出乎意料的变换(CLS调试)
  - **框架渲染 Stats**: 显示 FPS , GPU 用途

![渲染工具](/static/blogs/dev-tool/rendering.png)

## 表现基础

**记录一个性能追踪**:

- `Performance`面板 – 交互时的记录 – 停止；检查主线程活动，截图通道和Web Vitals 度量衡

**CPU 节奏用于现实**:

- `Performance`面板 → "CPU" 下垂 → 节流器(例如，4×)到下端设备的表面定时问题

![性能 CPU 拖动](/static/blogs/dev-tool/performance-cpu-throttling.gif)

## 控制台公用事业

DevTools Console 提供了强大的快捷键，**`$`/`$$`**:`querySelector`和`querySelectorAll`(的快捷键返回一个真实的阵列，而不是节点列表的).

```js
// Get all links
console.log($$('a').map((el) => el.href))
```

**`$0`至`$4`**:参考元素面板中最后5个选定元素。

**`$_`**:最后评价的Console表达式的结果。

**`copy(obj)`**:将任意对象复制到剪贴板(甚至为您提供JSON格式的).

## 参考资料

- [Chrome DevTools 文档](https://developer.chrome.com/docs/devtools/)
- [网络面板参考](https://developer.chrome.com/docs/devtools/network/)
- [渲染工具](https://developer.chrome.com/docs/devtools/rendering/)
- [控制台 API](https://developer.chrome.com/docs/devtools/console/utilities/)
- [性能特征](https://developer.chrome.com/docs/devtools/performance/)
