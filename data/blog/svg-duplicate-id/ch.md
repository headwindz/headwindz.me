---
title: '如何解决 React 中 SVG ID 重复的问题'
summary: '用 React 的 useId 避免 SVG ID 冲突，并了解何时可以通过简化图标省去 ID。'
---

在构建现代的网络应用程序时，您会经常导入 SVG文件作为图标，插图或图形的 React 组件。然而，当使用多个包含相同内部 id 的 SVG 实例时，会出现一个常见但微妙的问题:**重复 id 碰撞**。 这个问题会导致视觉闪烁，断层梯度，错误的剪辑路径，以及访问问题。在此文章中，我会解释这些碰撞的原因，并展示多种方法来修正它们 。

# 问题

Svg文件经常使用内部的id来引用梯度，口罩，过滤器和剪辑路径等元素.根据 HTML 规格，**id必须是在文档**中独有的.当您在页面上多次渲染相同的 svg ,或者使用不同的 svg , 碰巧具有相同的`id`时，您违反了此要求。 浏览器只能使用该 id 引用第一个元素，导致后续的引用失败或行为不可预测 。

## 示例:破损的svg

[svg 复制 IDs 演示](demo://svg-duplicate-ids/duplicate-ids.tsx)

**隐藏第一个图标时第二个图标为何消失?**

这显示了重复的id问题的关键方面.两个图标都使用`id="gradient"`来进行梯度定义.由于id必须是独一无二的，浏览器只承认第一次发生，当第二个图标引用`fill="url(#gradient)"`时，它实际上是指向第一个图标的梯度——而不是它自己的。

当您用`display: none`隐藏第一个图标时，它的整个 SVG 子树(包括`<linearGradient id="gradient">`定义)从渲染树中删除 。第二个图标中的`url(#gradient)`引用现在没有指向什么，导致它失去填充，并显得无形 。这就是为什么您会看到第二个图标消失，尽管它在 DOM 中仍然可见 。

**密钥取走**: 带有重复ID的元素不能获得自己的独立定义，它们都和DOM中最先出现的元素相同。

## 现实世界的影响

- **视觉错误**: 颜色，梯度，或过滤器可能显示不正确
- **无障碍问题**:`aria-labelledby`和`aria-describedby`可能引用错误的元素。
- **剪贴路径失败**: 多个组件可能共享相同的剪贴区域
- **很难调试**: 问题只在多个实例存在时才会出现

# 解决方案

## 解决方案 1: 使用自定义钩子的运行时间 id 生成

如果您无法修改您的构建配置或需要更多的控制，您可以使用自定义的反作用钩子在运行时创建 ID :

```tsx
import { useRef } from 'react'

let idCounter = 0

function useUniqueId(prefix = 'id') {
  const idRef = useRef(null)

  if (idRef.current === null) {
    idRef.current = `${prefix}-${++idCounter}`
  }

  return idRef.current
}

function IconWithGradient() {
  const gradientId = useUniqueId('gradient')

  return (
    <svg viewBox="0 0 100 100">
      <defs>
        <linearGradient id={gradientId}>
          <stop offset="0%" stopColor="blue" />
          <stop offset="100%" stopColor="red" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill={`url(#${gradientId})`} />
    </svg>
  )
}
```

```tsx
import { useId } from 'react'

function IconWithGradient() {
  const id = useId() // Generates a unique id like ":r1:"
  const gradientId = `gradient-${id}`

  return (
    <svg viewBox="0 0 100 100">
      <defs>
        <linearGradient id={gradientId}>
          <stop offset="0%" stopColor="blue" />
          <stop offset="100%" stopColor="red" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill={`url(#${gradientId})`} />
    </svg>
  )
}
```

对于一个受控客户端唯一React 17 应用程序，一个计数器可以在一个模块中区分出实例。它不能提供稳定的服务器/客户端ID,独立捆绑的复制件可以有单独的计数器。不要使用这个倒置器来进行服务器渲染或水合。在服务器和客户端树同意时，最好使用调用器提供的明确的ID.[React useId](https://react.dev/reference/react/useId)处理匹配ID的处理。

## 解决方案 2:无 ID 的内置 svgs

如果一个固件填充符合设计要求，删除梯度也会删除其ID引用。 这会改变外观。对于一个必须保留其梯度的图标来说，它不是一个相同的修复 :

```tsx
// Instead of using url(#gradient)
<svg viewBox="0 0 100 100">
  <defs>
    <linearGradient id="gradient">
      <stop offset="0%" stopColor="blue" />
      <stop offset="100%" stopColor="red" />
    </linearGradient>
  </defs>
  <circle fill="url(#gradient)" />
</svg>

// Use direct colors or CSS variables
<svg viewBox="0 0 100 100">
  <circle fill="var(--gradient-color)" />
</svg>
```

## 最佳做法

1. **为您的使用选择正确的解决方案**:
   - 运行时钩:当您需要动态控制时
   - 无 ID:对于没有梯度/过滤器的简单图标

2. **具有多个实例的测试**: 总是通过在同一页上多次渲染来测试 svgs

3. **检查您的 svg 源代码**:从设计工具(Figma , Illustrator)对不必要的`id`S 进行导出 svg 的检讨

4. **使用一致的命名**:如果手动前缀，使用像`component-element-id`那样清晰的命名惯例

# 结论

SVG ID 属于文档，因此每个给定的图标都需要其定义和匹配引用的独有的ID.在可重复使用的 React 组件中使用`useId`来保持这些引用与正确实例的绑定。如果设计工作没有梯度或过滤器，简化 SVG可以完全取消对ID 的需要 。

一起测试几个实例，包括支持的隐藏- icon状态和服务器渲染。 单个图标可以看起来正确，而重复的 ID 则在页面的其他地方打破另一个实例 。
