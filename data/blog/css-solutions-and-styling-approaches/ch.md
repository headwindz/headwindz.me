---
title: 'CSS 方案与样式组织方式'
summary: '比较 BEM、CSS Modules、以 styled-components 为例的 CSS-in-JS，以及原子化 CSS，了解它们各自的适用场景。'
---

# 导言

CSS架构决定了团队如何命名样式，限制意外冲突，并应用共享设计值.本文章比较了BEM,CSS模块，运行时间CSS-in-JS,以及各机制的效用类，以及它留给团队的工作。

# BEM(块，元素，修改器)

BEM代表`Block, Element, Modifier`.它是`naming convention`和用于组织CSS代码的方法，鼓励模块化思考你的风格。

## BEM 如何运作

BEM 瞄准镜在模块和块级别而非全局样式表范围中呈现样式。这是一个游戏更改器，因为您可以改变模块的样式，而无需担心在页面上打破其它内容 。 请注意**BEM 是一个常规，不是工具或库 。它依赖于开发人员遵循命名规则来维护样式组织并防止冲突 。**

其结构为:

- **Block**:一个独立实体，在自己的(上有意义，例如`button`,`card`,`header`,).
- **元素**:一个块的一部分，没有单独的含义(,例如`header__logo`,`button__text`)
- **调制器**:一个块或元素上改变外观或行为的旗帜(,例如`button--primary`,`card--featured`)

## 示例

```css
/* Block */
.card {
  padding: 16px;
  border-radius: 8px;
}

/* Element */
.card__title {
  font-size: 20px;
  margin-bottom: 8px;
}

.card__body {
  font-size: 14px;
  color: #666;
}

/* Modifier */
.card--featured {
  border: 2px solid gold;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card__title--featured {
  color: #d4af37;
}
```

```html
<!-- Usage -->
<div class="card card--featured">
  <h2 class="card__title card__title--featured">Featured Post</h2>
  <p class="card__body">This is an important post...</p>
</div>
```

## 优点

- 明确的命名惯例防止**命名冲突**
- 易于理解结构和等级
- 用任何 CSS 预处理器工作
- **不要求构建工具**

## 缺点

- Verbose 类名称
- 在开发者学科上使用
- 可能变成重复
- 在工具一级没有执行CSS范围

# CSS模块

CSS模块默认将 CSS 本地化来解决范围界定问题。您导入 CSS 模块时，类名被设定到模块中，不能泄露到应用程序的其他部分 。

## CSS模块如何运作

每个 CSS文件都成为具有本地范围类名称的模块。**构建过程**生成**独有的类名称**防止您在应用程序中发生碰撞 。

```css
/* Button.module.css */
.button {
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
}

.primary {
  background-color: #0070f3;
  color: white;
}

.secondary {
  background-color: #e5e5e5;
  color: #333;
}
```

```jsx
// Button.tsx
import styles from './Button.module.css'

export default function Button({ variant = 'primary', children }) {
  return <button className={`${styles.button} ${styles[variant]}`}>{children}</button>
}
```

## 范围界定如何运作

当您构建您的应用程序时，CSS 模块会转换类名 :

```css
/* Compiled output */
.Button_primary__a1b2c {
  background-color: #0070f3;
  color: white;
}
```

重写本地类名可以防止偶然的类名碰撞.全球选择器，继承，以及正常的级联仍然可以影响这些元素。

## 优点

- **真实样式范围化**位于`build`级别
- 构建生成的名称避免本地类之间的碰撞
- 组件工作良好
- 熟悉 CSS 的开发者易于理解

## 缺点

- 需要构建工具支持
- 导入样式的学习曲线
- 动态类组成可以是动词

# CSS-in-JS (英语:CSS-in-JS) 互联网档案馆的存檔，存档日期2013-09-02.

`styled-components`等CSS-in-JS库允许您直接用 JavaScript 写入CSS,它们为组件级样式提供了自动临界CSS提取和动态样式能力。

## 风格的组件如何工作

样式组件为每个样式组件生成独特的类名，并将样式直接注入DOM. 样式被范围化到组件上，可以基于道具成为**动态**.

```jsx
import styled from 'styled-components'

const StyledButton = styled.button`
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;

  background-color: ${(props) => (props.primary ? '#0070f3' : '#e5e5e5')};
  color: ${(props) => (props.primary ? 'white' : '#333')};

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export default function Button({ primary, disabled, children }) {
  return (
    <StyledButton primary={primary} disabled={disabled}>
      {children}
    </StyledButton>
  )
}
```

## 高级特性

样式- 组件可以使组件级的样式方法，如扩展样式和创建样式组成 :

```jsx
const BaseCard = styled.div`
  padding: 16px;
  border-radius: 8px;
  background: white;
`

const FeaturedCard = styled(BaseCard)`
  border: 2px solid gold;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`

