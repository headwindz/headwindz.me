---
title: '关于像素，你需要知道什么'
summary: '理解物理像素、CSS 像素与设备像素比，以及它们如何影响响应式设计和无障碍体验。'
---

# 何谓像素

一个像素(`picture element`)是一个光栅图像中代表特定颜色的单点，这个术语可以指网络开发中的不同概念:

- **物理像素**:屏幕上的实际硬件点
- **逻辑像素**:操作系统(OS)用于跨设备一致显示的抽象
- **CSS像素**:独立于设备密度的网络开发单位

## 物理像素(也称设备像素或硬件像素)

物理像素是设备屏幕上的实际硬件点，任何设备上都有固定的金额，由硬件决定。

```
One physical pixel = one hardware dot.
```

**分辨率**是显示器上物理像素的数量，一般表示为宽×高的(,例如1920×1080). 更高的分辨率表示更多的像素，从而产生更尖锐的视觉效果。

示例:

```
iMac (Retina 4K, 21.5-inch, 2017)
Physical resolution: 4096 x 2304
```

关键特性:

- 由屏幕硬件决定的固定计数，不能改变设备上物理像素的数量。
- 显示器上最小的发光单位
- 购买显示器时，所公布的(分辨率如1920×1080)在技术规格中指物理像素。
- 密度是物理像素每英寸(PPI). 更高的PPI表示在同一物理空间中更多的像素，从而产生更锐利的图像。

## 逻辑像素(也称设备独立像素`DIP`)

逻辑像素是一种操作系统抽象，可以确保内容在具有不同物理像素密度的设备之间一致显示。 操作系统根据设备的特性将逻辑像素映射到物理像素，允许用户有一致的经验。 逻辑像素中`100px wide`的元素在手机和桌面上在现实世界大小上看起来相似，尽管手机每英寸物理像素更多。

```js
// Get screen resolution in logical pixels
console.log(screen.width + '×' + screen.height)

// Get available screen size
console.log(screen.availWidth + '×' + screen.availHeight)

// Get window size, taking zoom level into account
console.log(window.innerWidth + '×' + window.innerHeight)
```

### 逻辑解析

当您在操作系统(中更改分辨率，例如`Display Settings`)时，您正在改变逻辑像素，而不是物理像素。 操作系统会将新的逻辑分辨率映射到相同的物理像素上，这可以让事物看起来大或小。

示例:iMac(丽蒂娜4K,21.5-英寸，2017)

- `Default mode`:逻辑分辨率为`2048 × 1152`
- `More space mode`:逻辑分辨率为`2304 × 1296`

## CSS像素

一个专门为网络开发者创建的抽象层，用于CSS和JS(,例如`border: 1px solid black`). CSS spec将其定义为与标准查看角度绑定的参考像素，而不是直接与一个硬件点绑定。

### 设备像素比(`DPR`)

也称为 CSS像素比，这是`ideal viewport`中设备像素与 CSS像素之比 。此值可以随`zoom`变化，也可以在显示器之间移动窗口。例如 :

| 设备        | 物理分辨率 | 设备像素比 | 逻辑分辨率 |
| ----------- | ---------- | ---------- | ---------- |
| iPhone 6    | 750×1334   | 2          | 375×667    |
| iPhoneX     | 1125× 2436 | 3          | 375× 812   |
| iPad Pro    | 2048× 2736 | 2          | 1024× 1368 |
| 三星银河 S4 | 1080×1920  | 3          | 360×640    |

```js
// Get device pixel ratio
window.devicePixelRatio
```

### CSS像素和逻辑像素之间的关系

- 在许多设备上(典型的手机，笔记本电脑，桌面):浏览器经常制作1个CSS像素=1个逻辑像素.因此`CSS px`中的视图和布局尺寸与`the operating system's logical size`匹配。
- 它们可以在浏览器缩放上出现差异。 缩放会改变一个 CSS像素使用多少物理像素。 逻辑像素通常不会改变 。所以 。`1px CSS px`能够代表一个不同的屏幕量 。`1 logical px`缩放时

## 像素概念之间的比较

| 光谱               | CSS像素                                      | 逻辑像素                                | 物理像素     |
| :----------------- | :------------------------------------------- | :-------------------------------------- | :----------- | ---- |
| 范围               | 网络(HTML/CSS/JS)                            | 操作系统/平台(本土应用，有时浏览器内部) | 硬件         |
| 定义               | CSS spec; 参考像素                           | 平台定义的装置独立单元                  | 实际光发射点 |
| 在你看到它的地方是 | `width:200px`,`window.innerWidth`            | 原生UI,`screen.width`                   | 显示规格     |
| 缩放               | 浏览器缩放将多少物理像素映射改变为 1 CSS像素 | 通常不受浏览器缩放(OS级)                | 硬件         | 固定 |

## (PPI)每英寸像素

像素密度(也称屏幕密度或显示密度)测量特定物理区域内的**物理像素**的密度。 PPI是一种物理测量，通常不会直接影响CSS的布局，但对于理解显示质量很重要。 更高的PPI意味着更锐的显示，这就是Retina和高DPR屏幕看起来如此柔和的原因。

# 视图端口

## 布局视图端口

CSS布局的相对视图，并包含布局。

