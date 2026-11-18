---
title: 多层菜单里的空 href 为什么会重新加载页面
summary: 点击 href 为空的链接可能重新加载页面。用按钮展开子菜单，可以避免意外跳转。
---

我一开始把多层菜单里的每一项都写成了链接。结果，点击本该展开子菜单的那一项时，浏览器还会重新加载页面。

# 菜单需要两种操作

- 点击叶子菜单项，跳转到对应页面。
- 点击其他菜单项，展开下一级菜单。

# 最初的实现

两种菜单项最初都用 `<a>` 渲染。叶子菜单项有一个指向目标页面的 `href`，其他菜单项传入空字符串。我写的 `MenuItem` 组件如下。

```tsx
function MenuItem({ link, title, onClick = () => {} }) {
  return (
    <a href={link} onClick={onClick}>
      {title}
    </a>
  )
}
```

# 为什么点击会重新加载页面

## 叶子菜单项

传入 `{ link: '/aaa', title: 'abc'}`，组件会渲染出 `<a href='/aaa'>abc</a>`。点击后会正常跳转到 `/aaa`。

## 非叶子菜单项

对于非叶子菜单项，空的 `link` 会生成 `<a href="">`。浏览器仍会把空字符串当作一个相对 URL，按文档的基准 URL 解析，通常会导航回当前页面。点击处理函数负责展开菜单，浏览器的默认导航则独立执行，所以一次点击同时触发了两个操作。

省略 `href` 后，`<a>` 元素不会成为超链接。设成 `href="#"` 又是另一种情况，浏览器会导航到空片段，可能改变地址栏或滚动位置。两种写法都不会赋予链接按钮的语义和键盘行为。

# 用按钮展开子菜单

有跳转目标的菜单项继续使用链接。用按钮处理展开和收起，通过 `aria-expanded` 表明当前状态，并用 `aria-controls` 关联对应的子菜单。

```tsx
type MenuItemProps = {
  link?: string
  title: string
  expanded: boolean
  submenuId: string
  onToggle: () => void
}

function MenuItem({ link, title, expanded, submenuId, onToggle }: MenuItemProps) {
  if (link) return <a href={link}>{title}</a>

  return (
    <button type="button" aria-expanded={expanded} aria-controls={submenuId} onClick={onToggle}>
      {title}
    </button>
  )
}
```

父组件管理 `expanded`，并为子菜单设置对应的 `id`。测试时，用 Tab 将焦点移到按钮，再分别按 Enter 和空格。确认子菜单可以展开，地址栏保持原样，叶子菜单项仍能正常跳转。

# 结语

空的 `href` 仍有导航目标。让链接负责跳转，让按钮负责展开子菜单，就能避免意外重载，也能让键盘操作符合用户预期。
