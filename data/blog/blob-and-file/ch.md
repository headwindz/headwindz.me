---
title: 'Blob 和 File：在 JavaScript 中处理二进制数据'
summary: '用 JavaScript 的 Blob 和 File API 读取文件、创建对象 URL，并了解图片上传和 PDF.js Worker 的用法。'
---

`Blob`持有不可变的二进制数据。`File`添加了名称和修改元数据，通常来自文件输入或拖放。本指南遵循主要决定 : 读取字节，通过对象 URL 预览，或者不转换为文本而发送 。

# Blob API 组合键

## 什么是布洛布吗？

**`Blob`**对象代表了不可变的，原始的二进制数据，把它当作文件类数据的容器，可以:

- 读作文本或二进制
- 转换为流程进行处理
- 用于接受 Blob 的 API 。 API 需要文件名或其他元数据可能特别需要文件

## 创建块

```js
// From JSON data
const obj = { hello: 'world' }
const jsonBlob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' })

/**
 *  Blob {
 *    size: 22, // in bytes
 *    type: 'application/json'
 *  }
 */

// From text
const textBlob = new Blob(['Hello, world!'], { type: 'text/plain' })
// From array buffer (binary data)
const buffer = new ArrayBuffer(8)
const binaryBlob = new Blob([buffer], { type: 'application/octet-stream' })
```

## 如何读取blobs

### 文件阅读器 API

您可以使用`FileReader`API 读取 Blob 数据 :

```js
const reader = new FileReader()
reader.onload = (e) => {
  console.log('Blob data as text:', e.target.result)
}
reader.readAsText(jsonBlob) // Read as text
```

### 从 blobs 创建对象 URL

`URL.createObjectURL()`生成一个引用 Blob 数据的临时 URL :

```js
const blob = new Blob([JSON.stringify({ hello: 'world' })], {
  type: 'application/json',
})

// Create a URL: "blob:https://example.com/ff415f41-2b1b-4e47-bc1c-37112e0ff4b2"
const blobUrl = URL.createObjectURL(blob)

// Use the URL (e.g., for downloads)
const link = document.createElement('a')
link.href = blobUrl
link.download = 'data.json'
link.click()

// Clean up - important for memory management!
URL.revokeObjectURL(blobUrl)
```

**重要:**在防止内存泄漏时总是取消对象 URL。 URL 仍然有效，直至文档卸下或明确取消为止 。

# 文件 API

## 理解文件对象

**`File`**对象是一个专门的Blob对象，它具有文件名和修改日期等附加元数据。文件一般来自:

- `<input type="file">`元素
- 拖放操作
- 用于测试或数据生成的程序创建

## 程序创建文件

```js
const file = new File(
  ['hello', 'world'], // Array of content parts
  'test.txt', // Filename
  {
    type: 'text/plain',
    lastModified: Date.now(),
  }
)

/**
 * File {
 *   name: "test.txt",
 *   lastModified: 1594093337229,
 *   lastModifiedDate: Tue Jul 07 2020 11:42:17 GMT+0800 (China Standard Time),
 *   size: 10,
 *   type: "text/plain"
 * }
 */
```

## 文件阅读器 API

**`FileReader`**同步读取文件内容，并将其转换为不同格式:

```js
// Choose one method for each read operation.
const reader = new FileReader()
reader.onload = () => console.log(reader.result)
reader.onerror = () => console.error(reader.error)
reader.readAsDataURL(file)

// Alternatives, using separate readers:
const textReader = new FileReader()
textReader.readAsText(file)
const bufferReader = new FileReader()
bufferReader.readAsArrayBuffer(file)
```

