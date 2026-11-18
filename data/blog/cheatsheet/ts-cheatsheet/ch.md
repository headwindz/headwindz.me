---
title: '我的 TypeScript 速查表'
summary: '通过示例速查 TypeScript 常用工具类型及其泛型用法。'
---

# 键

`keyof`操作员取一个对象类型，并产生其密钥的字符串或数字字形结合。

例如，它可用于为对象创建更可读和可维护的类型:

```ts
interface IUser {
  name: string
  age: number
}

type UserKeys = keyof IUser // "name" | "age"
```

使用`keyof`运算符创建更多类型安全功能

```ts
function getValue<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}
const user: IUser = { name: 'Mike', age: 18 }
getValue(user, 'name') // 'Mike'
getValue(user, 'gender') // Compile-time error: "gender" is not a key of IUser
```

# 不包括

`Exclude<T, U>`移除可指定为`U`的联盟成员。要删除对象类型的属性，请使用`Omit<T, Keys>`。

```ts
interface IUser {
  name: string
  age: number
}
type UserWithoutAge = Omit<IUser, 'age'> // { name: string }

type T0 = Exclude<'a' | 'b' | 'c', 'a'> // "b" | "c"
```

`Exclude`正式执行

```ts
type Exclude<T, U> = T extends U ? never : T
```

# 返回类型

抓取函数返回的类型

```ts
const sum = (a: number, b: number) => a + b

type SumResult = ReturnType<typeof sum> // number
```

# 等待着

`Awaited<T>`解包 Promise 类型，包括嵌套的 Promise。

```ts
const sumAsync = async (a: number, b: number) => a + b

type SumResult = Awaited<ReturnType<typeof sumAsync>> // number
```

# 常规

```ts
function toLabelValue<T, LabelKey extends keyof T, ValueKey extends keyof T>(
  labelKey: LabelKey,
  valueKey: ValueKey,
  obj: T
) {
  return {
    label: obj[labelKey],
    value: obj[valueKey],
  }
}

interface Lib {
  id: number
  name: string
  isPublic: boolean
}

const lib = { id: 1, name: 'hi', isPublic: true }

// type: { label: string, value: number }
const labelValue = toLabelValue('name', 'id', lib)
```

[类型Script 通用型参考](https://www.typescriptlang.org/docs/handbook/utility-types)
