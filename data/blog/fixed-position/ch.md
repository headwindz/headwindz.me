---
title: CSS 固定定位
summary: 固定定位通常以视口为参照，但某些 CSS 属性会让最近的祖先元素成为包含块。
---

# `fixed` 定位

我曾经以为 `position: fixed` 总是相对于视口定位。MDN 文档指出了一个例外：

> 通常以视口建立的初始包含块为参照，但如果某个祖先元素的 transform、perspective 或 filter 不是 none，就会改用该祖先元素作为参照。

也就是说，当祖先元素设置了某些 CSS 属性，它就可能取代视口，成为[包含块](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block)。

## 哪些属性会建立新的包含块

- **`transform`**：任何非 `none` 的值，例如 `transform: translateX(0)`。
- **`perspective`**：任何非 `none` 的值。
- **`filter`**：任何非 `none` 的值，例如 `filter: blur(0)`。
- **`will-change`**：设置为 `transform`、`perspective` 或 `filter`。
- **`contain`**：`layout`、`paint` 或包含其中任一值的组合。
- **`backdrop-filter`**：任何非 `none` 的值。

[试试这个示例](demo://fixed-position/fixed.tsx)

滚动页面，观察固定定位的方框。勾选复选框后，方框会相对于带有 `transform: translateX(0)` 的外层容器定位。取消勾选，再观察它相对于视口的位置。

## CSS 为什么这样定位

非 `none` 的变换会建立局部坐标系。因此，固定定位的后代会以这个祖先元素为参照。

包含块和层叠上下文是两个概念。有些属性会同时建立两者，但只有层叠上下文还不够。例如，`opacity: 0.5` 会改变层叠行为，却不会为固定定位的后代建立包含块。参见[包含块的建立规则](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Display/Containing_block)。

## 实际用法

### 让第三方组件相对于容器定位

如果无法修改使用了 `position: fixed` 的第三方组件，可以用带有 `transform: translateX(0)` 的容器包裹它：

```css
.wrapper {
  transform: translateX(0); /* Creates new containing block */
}
```

### 将弹窗固定在页面的某个区域

在容器上建立局部包含块，即可让弹窗固定在该区域内：

```css
.modal-container {
  transform: translate3d(0, 0, 0);
  overflow: auto;
}

.modal {
  position: fixed;
  /* Now fixed relative to .modal-container */
}
```

## 常见问题与排查

如果固定定位元素没有贴住视口边缘，检查各级祖先是否设置了以下属性：

```css
/* Any of these will break viewport-relative fixed positioning */
.ancestor {
  transform: scale(1);
  filter: brightness(1);
  will-change: transform;
  contain: paint;
}
```

可以在浏览器开发者工具中逐级检查祖先元素的计算样式。

## 实践建议

1. 为视觉效果加入变换或滤镜时，检查它们是否影响固定定位的后代。
2. 有意建立包含块时，在 CSS 中写明原因。
3. 在不同滚动位置和视口尺寸下验证定位结果。

## 替代方案

如果祖先元素必须保留变换，而组件仍要相对于视口定位，可以考虑调整 DOM 结构，或用 React Portals、Vue Teleport 将组件渲染到变换容器之外。如果需求是滚动到指定位置后吸附，也可以使用 `position: sticky`。