// Using it in a component
function PostCard({ featured, title, excerpt }) {
  const CardComponent = featured ? FeaturedCard : BaseCard
  return (
    <CardComponent>
      <h2>{title}</h2>
      <p>{excerpt}</p>
    </CardComponent>
  )
}
```

## 优点

- 真正的构成部分一级的范围界定
- 基于组件道具的**动态**样式
- 样式的全部 JavaScript 能力
- 没有类命名冲突

## 缺点

- 较大的运行时间(运行时添加样式)
- JavaScript 捆绑大小增加
- 对大型应用的性能影响
- 对不熟悉JS-in-CSS的开发者的学习曲线
- 安全部门改革设想的复杂性

# 原子式CSS( 原子式CSS)

Atomic CSS(也称 Utility-First CSS)采取了不同的方法:你不用创建语义元件类，而是使用小型的，单功能的效用类。`tailwind`这样的框架已经普及了这种方法。

Atomic CSS与内线风格基本相似，因为你把样式限制在一个很小的范畴，但它解决了内线风格有的几个问题:

## 内含样式的问题

内置样式具有较高的CSS特异性，使其难以超越，不支持伪类的(`:hover`,`:focus`)或伪元素的(`::before`,`::after`),限制了它们的能力。

## 原子 CSS 如何解决此问题

原子 CSS 使用微小的，可重复使用的功能类，由您共同组成:

```html
<!-- Instead of writing custom CSS -->
<div class="flex items-center justify-between rounded-lg bg-white p-4 shadow-md">
  <h2 class="text-lg font-bold text-gray-900">Post Title</h2>
  <button class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">Read More</button>
</div>
```

有了建设过程，最后的CSS只包括你使用的公用事业。

- **支持伪类**:`hover:bg-blue-600`,`focus:outline-none`
- **更低的特异性**: 容易用修饰器覆盖公用设施
- **小范围**:每个工具只影响您明确应用的东西
- **一致设计系统**: 工具值来自一个预定义的主题

## 实际中的原子核部分

```html
<!-- Tailwind CSS example -->
<button
  class="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
>
  Click me
</button>
```

## 优点

- 没有命名冲突
- 易于保持设计的一致性
- **最小 CSS 输出(只使用过的公用设备被捆绑)**: 原子 CSS 框架使用构建时扫描来检测您标记中实际使用的公用设备类别。这意味着您申请的公用设备只有 CSS 才会被纳入您的最后 CSS 文件中。对于一个大型的应用程序来说，相对于其他可能仍然包含未使用选择器的方法，这可以使**更小的**CSS 捆绑 。这会导致更快的负载时间和更好的性能，特别是在移动设备上。
- **Easier 查找源代码**:在搜索应用样式的地方时，您可以直接搜索您的编码库中的效用类名称。例如，搜索`hover:bg-blue-600`将立即显示使用此样式的每个组件。 这样做是因为效用名称直接存在于您的 HTML/ JSX 中。 相比之下，其他方法通常使用`less/sass`预处理器、 CSS文件，或样式组件定义，需要您通过多个文件搜索并理解样式表的结构，以找到定义或应用特定样式的地方。在 Atomical CSS 中，分类名称及其效果之间的关系是明确和直截的，这使得在编码库中可以更容易追溯到样式的来源 。
- **明确本地样式**: 读者可以在标记旁看到选中的公用设施。这可以帮助代码审查 。

## 缺点

- 动画 HTML 标记
- 用于工具类名称的深度学习曲线
- 紧紧的情侣造型 标记
- 对不熟悉原子 CSS 的开发者来说，更难读 HTML
- **完整类名称必须可见扫描器**:`const colors = { primary: 'bg-blue-500', danger: 'bg-red-500' }`等静态地图在扫描源时工作，包括`className={colors[theme]}`.`bg-${color}-500`等构造片段不暴露完整类.对于 Tailwind v4 , 明确注册缺失源或酌情使用`@source inline(...)`. Tailwind v3 使用其内容/安全列表配置.见[类探测](https://tailwindcss.com/docs/detecting-classes-in-source-files).

# 由制约选择

| 接近              | 如何组织风格         | 团队管理什么                       |
| ----------------- | -------------------- | ---------------------------------- | ---------- |
| BEM               | A 共享类命名大会     | 命名学科全球级联，未使用的样式     |
| CSS模块           | 本地类的构建生成名称 | 组成，全局规则，继承样式           |
| 运行时 CSS- in-JS | 样式由组件定义和道具 | 运行时成本，服务器渲染，库专用集成 | 生成。     |
| 工具类            | 由标注               | 主题常规，源码扫描，可读组件边界   | 组成的小类 |

一个想要带有本地名称的普通样式表的团队可以从CSS模块开始.一个共享通用词汇表的团队可以使用带有标定主题的Tailwind. Runtime CSS-in-JS可以表达依赖prop的样式，但其发送和服务器的交付成本需要测量。 BEM在团队能够维护会议时没有构建步骤的工作。

这些方法可以共存。 选择一个常规或工具解决具体维护问题的边界，并比较具有代表性组件中已建的输出和编辑工作流程 。

# 结论

BEM 组织名称，CSS 模块将本地类名隔离，运行时 CSS- in- JS 将样式与组件逻辑连接，以及 工具类以标记方式组成样式。 每种变化都发生在样式工作发生的地方以及团队必须维护的常规 。

从问题开始，您当前的方法没有解决。 尝试一个代表性组件的替代方案，检查生成的输出和渲染成本，并判断另一个开发者如何容易改变它。 保持让这些日常变化更加清晰的方法 。