在同一个读取器上不要开始另一个读取，而它的`readyState`是`LOADING`;在这种情况下，[文件 API](https://www.w3.org/TR/FileAPI/)需要一个`InvalidStateError`.对于文本或字节，`await file.text()`和`await file.arrayBuffer()`是替代品。

## 用对象 URL 预览上传的图像

对象 URL 引用文件时未先将其内容编码为 base64 字符串 :

[预览图像](demo://blob-and-file/preview-image.tsx)

**对象URL的优点:**

- 即时预览(不需要编码)
- 内存效率
- 无基数64bloat
- 避免一个大编码字符串。 解码和显示图像仍会消耗资源

## 以基数64预览上传的图像

当您需要实际数据时，(,例如用于上传，存储，或操作):

[预览-基数64](demo://blob-and-file/preview-base64.tsx)

**何时使用读取 AsDataURL:**

- 对需要的API来说需要基础64
- 发送到仅文本存储界面。索引DB本身可以存储 Blob 对象
- 以 JSON 有效载荷发送图像
- 上传前的图像操作

**下方:**

- 慢于对象 URL
- 大型基数64字符串(大于二进制)
- 内存使用率较高

## 旧版示例：在 Webpack 中使用 PDF.js Worker

以下模式适用于历史 PDF.js 2.x 中使用网络包装和原始加载器构建的经典标注工人 4。它不是当前模块-加载器构建的配方。对于当前安装，请遵循[PDF.js 包的示例](https://github.com/mozilla/pdf.js/tree/master/examples)用于您已安装的版本和捆绑器。 根本问题是作为服务资产释放的工人文件路径。 使用网络包装或其他加载器时指示静态文件路径中断的传统方法 :

### 问题

```js
import * as pdfjsLib from 'pdfjs-dist'

// ❌ This breaks after bundling - path becomes incorrect
pdfjsLib.GlobalWorkerOptions.workerSrc = './node_modules/pdfjs-dist/build/pdf.worker.js'
```

**问题:**

- 相对路径在生产捆绑中不起作用
- 工作文件可能无法复制到 dist文件夹
- CDN托管使路径进一步复杂化

### 解决方案: Blob URLs

将工人代码转换为 Blob 并创建对象 URL :

```js
import * as pdfjsLib from 'pdfjs-dist'
// Use raw-loader to import worker code as a string
import pdfjsWorker from 'raw-loader!pdfjs-dist/build/pdf.worker.min.js'

// Create Blob from worker code
const pdfjsWorkerBlob = new Blob([pdfjsWorker], {
  type: 'application/javascript',
})

// Generate object URL
const pdfjsWorkerBlobURL = URL.createObjectURL(pdfjsWorkerBlob)

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerBlobURL
```

在工人可能需要时保持 Blob URL 的存活。在工人被摧毁后撤销它；立即撤销可以阻止工人装载。您的内容安全政策也必须允许您选择的工人来源 。

## 最佳做法

### 1. 总是清理对象 URL

对象 URL 在其预览的存续期内应该保持有效。 返回一个清理功能，以便调用者在预览被替换或删除时可以释放它 :

```js
function showBlobPreview(img, blob) {
  const url = URL.createObjectURL(blob)
  img.src = url
  return () => {
    if (img.src === url) img.removeAttribute('src')
    URL.revokeObjectURL(url)
  }
}

const disposePreview = showBlobPreview(img, blob)
// Call disposePreview() when replacing the preview or unmounting its component.
```

### 2. 验证文件类型

```js
function handleFile(file) {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/gif']

  if (!allowedTypes.includes(file.type)) {
    alert('Please upload PNG, JPEG, or GIF images only')
    return
  }

  // Process file...
}
```

### 3. 检查文件大小

```js
function handleFile(file) {
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (file.size > maxSize) {
    alert('File size must be less than 5MB')
    return
  }

  // Process file...
}
```

### 4. 优雅处理错误

```js
const reader = new FileReader()

reader.onload = (e) => {
  // Success handler
}

reader.onerror = () => {
  console.error('Failed to read file:', reader.error)
  alert('Error reading file. Please try again.')
}

reader.onabort = () => {
  console.log('File reading aborted')
}

reader.readAsDataURL(file)
```

### 5. 使用适当的方法处理案件

```js
// Quick preview - use Object URL
function previewImage(file) {
  return showBlobPreview(img, file) // Caller owns the returned cleanup function.
}

// Upload to API - use FormData (keeps as binary)
function uploadImage(file) {
  const formData = new FormData()
  formData.append('image', file)
  fetch('/upload', { method: 'POST', body: formData })
}

// For a text-only storage interface, encode as base64
function storeImage(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    // Store e.target.result in database
  }
  reader.readAsDataURL(file)
}
```

## 常用案例摘要

**图像上传预览:**使用`URL.createObjectURL()`进行即时高效预览
**文件下载:**创建带有数据的 Blob,生成对象 URL,触发下载
**PDF 工人设置:**Bundle 工人代码为 Blob 以避免路径问题
**API 上传:**使用 FormData 带有文件对象(不需转换)
数据库中的**存储:当二进制存储不可用时，**使用带有 base64 的文件阅读器

# URL 基本内容

## 与 URLSearchParams 合作

**`URL`**接口为解析，构建，以及操纵URL提供了强大的工具。`searchParams`属性提供了查询参数的访问权限:

```js
const url = new URL('https://www.google.com:443/index.html?a=1&b=2#hash')

/**
 *  URL {
 *    href: "https://www.google.com/index.html?a=1&b=2#hash",
 *    protocol: "https:",
 *    username: "",
 *    password: "",
 *    hash: "#hash",
 *    origin: "https://www.google.com", // default HTTPS port is omitted
 *    host: "www.google.com", // a non-default port would be retained
 *    hostname: "www.google.com",           // without port, without protocol
 *    port: "", // 443 is the default for HTTPS
 *    pathname: "/index.html",
 *    search: "?a=1&b=2",
 *    searchParams: URLSearchParams {}
 *  }
 */

// Read query parameters
url.searchParams.get('a') // '1'
url.searchParams.has('b') // true
url.searchParams.getAll('a') // ['1']

// Modify query parameters
url.searchParams.set('c', '3')
url.searchParams.delete('a')
url.searchParams.append('d', '4')

console.log(url.href) // Updated URL with new parameters
```

**使用大小写:**

- 从当前页面 URL 读取查询参数
- 为 API 请求动态构建 URL
- 处理页标、过滤器和搜索参数

# 结论

当您还需要一个文件名和修改元数据时，使用`Blob`来持有二进制数据和`File`。根据接收的 API 所接受的内容选择下一步: 预览对象 URL,文件上传对象`FormData`, 或需要检查内容时的文本和字节 。 仅在目标需要文本表达时转换为 base64 。

在消费者需要时保持每个对象的URL的生命力，然后在删除预览或工人被破坏时取消它。 这使得文件工作流程的焦点集中在手头的操作上，让临时的URL有清晰的寿命 。
