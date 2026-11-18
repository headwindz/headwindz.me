---
title: '用 CSS 控制文本选择和点击'
summary: '通过示例了解如何用 user-select 和 pointer-events 控制文本选择与指针命中，同时兼顾键盘操作。'
---

横跨控件可以不慎选择其标签。 装饰性覆盖可以挡住其下方的按钮。 CSS为每个问题提供不同的属性 :

| 属性             | 控制                       | 典型使用                 |
| ---------------- | -------------------------- | ------------------------ |
| `user-select`    | 用户是否以及如何选择文本   | 避免在拖动柄上意外选择   |
| `pointer-events` | 哪个元素成为指针输入的目标 | 让我们点击通过装饰性覆盖 |

## 用户选择: 控制文本选择

`user-select`属性控制文本选择。 其共同值为 :

- `auto`:初始值.对于普通文本，通常允许选择，但父母的`none`或`all`值可以影响结果。
- `text`:允许文本选择。
- `none`: 防止元素中文本选择。
- `all`: 选择时选择整个元素的内容，选择时会包含其中的任何部分 。

规格还定义了`contain`,但[MDN报告说浏览器不支持它](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/user-select#values).请检查页面的兼容表以备您的目标浏览器使用。

### 防止意外选择

将`none`应用到控件中，控件的标签在交互过程中应该保持未选中。 保留文章文本和其他内容阅读器可能想要复制可选择的文本 。

演示将同一句与三项选择规则进行比较:

- `text`:选择单个单词或部分句子。
- `none`: 防止在句子中开始文字选择。
- `all`:在选择其中任何部分时选择整句。

尝试在每个示例中选择一个单词。 选择文本不会复制到剪贴板；复制按钮需要单独的执行 。

演示包括`-webkit-user-select`,作为浏览器需要前缀的倒置。 编辑操场中的CSS以实验每个值。

[尝试选择示例](demo://text-selection-and-clicks/selection.tsx)

### 将选择规则保留在本地

虽然`user-select`不是按照规格继承的，但初始的`auto`值会考虑一个母体的`none`或`all`. 浏览器执行也有继承差异，在[MDN参考文献](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/user-select#syntax)中描述。 将规则应用到最小的相关元素中，并在目标浏览器中测试嵌入内容。

禁用选择不能保护基本内容不被复制.[CSS规格](https://drafts.csswg.org/css-ui-4/#content-selection)将其描述为一种交互的便利，而不是复制保护机制。

## 指向事件: 瞄准控制指向器

对于 HTML 元素，使用`auto`进行普通的指针瞄准，以及`none`来排除其中的某个元素。`stroke`和`fill`等其他值主要用于 SVG .

使用`none`,浏览器将目标对准被排除元素后面的合格元素。被排除元素仍然可见，并保持其布局空间。请参见[MDN 指针事件参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/pointer-events)。

### 请点击一个覆盖

演示将装饰性锡条置于按钮之上。 包装器将定位上下文建立起来，`z-index`将覆盖置于按钮上方。 空的覆盖使用`aria-hidden="true"`使其远离无障碍树 。

点击按钮并观看计数器增加值。 检查复选框后，复选框使用`pointer-events: none`,所以指针输入通过按钮。 取消检查即可切换到`auto`: 复选截取指针输入值，点击后不再增加计数器 。

使用 Tab 来聚焦按钮并 Enter 来激活它。 计数器仍然会增加，因为`pointer-events`不禁用键盘激活 。

[尝试覆盖实例](demo://text-selection-and-clicks/overlay.tsx)

### 恢复以儿童为目标

`pointer-events`是继承的，孩子可以明确使用`auto`成为使用`none`的家长内部的指针目标:

```css
.floating-layer {
  pointer-events: none;
}

.floating-layer button {
  pointer-events: auto;
}
```

这样一来，浮层就可以通过它的空区域点击，而它的按钮仍然可以点击。针对这些按钮的事件在捕获和弹跳时仍然会穿过母体。因此，一个在母体上的听器仍然可以运行，正如[CSS规格解释](https://drafts.csswg.org/css-ui-4/#pointer-events-control).

### 用 HTML 语义禁用控制

`pointer-events: none`不从键盘导航中移除元素。可聚焦链接仍然可以使用 Tab 接收焦点，并且可以使用 Enter 激活。它也不妨碍文本选择 。

对于必须无法使用的按钮，请使用其原生的`disabled`属性:

```html
<button type="button" disabled>Submit</button>
```

Links没有本地的`disabled`属性。如果链接必须保持可见但无法显示，请决定如何通过每个支持的输入方法来显示该状态并阻止激活。 添加`aria-disabled="true"`表达状态，但不会自行禁用行为。[MDN aria- disabled reference](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-disabled)解释此区分 。

## 结论

使用`user-select`选择文本，`pointer-events`选择指针。 将选择限制保留在本地，让装饰层通过点击，并在一个动作无法使用时使用本地控制状态。 测试指针交互和键盘访问是因更改一个不一定改变另一个。
