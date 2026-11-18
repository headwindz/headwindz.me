---
title: 'React 的 key 使用指南'
summary: '了解 React 如何使用 key 匹配列表元素，以及如何选择稳定的 key 或用它重置组件状态。'
---

# 理解 React 的 key

> 键使反应元素具有稳定的`identity`

## 列表缺少 key 时的警告

```jsx
import React from 'react'

function App() {
  const persons = ['mike', 'jason', 'sharky']
  return (
    <ul>
      {persons.map((p) => {
        return <li>{p}</li>
      })}
    </ul>
  )
}
```

反应会发出带有以上代码的警告 :
`Warning: Each child in a list should have a unique "key" prop.`

## 如何选择 key？

key应为`unique`和`stable`

### 何时可以使用数组索引作为 key？`under some circumstances`

阵列指数是`unique`跨数组。

```tsx
import React, { useState } from 'react'

function App() {
  const persons = ['mike', 'jason', 'sharky']
  return (
    <ul>
      {persons.map((p, index) => {
        return <li key={index}>{p}</li>
      })}
    </ul>
  )
}
```

然而，如果项目中的`order/number`可能改变，阵列索引不是`stable`.

[索引key Demo](demo://react-key-practices/array-index-as-key.tsx)

**尝试自己**: 选中`mike`并点击添加按钮。您会看到检查状态错误地停留在第一个位置，而不是预期的`mike`。

### `Stable`key

通常我们会有一个独特和稳定的`id`像后端/数据库中每个记录一样的属性。

[稳定键](demo://react-key-practices/stable-key-demo.tsx)

**尝试自己**:现在勾选`mike`并点击添加 。 复选框正确保留`mike`,因为每个人都有稳定的`id`键 。

## 常见的防标键

### 随机值或时间戳

```jsx
// DON'T DO THIS
{
  items.map((item) => <div key={Math.random()}>{item.name}</div>)
}

// OR THIS
{
  items.map((item) => <div key={Date.now()}>{item.name}</div>)
}
```

随机值在每个渲染时会改变身份。 时间戳可以在渲染之间改变，也可以在同一毫秒内创建的兄弟元素之间重复。 两者都不适合用于稳定项目ID 。 更改的key会导致重新挂载和丢失本地状态 。

### 重复的 key

```jsx
// BAD: Multiple items with same key
{
  items.map((item) => <div key={item.category}>{item.name}</div>)
}
```

重复键混淆React的调节算法，并可能导致不正确的更新或丢失状态。

## 高级关键概念

### Fragment 上的 key

在从组件返回多个元素或将数组映射到Fragment时，需要为Fragment添加key:

```jsx
function Glossary({ items }) {
  return (
    <dl>
      {items.map((item) => (
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  )
}
```

### key 只需在同一组兄弟元素中唯一

key 无须全局唯一，只需在同一组兄弟元素中唯一。

```jsx
function Blog() {
  const posts = [{ id: 1, title: 'Post 1' }]
  const comments = [{ id: 1, text: 'Comment 1' }] // Same id is fine!

  return (
    <>
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
      {comments.map((comment) => (
        <Comment key={comment.id} {...comment} />
      ))}
    </>
  )
}
```

### 通过更改 key 重新挂载组件

使用大小写:我有一个选择和输入组件。每个选择选项都会更改，将输入重置为默认状态 。

[key卸载 Demo](demo://react-key-practices/key-unmount-demo.tsx)

**试一下自己**:在两个`inputs`中键入一些东西，然后更改`select`.第二张`input`(与`key`)重置，因为重置时键变时重置。

### 所涉业绩问题

key对 React 的调节性能至关重要。 有了合适的key，React可以:

- 高效重排已有的 DOM 节点，而不是重新创建它们
- 列表中的项目移动时保留组件状态
- 当每个项目的身份不变时，将其匹配到现有的组件实例

key在对齐时识别项目。它们本身并不跳过组件生成。 Render 跳过取决于其他机制，如[回忆](https://react.dev/reference/react/memo)。

# 结论

从项目的稳定身份中选择一个key，通常是其数据库ID,所以当列表更改时，组件状态会跟随项目。key需要在兄弟元素中独有。仅在项目不会插入、删除或重排时使用索引，从而改变与位置相关的身份。

当您想要重置组件状态时，刻意修改key。对于普通的更新，请保持稳定。在调和过程中，key控制身份，但是它本身并不阻止组件再次渲染 。