## 视觉视图端口

用户当前所看到的站点区域，用户可以通过放大或插入来操纵可视视图端口，而不影响布局的视图端口。

## 理想视图端口

对设备来说最理想的布局视图端口大小。

```html
<!-- ✅ Correctly set viewport so CSS pixels match device-independent pixels -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<!-- ❌ NEVER disable user scaling - violates WCAG accessibility guidelines -->
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
/>
```

第一个元标记告诉浏览器使布局的视图端口与理想的视图端口(匹配，`device-width`).**Never**使用`user-scalable=no`或限制性的`maximum-scale`值，因为这样可以防止视野低的用户缩放，并违反WCAG 2.1成功标准1.4.4.

# 缩放

页面缩放和剪切缩放会影响不同的坐标系统。 页面缩放会改变多少设备像素代表一个CSS像素，并且通常会改变`window.devicePixelRatio`. CSS像素中的布局查看端口也会改变。

Pinch 缩放可视化的视图，而不改变 CSS-像素大小或 DPR 。当您需要可见区域或其尺度时，请使用`window.visualViewport`。`screen.width`并不是当前布局或视觉视图的替代品。请参见[设备 PixelRatio 和 缩放](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)。

# CSS单元和无障碍

虽然`px` (像素)是最直观的 CSS 单元，它们不会以用户字体大小的偏好来缩放。这是关键 的可访问性 。

## 像素(`px`)维基月球在线解说-维基月球在线解说-维基月球在线解说-维基月球在线解说-维基月球在线解说-维基月球在线解说-维基月球在线解说-维基月球在线解说-维基月球在线解说-维基月球在线解说-维基月球在线解说-维基月球在线解说-维基月球在线解说-维基月球在线解说-维基月球日。

`px`单位是网络开发者的抽象，它不是物理像素，而是独立于设备DPR的标准测量单位，在实际操作中，它是我们拥有的并且对许多布局属性工作最出色的混凝土单位。

## Em(`em`)时速 :

对于比值等属性，`em`是相对于元素计算出的字体大小的，对于`font-size`本身来说，是相对于继承的字体大小的，因此嵌入的相对字体大小可以复合。

```css
.paragraph {
  font-size: 16px;
  margin-bottom: 1.5em; /* 24px */
}
```

`em`的挑战在于它会复合:如果父母一方拥有`font-size: 0.9em`,孩子拥有`font-size: 1.25em`,则需要将其乘以得到实际大小。

## 雷姆(`rem`)电源电源

`rem`单元(`Root em`)总是相对根`<html>`元素的字体大小，避免了复合问题。

```css
html {
  font-size: 100%; /* Preserve the browser/user default. */
}

h1 {
  font-size: 2rem; /* 32px when the root computes to 16px. */
}
```

## 可访问性:字体缩放对缩放

视力低的用户可以两种方式增加文本大小:

1. **浏览器缩放**(`Ctrl/Cmd and +`或`settings`):缩放所有东西，包括`px`值。 WCAG要求站点在缩放200%时可用。
2. **默认字体大小**(浏览器设置):仅影响使用相对单位(`rem`,`em`,`%`)的元素，这对于依赖持续字体缩放而非每个站点放大的用户来说至关重要。

**问题**:`px`值不尊重用户默认字体大小设置，打破了依赖此功能的用户的无障碍环境。

```css
/* ❌ Bad: ignores user font size preference */
p {
  font-size: 16px;
}

/* ✅ Good: respects user font size preference */
p {
  font-size: 1rem;
}
```

# 最佳做法

## 何时使用每个单位

- **使用`rem`**: 字型，间隔，组件大小，应随用户偏好而缩放
- **使用`px`**: 固定装饰元素(边框 阴影)媒体查询中的断点
- **避免`px`(单位:千美元)**: 字体大小，适合文本大小的容器

## 测试不同的像素密度

现代浏览器提供工具测试您网站在不同设备上的外观:

```js
// Test responsive images
console.log('Screen width:', window.screen.width)
console.log('Viewport width:', window.innerWidth)
console.log('DPR:', window.devicePixelRatio)
console.log('Effective pixel width:', window.innerWidth * window.devicePixelRatio)
```

**Chrome DevTools**: Open DevTools – 切换设备工具栏 – 选择不同的设备测试各种 DPRs(1x, 2x, 3x)

## 常见陷阱

1. **固定像素宽度**: 突破响应设计。 使用相对单位或最大宽度代替 。
2. **忽略用户字体大小**: 总是通过更改浏览器默认字体大小(进行测试 不只是缩放)
3. **低分辨率图像在 Retina**上 :通过`srcset`提供 2x 图像，用于简洁的视觉

```html
<!-- Responsive images for different DPRs -->
<img src="image.jpg" srcset="image.jpg 1x, image@2x.jpg 2x, image@3x.jpg 3x" alt="Description" />
```

# 结论

理解像素并不仅仅是了解定义，而是做出改善用户体验和可访问性的战略决定。使用`rem`来进行打印和可缩放组件，使用`px`来进行固定的装饰元素，并且总是用不同的字体大小和缩放水平进行测试。通过`srcset`、适当的视图配置和深思熟虑的单元选择，你可以建立对每个人来说都行之有效的网络体验。
