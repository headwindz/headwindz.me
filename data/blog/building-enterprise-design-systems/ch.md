---
title: '构建企业级设计系统：从设计模式到前端架构'
summary: '了解如何跨团队共享设计模式、组件 API、设计令牌、主题和文档，并管理升级。'
---

假设三个产品组需要一个取日期器，然后从同一个库开始。几个月后，一个增加了日期范围，另一个补丁了键盘导航，第三个复制了组件来改变其样式。现在升级意味着检查三个执行并保存每个团队的更改。

设计系统让团队分享其背后的组件和决定:其行为如何，在哪里可以变化，以及谁维护。 Figma 库和 npm 软件包将这些决定带入设计和代码。只有当团队能够扩展其内容，并随着产品的变化而采用其更新，系统才会继续有用。

对前端团队来说，这意味着选择软件包边界，组件 API,一个符号和主题管道，以及交付升级的方法。这篇文章通过这些选择而起作用，它使用来自[Arco Design](https://arco.design/),ByteDance的开源设计系统的例子。

# 为什么共用一个设计系统？

建立类似界面的团队重复设计审查、互动测试、品牌决定以及代码。一个共享系统允许它们重复使用，在产品之间发挥作用并带来改进。

## 花的时间更少，重建熟悉的互动

一个新的报告工作流程需要关于过滤器、权限和空结果的决定。 重用一个取日期器和对话框为这些决定留下更多的时间。即使实验被放弃，团队花费的时间也更少，重建熟悉的控制。

## 让共同的行为可靠

共享对话框可以将键盘焦点保持在模式内，在关闭时返回焦点到触发器上，并一致地回应键盘解职。一个测试的主题让团队有一个颜色对比的共同起点。当应用程序采用固定时，他们的团队不再需要独立诊断和补丁同样的问题。

标准化也有成本。 适合设置页面的组件API在密集的交易界面中可能很尴尬。 系统需要有文件记录的方式来扩展一个组件，因此专用的布局不需要单独执行 。

## 商定名称和默认值

当名称在设计文件和代码中具有相同含义时，设计交接会变得更加容易。 一种Figma属性`size="large"`可以映射到`<Button size="large">`;`color.fill.secondary`可以映射到`--color-fill-secondary`. 映射需要记录和维护。

共享交互规则也帮助用户在产品之间移动。要重新学习日期格式或键盘快捷键，可能比看到稍有不同的蓝色阴影更具有破坏性。决定哪些行为应该保持一致，然后再试图让每个屏幕看起来完全相同 。

## 推出共享更改

一个版本的代号包让团队通过依赖升级来分发品牌更新或暗模更新.每个应用程序仍然需要通过并检查发布:即使组件API保持不变，打字或间距的改变也能打破布局。

版本，视觉检查，以及清晰的支持窗口从一开始就属于计划中。

---

# 系统里有什么？

从棋子组开始，需要反复达成一致。托肯斯和组件获得大部分关注，但文档和工具确定这些棋子是否仍然有用。

## 设计符号

Tokens 给出了可以在工具与平台之间穿行的设计值名称.一个组件不重复`#165DFF`,而是指主动作背景等角色。

一旦系统需要多个主题，三层就有用。每层都会回答一个不同的问题 :

| 层     | 问题              | 示例                        |
| :----- | :---------------- | :-------------------------- |
| Global | 有什么值可用?     | `color.blue.600`            |
| 语义学 | 此值用于什么?     | `color.action.background`   |
| 组件   | 此组件在哪里使用? | `button.primary.background` |

一个组件符号可以引用一个语义符号，而这个符号又引用一个调色板值。修改语义映射可以让一个主题重新使用相同的组件样式。下面的符号管道和主题示例可以显示这些引用是如何到达CSS的。

## UI 组件

一个组件 API应当使其行为具有可预测性: 哪个道具控制状态，如何提供标签，以及错误的出现方式。 文档中如何自定义其外观，而无需依赖内部标记，而在发布之间可能会有变化 。

每个组件背后的工作差异很大。`Badge`大多需要样式和内容规则。`Select`需要键盘处理，焦点管理，以及选择状态。`Table`添加排序，过滤，选择，有时还有虚拟化: 仅在可见区域附近渲染行，这些差异会影响每个组件需要多少测试和持续维护。

## 图标和资产

共享的图标集会给产品带来搜索，下载，警告和成功熟悉的符号。 同意每个图标的含义，因此团队不会对无关的动作使用相同的符号。

一致的绘图区和中风重量也帮助图标舒适地坐在文本和控件旁边。从 SVG 源生成框架组件，使团队可以重新使用。例如，Arco通过`@arco-design/web-react/icon`曝光回声图标，避免复制散落在应用程序中的 SVG 标记。

在 SVG 中使用`currentColor`在图标应该跟随周围的文本或状态颜色时填充和按键。然后它可以继承其按钮的颜色 :

```tsx
<Button icon={<IconSearch />}>Search</Button>
```

这里的`IconSearch`来自Arco的图标包。

文档图标的含义和标签以及外观。 仅使用图标的动作需要一个可访问的名称；文本标签旁的装饰图标不应第二次被宣布。 色彩可以强化状态，但标签或可识别符号也应表达其含义 。

## 跨越组件的图案

窗体可以使用正确的输入，但仍会错误处理。一个错误恢复模式描述页面如何保存输入的值，将每个错误与其字段联系起来，并在失败的提交后移动焦点。它捕捉到任何个人输入都无法对整个窗体做出的决定。

可搜索的表格需要同样的协议。当过滤器改变时，页面必须决定是重新设置页标，清除选定的行，还是禁用一个批次动作。在实例小组中记录这些过渡可以适应；截图显示布局，但未指定行为。

## 文档

API 引用告诉开发者哪些道具存在。 文档还应解释何时使用对话框而不是抽屉，如何标记破坏性动作，以及如何从错误中恢复。 包含布局示例、 键盘预期值，并复制团队可以重复使用的内容 。

文档中的尴尬组合。 在一个模式中下拉需要规则来说明其弹出地点、其叠叠方式和它们之间的焦点移动方式。 单靠`z-index`无法解决所有三个问题 。

## 工具设置

添加工具以删除经常性的手工工作 :

- **设计工具**:使用Figma库和插件在设计文件和Git之间同步符号。
- **交互式文档**:让开发者尝试道具，检查示例代码，测试交互和访问。
- **Lint规则**:旗面硬码颜色和腐烂道具，但有文献记载的除外。
- **迁移脚本**:使用代码mods,如用`jscodeshift`构建的代码，实现支持的API修改的自动化。

---

# 行为与外表分离

控制器的行为和外观变化的原因不同。键盘导航可能需要在每个产品上修补一个错误，而一个新品牌则需要不同的颜色，只需一个。保持这些职责的分离就可以让团队在不复制整个组件的情况下做出任何改变。

标签说明了区别。 它们的功能模式定义了选择、 键盘导航、 焦点移动，以及每个标签与其面板之间的关系，包括辅助技术暴露的内容。他们的感知模式定义了打字、 间隔、 颜色和主动指示器。 品牌刷新可以在保留互动的同时用填充的背景替换下划线 。

在代码中，行为和外观以一个有风格的组件相交，产品将其编成屏幕:

<SketchDiagram
  src="/static/images/building-enterprise-design-systems/component-layers.svg"
  alt="Behavior and appearance combine in a styled component. Product content and business rules combine with that component to form the screen."
  width={760}
  height={660}
/>

行为和外观在共享组件中交汇；任务特定内容和商业规则与产品保持同步。

组件的 API 连接这些层。 样式标签组件会重复使用不同符号的行为；产品会提供标签和面板内容。 产品特定权限检查会留在应用程序或域组件中 。

这种分离帮助审查人员选择相关的检查。新的品牌色彩需要主题和视觉检查，包括对比。键盘的更改需要交互和跨样式变体的无障碍检查。文档应当明确哪些部件产品可以自定义，哪些行为是共享组件拥有的。

层仍然互相影响。 压缩选择可以重复相同的选择行为，但缩短间隔会改变用户可以点击或点击的区域，文本的截断方式，以及可见选项的数量 。 测试完成的组合及其各个部分 。

---

# 选择软件包边界

对于一个新系统，我首先要从符号、样式组件、文档和一个消耗性应用程序开始。这个应用程序在团队添加更多软件包之前，先用真实的工作流程来测试架构。

单列波将相关软件包保存在一个寄存器中；pnpm 工作空间管理其依赖性。下面的结构显示图标、原始和迁移工具可以随着系统的增长而生活在哪里。在构建缓存和任务调度时添加 Turborepo 将节省足够的工作来证明它的合理性 :

```
design-system/
├── packages/
│   ├── tokens/            # Raw JSON tokens + Style Dictionary transforms
│   ├── icons/             # Raw SVG assets + icon generation build pipeline
│   ├── primitives/        # Headless, unstyled accessible UI components
│   ├── react/             # Styled React components (@my-ds/react)
│   ├── eslint-plugin/     # Linter rules to enforce system adoption
│   └── codemods/          # Automated AST upgrade scripts
├── apps/
│   ├── docs/              # Next.js / Contentlayer documentation website
│   └── storybook/         # Component isolation & visual regression sandbox
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## 保持框架依赖性明确

一个单独的`tokens`包可以服务iOS,Android,电子邮件模板，以及网络应用程序而不在React中拉动。

`primitives`软件包有不同的边界。它将行为和样式区分开来，但无头反应组件仍然依赖于 React 。 Token 数据和状态过渡逻辑可能可以跨框架共享；渲染、事件、 refs 和生命周期集成仍然需要特定框架的执行 。

## 选择原始人

无头原始人提供交互行为，同时将视觉造型留给消耗性应用程序。在建立控制前，请检查现有原始人能够覆盖多少行为。降级通常比执行键盘和焦点行为需要更少的工作。

- **重叠和复杂控制**:当原始人的行为符合您的要求时优先使用他们.[Radix Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction)提供反应组件有交互行为;[Floating UI](https://floating-ui.com/docs/getting-started)提供定位功能，并在其反应包中提供交互钩。 定位单是不能执行一个可访问的对话框或组合框。
- **简单控制和布局**: 偏好本地元素用于按钮和输入，添加令牌和焦点 API. 只有当本地控制无法满足要求时，才会构建自定义行为。

### 决定什么是拥有

| 方法                 | 适配性好                   | 持续责任                                 |
| :------------------- | :------------------------- | :--------------------------------------- | ---- |
| 现有风格库加品牌层   | 大部分工作流程符合已建立库 | 主题集成，升级，以及产品级的可访问性     |
| 无头库外加自定义风格 | 品牌和组成需要更大的灵活性 | Styling,API适配器，以及集成测试          |
| 自定义原始s          | 文档要求无法通过组成       | 行为，辅助技术测试，浏览器支持，以及维护 | 满足 |

测试这些选项时要对照一个真正的产品工作流程，并记录其不足之处。在构建定制原始产品之前，请确定它们必须满足的要求、其所有人和维护预算。

---

# 设计组件 API

API 定义了谁拥有状态，消费者可以安排哪些部件，以及组件如何变化。 保持这些选择在控件之间的一致性，这样团队就可以在不为每个组件学习新合同的情况下预测行为。

## 受管制和不受管制的状况

在控制模式中，一个表单控制读取了父的`value`prop,并通过`onChange`报告用户的更改.在无控制模式中，它将数值存储在内部，从`defaultValue`初始化 :

<SketchDiagram
  src="/static/images/building-enterprise-design-systems/state-ownership.svg"
  alt="A user change calls onChange in controlled mode; the parent decides whether to provide a new value. In uncontrolled mode the component updates internal state, initialized from defaultValue. Both can report changes."
  width={760}
  height={740}
/>

在控制模式中，由母体决定是否更新值。在控制模式中，组件会存储新值本身。

两种模式都可以通过`onChange`报告变化，但只有控制模式要求母公司在可见选择变化前提供新的`value`. 初始化后更新`defaultValue`不会重置不受控制的控制。

```tsx
<Select value={department} onChange={setDepartment} />
<Select defaultValue="infra" />
```

这些是替代的用法。 将所选模式稳定在组件的寿命，并分别定义重置行为。 共享的钩子可以执行合同；Arco的[`useMergeValue`](https://github.com/arco-design/arco-design/blob/main/components/_util/hooks/useMergeValue.ts)是需要研究的一个执行 。

## 组成窗体字段

组成意味着从消费者可以安排的部件中构建更大的组件.例如，Arco的`Form.Item`在输入旁保留一个字段的标签和配置，而不要求表格接受每个可能的字段布局的道具:

```tsx
<Form form={form}>
  <Form.Item field="username" label="Username">
    <Input />
  </Form.Item>
</Form>
```

## 何时添加道具或特性

对新道具的请求通常从一个屏幕开始。决定它是否代表可重复使用的能力或产品特定安排。每个道具都会在文档、测试和升级时添加组合。

使用更改类型选择扩展点 :

- 诸如紧凑密度等视觉选择，在产品之间含义一致时，属于一个命名的变体或符号。
- 可重复使用的行为，如可明确的选择，可以证明一个道具具有定义的状态和事件合同。
- 一个自定义的页眉、页脚或动作区域通常适合一个插槽——消费者提供内容的地方——或者一个比重新排列内部的几个布林更好的儿童部分。
- 业务规则，如谁可以核准发票，属于由共同控制构成的产品组成部分。

例如，`showExportButton`、`showOwnerFilter`和`showApprovalAction`将会将共享的`Table`转换成特定产品的工具栏。 保留表格的焦点是数据演示和选择，并编写旁边的工具栏。当需要访问表格的行状态时，选择特性属于表格 API 。

询问具体使用示例并尝试用现有部件表达。 独立请求会加强共享特性的大小写；访问界面的修复不应该等待第二次请求。在接受特性之前，请先确定它的所有者、 有效组合和失败状态。如果这些组合难以解释，请考虑单独组件或更小的可复合部分 。

---

# 构建符号和主题

选择一个权威的符号源并生成下游格式。一个小的只网络系统可以从 CSS 变量开始。当多个工具或平台需要相同的值时，符号构建会使转换明确:

<SketchDiagram
  src="/static/images/building-enterprise-design-systems/token-build.svg"
  alt="Versioned tokens are validated and aliases resolved before Style Dictionary transforms generate CSS variables, JavaScript values and TypeScript declarations, and platform-specific outputs when needed."
  width={760}
  height={760}
/>

同样的同义源可以产生若干产出；每个平台都得到它所需要的格式。

## 生成平台产出

对于跨工具交换，[DTCG 2025.10格式的](https://www.designtokens.org/tr/2025.10/format/)定义了符号类型和值，它是一个社区组规格，而不是W3C标准.一个维度符号足以说明形状:

```json
{
  "space": {
    "$type": "dimension",
    "$value": { "value": 16, "unit": "px" }
  }
}
```

CSS变换可以将这个符号转换成`--space: 16px`.一个别名是对另一个符号的引用，所以解析别名需要完整的符号集。 构建时可以保存这些链接，作为CSS可变引用。

使用样式词典 v5, 即时化`new StyleDictionary(config)`并等待`buildAllPlatforms()`,如[API 参考](https://styledictionary.com/reference/api/)描述的那样。 配置时仅需要输出:`css/variables`用于网络样式，当代码需要值时，JavaScript + 附带声明格式.请检查[格式参考](https://styledictionary.com/reference/hooks/formats/predefined/)用于输出，[v5 迁移指南](https://styledictionary.com/versions/v5/migration/)用于更新已有的管道时。

## 决定如何应用主题

用于品牌、 颜色模式或密度设置的主题组值。决定应用程序构建的哪些选择是固定的，以及哪些用户可以在页面打开时更改。 编译的样式为固定值工作；CSS自定义属性允许组件通过正常的 CSS 继承来获取运行时的更改 。

Arco 演示了这种组合: Less 生成样式表，而组件也引用变量如`--color-primary-6`。它的深模度选择器可以用`document.body.setAttribute('arco-theme', 'dark')`激活 。 DesignLab 添加了分布工作流程:在编辑器中配置主题值，发布一个版本的主题包，并在消耗应用程序中导入它。这给团队提供了一个版本化的文物来通过和检查，就像它们会释放组件一样 。

记录所支持的组合，如光和暗模式的品牌。当主题重叠时，定义哪个值优先，因此，产品团队可以在采用该组合之前，告诉更新会有什么变化 。

## 通过范围化主题跟随符号

调色板提供了原始值，语义层为每个主题选择一个值，组件会消耗这个角色。这里是主按钮的路径 :

<SketchDiagram
  src="/static/images/building-enterprise-design-systems/theme-alias.svg"
  alt="The palette offers blue 600 and blue 300. Light and dark themes map action background to different palette values. The button background aliases action background, so the button CSS rule stays the same."
  width={760}
  height={665}
/>

光和暗的主题改变语义映射，而按钮则保持相同的CSS规则。

相应的 CSS可以保持小块。 调色板定义在此被省略，因此主题边界可见 :

```css
[data-theme='light'] {
  --action-bg: var(--blue-600);
}
[data-theme='dark'] {
  --action-bg: var(--blue-300);
}
[data-theme] {
  --button-bg: var(--action-bg);
}
.button-primary {
  background: var(--button-bg);
}
```

在每个主题边界上宣告组件别名。如果`--button-bg`只在祖先上宣告，它会在那里解决`--action-bg`。在嵌套主题中更改`--action-bg`将不会更新继承的别名 。

## 保留预定主题内的覆盖

反应门户使内容在文档元素树中的不同位置，或DOM. CSS继承遵循该树，而不是反应组件等级。因此，从暗面板打开的对话框如果其门户在光页体下产生，就可以继承光彩:

<SketchDiagram
  src="/static/images/building-enterprise-design-systems/portal-inheritance.svg"
  alt="A light page contains a dark panel. A dialog portal hosted inside that panel inherits dark tokens. The same dialog hosted directly under the page body inherits light tokens instead."
  width={760}
  height={790}
/>

两个分支显示同一对话框的替代 DOM 位置。它提供的位置决定它继承的主题 。

在主题区域内选择主机，或者在`document.body`下对主机应用相同的主题选择器和符号覆盖.[Radix Dialog的门户容器](https://www.radix-ui.com/primitives/docs/components/dialog)是一个用于选择DOM位置的API.

面板内部的主机继承其主题，但祖先的剪辑或CSS的变换可能会限制覆盖。 身体下的主机会避开这些祖先.在选择主机时检查覆盖位置和主题继承。

请检查access-date=中的日期值 (帮助) 主题提供者实际改变什么。 Arco's React[`ConfigProvider`主题执行](https://github.com/arco-design/arco-design/blob/main/components/ConfigProvider/index.tsx)将颜色写到`document.body`,因此这些提供者的巢穴不会孤立他们的CSS主题。

---

# 发布和测试软件包

从导入该软件的应用程序中测试已发布的软件包。请检查是否导入一个组件在每一个样式表中拉动，React 是否被捆绑到库中，以及该构建是否保存`'use client'`等客户端指令 。

## 界定公共切入点

优先使用 ECMAScript 模块(MEME)用于现代应用。当受支持的消费者需要时，添加 CommonJS 、 旧的 Node.js 模块格式，并匹配每种格式的 TypeScript 声明 。 定义包的切入点和依赖性预期 :

| 包件设置           | 目的                                                  |
| :----------------- | :---------------------------------------------------- |
| `exports`          | 展出 JavaScript 条目，其声明，以及一个公开的 CSS 条目 |
| `peerDependencies` | 声明反应版本消费者必须提供                            |
| `sideEffects`      | 保存样式导入和任何具有初始化效果的 JavaScript         |
| 构建外部           | Keep React 及其子路径导入出库捆绑的                   |

例如，消费者应该能够通过稳定的公共路径导入组件及其样式表:

```tsx
import { Button } from '@my-ds/react'
import '@my-ds/react/css'
```

## 检查已建输出

- 在`sideEffects`中保存 CSS 和 Less 导入。 审计 JavaScript 模块，然后宣布它们没有副作用；注册代码需要明确处理。
- 宣告反应为对等依赖，并配置构建工具，将`react`,`react-dom`及其子路径导入外部化。 单是对等声明并不妨碍捆绑 。
- 检查小型消费建筑:所命名的无害环境管理进口不能保证CSS被分成每个组件。

## 服务器渲染和主题初始化

将服务器渲染视为消费要求.[Radix支持服务器渲染](https://www.radix-ui.com/primitives/docs/guides/server-side-rendering),但交互组件仍然需要客户端边事件处理.在[Next.js App Router](https://nextjs.org/docs/app/getting-started/server-and-client-components)中，将客户端边界绕在交互切入点周围，而不是使整个库成为客户端模块.确保构建保存这些指令。

在服务器渲染过程中避免读取`window`,`document`, 或`localStorage`。在服务器访问偏好时从 cookie 中切换一个明确的主题；否则在涂料前使用框架支持的主题初始化策略。对于系统偏好，CSS`prefers-color-scheme`可以提供初始外观。 保持初始客户端的渲染与服务器标记一致，并测试硬重装主题闪光和水分错误 。

发布一个服务器和Sorybook并列的消费者实例。 包含一个交互式控制、 主题门户，以及一个持续的主题偏好，这样的软件包和水合还原在发布前会表面 。

## 测试共享行为

在孤立和消耗性应用中测试包。 组件测试捕获状态和相互作用错误；消费者测试暴露了孤立故事可能错过的包装、主题继承和水合问题。

使用单位和交互测试，例如Vitest with React Testing Library, 用于用户事件、 受控和不受控制的状态以及键盘行为。对于一个标签选择，瞄准触发器，按 Enter, 并检查列表框是否打开。 测试选择和焦点恢复单独进行，从而发现失败的行为 。

在组件测试和真实浏览器中运行带有轴的自动无障碍检查.[轴-核心文档](https://github.com/dequelabs/axe-core)指出，色彩孔径检查在JSDOM下不起作用，模拟的DOM常用于单位测试中。 包含对完整工作流程的手动键盘和屏幕阅读器检查；自动扫描无法自行建立符合性。

视觉回归测试可以比较截图以检测意外变化。 Playwright 和 Storybook可以覆盖悬浮，焦点，禁用，以及每个拉请求的暗模。 检查差异: 截图比较检测到变化的像素，但无法决定变化是否合适 。

---

# 保持系统可用性

软件包的设计可以很好，但仍然失去采用。 缺少的变体、未解的问题或昂贵的升级使得产品团队有理由在当地复制一个组件。一旦复制开始改变，下一个系统就不再固定到它。

## 所有权和收养

将每个稳定的组件指定为工程所有人和设计所有人。公布其成熟度、支持环境、无障碍预期和支持窗口。 产品团队需要一条有审查期限的贡献路径；否则本地叉成为最快的装运方式。

跟踪应用程序使用支持的版本以及升级需要多长时间。 本地覆盖和反复出现的可访问性缺陷揭示了共享系统尚未解决的问题。 通用任务的可用性测试增加了另一种观点: 广泛采用的组件仍然难以使用 。

使用该证据来确定修复的优先顺序。在决定是否维护、替换或退役之前，审查没有明确的拥有者或积极使用的案例 。

## 防止构成部分差异

在增加针对当地替代品的规则之前，请作出修改:

- **Linting guardrails**: 写入自定义 ESLint 规则，以警告开发者使用内置颜色(`color: '#165DFF'`)而非设计令牌时，除图表，第三方集成和系统内部外，当共享组件不符合任务时，保留本地HTML.
- **贡献建议**:为产品团队提供请求组件或变体的有文件记录的过程.如果多个产品需要时间，核心团队可以比较其要求，并决定分享哪些行为。

## 打破变化和自动迁移

需要编辑数十份文件的升级与产品工作竞争。在删除 API 之前给团队一个迁移路径 :

1. 在 TypeScript docstrings 中用`@deprecated`标记旧API 并发布其支持窗口。
2. 记录替换并尽可能提供兼容性。
3. 自动支持使用代码mod的修改，使用`jscodeshift`等工具。 需要人工审查的文档大小写。

例如，假设一个库将按钮的危险样式从`type`移动到`status`:

```tsx
// Before
<Button type="danger">Delete</Button>
// After
<Button status="danger">Delete</Button>
```

一个代码mod自动重写源代码。要安全地进行此更改，它必须检查`Button`是从哪里导入的，以及本地变量是否隐藏了这个名称。 仅匹配 JSX 名称就可以更改一个不相关的组件 :

<SketchDiagram
  src="/static/images/building-enterprise-design-systems/safe-codemod.svg"
  alt='Resolve the Button import binding, including aliases and local shadowing. Leave unrelated components unchanged. Rename a literal type="danger" only when no spreads or conflicting props exist; report other cases for manual review. Review the diff and run consumer checks.'
  width={760}
  height={940}
/>

导入的别名应该仍然匹配；本地变量应该不匹配。 跳过布尔属性、 表达值、不支持的命名空间导入、 扩展和现有的`status`道具，除非变换明确处理它们。 使用定着器处理每个例，并验证两次运行迁移不会产生进一步的更改 。

在一个应用程序中进行迁移试点，审查diff,并在向更多团队推出之前比较受影响的屏幕。

---

# 我从哪里开始

选择两个产品组已经共享的一个工作流程，例如可搜索的表格，并带有编辑表。 以拟议符号和组件构建该工作流程。 更改其主题，检查键盘行为，并升级其软件包版本。请记录团队需要本地覆盖或更清晰文档的地方 。

使用这些困难来选择下一个共享的作品。每个抽象应该解决一个问题，团队可以描述，并且拥有一个所有者，当他们的要求发生变化时，能够响应。
