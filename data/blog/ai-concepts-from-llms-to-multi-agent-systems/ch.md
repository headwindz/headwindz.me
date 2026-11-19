---
title: '读懂现代 AI 的核心概念'
summary: '梳理 LLM、工作流、Agent、工具、MCP、Skills、插件、编排器、Hooks、护栏与 Harness 的架构关系。'
---

模型、工具、技能和 Harness 各有分工。设计系统时，需要明确由谁选择下一步行动、由什么软件执行，以及在哪里检查结果。

本文梳理这些职责，以及上下文如何在各个组件之间流转。不同实现对组件边界的划分也有所不同。想看完整的执行示例，可以阅读 [AI Agent 与 Harness](/zh/blog/ai-agents-and-harnesses-from-tool-loops-to-reliable-systems)。

# 核心构件

## 1. 大型语言模型(LLMS)

### 什么是LLM? ! ! ? ! ! ! ! ! ! ! ! !

**大语言模型(LLM)**预测从提供的上下文中从符号上进行分布。 生成时会根据解码策略从该分布中选择符号。它并不总是选择最可能的对象 :

$$P(w_t \mid w_1, w_2, \dots, w_{t-1})$$

从结构上讲，现代前沿LLMS是密集或混合的专家(MoE)变压器解码器，它们具有强大的语义理解，图案完成，代码生成，以及跨越自然语言和结构格式的逻辑推理能力。

关键是LLM是**被动，无国籍，并计算为**:

- **Passive**: LLM 只在引用时执行。它不会启动动作，维持背景进程，或者醒来 。
- **无国籍**:该模型在 API 请求之间没有内存。 下一个推论需要由周围应用程序提供的相关上下文 。 API 可能保留对话状态或缓存输入，但这些都是服务/运行时间特性，而不是模型加权中持久的内存 。
- **计算定界**:一个模型在推论中进行计算，但不会独立执行应用程序代码或检索外部状态.主机必须提供工具并返回他们的观测结果。

```typescript
// Minimal LLM invocation: pure text in, text out
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

const { text } = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Summarize the differences between optimistic and pessimistic locking in SQL databases.',
})
```

### 何时使用原始 LLMS

当任务自成一体，无国籍，严格限定语言变换时，使用原始 LLM :

- 文本归纳、情绪分析和样式转移
- 从非结构化输入中提取实体到结构化的JSON计划
- 跨人类语言或密码方言的翻译
- 单回合推理或提问回答静态，提供文本

---

## 2. 工作流量

### 什么是工作流程？

**工作流程**遵循应用程序定义的控制流程，如管道或状态机器。其步骤可以调用模型，在结果上分支，也可以重试。路径受到代码的限制，输出和延迟都不一定是决定性的。

| 尺寸             | 工作流                     | 自主剂             |
| :--------------- | :------------------------- | :----------------- | -------- |
| **控制流**       | 应用程序定义的图形/状态机  | 模型驱动的ReAct 环 |
| **定義**         | 定義控制路徑；输出可能改变 | 低(变数路徑各运行) |
| **空档期& 成本** | 可预知                     | 可变(如果卡住)     | 可以螺旋 |
| **灵活性**       | 刚性，处理预期路径         | 紧急，解决新路径   |
| **失败模式**     | 步态错误或模型输出不正确   | 模型幻觉/无限循环  |

<SketchDiagram
  src="/static/images/ai-concepts/document-workflow.svg"
  alt="对原始文档进行 OCR 和切分，再由 LLM 提取信息。通过模式校验的记录写入数据库，其余进入人工审核队列。"
  width={800}
  height={565}
/>

### 何时使用工作流程

使用工作流程处理大量、对特派团至关重要的业务流程，并严格要求遵守:

- 发票处理和KYC文件核查管道
- ETL 管道将非结构文本转换成表格数据库
- CI/CD 建造和自动部署管道
- 可审计性要求执行顺序变化不一的规范程序

---

## 3. 工具

### 什么是工具？工具是什么？工具是什么？What are the violence?

**工具**通过该模型可以请求的界面曝光能力，通常是一个名称，描述，和输入的策略.一个工具可以执行定数算术，查询变化的外部状态，或者调用另一个模型.它的界面不能使其输出定数。

LLM 无法直接调用函数。它生成一个结构化的文本有效载荷，表明它打算与解析参数一起引用函数。主机运行时间验证参数，执行实际代码，并将输出返回模型 。

```json
{
  "type": "function",
  "function": {
    "name": "query_database",
    "description": "Execute a read-only SQL query against the read-replica analytics cluster.",
    "parameters": {
      "type": "object",
      "properties": {
        "sql": {
          "type": "string",
          "description": "The SELECT SQL query to execute."
        }
      },
      "required": ["sql"]
    }
  }
}
```

### 工具解锁的能力

- **实时信息检索**:访问直播网络数据，私人数据库，或内部API.
- **Deterministic 计算**: 代表数学，密码散列，或排序到本地运行时间，而不是依赖符号近似。
- **状态变异**:写文件，部署云基础设施，发布GitHub拉请求，或发送交易提示。

```typescript
// Concrete tool declaration using Vercel AI SDK
import { tool } from 'ai'
import { z } from 'zod'

export const weatherTool = tool({
  description: 'Get current temperature and forecast for a geographic location.',
  parameters: z.object({
    city: z.string().describe('City name, e.g., San Francisco'),
    units: z.enum(['celsius', 'fahrenheit']).default('celsius'),
  }),
  execute: async ({ city, units }) => {
    const res = await fetch(`https://api.weather.internal/v1?city=${city}&units=${units}`)
    return res.json()
  },
})
```

### 何时使用工具

当代理或LLM要求时，会曝光工具:

- 在模型的知识断断后变化的动态数据
- 无法容忍幻觉的精确算术或域逻辑
- 阅读/写入外部软件生态系统的接入

---

## 4. 上下文工程

**上下文工程（context engineering）**决定应用在每次调用模型时提供哪些信息。Agent 执行任务时，指令、对话历史、工具结果和检索到的文档都要占用有限的上下文窗口。

### 管理上下文的四种策略

| 策略             | 做法                                                    | 示例                                                     |
| ---------------- | ------------------------------------------------------- | -------------------------------------------------------- |
| 写入（Write）    | 把有用的状态保存到当前上下文窗口之外。                  | 将任务计划和已核实的发现保存到检查点。                   |
| 选择（Select）   | 在下一步执行前载入所需信息。                            | 检索现行报销条款，并提供核查条款所需的工具。             |
| 压缩（Compress） | 用更少的 token 表达已有上下文，同时保留任务所需的细节。 | 概括已完成的查询，保留来源链接、具体限额和待解决的问题。 |
| 隔离（Isolate）  | 让子任务在独立的上下文中运行，再交回结果。              | 让子 Agent 比对政策版本，再返回生效日期及来源。          |

[LangChain 的上下文工程分类](https://www.langchain.com/blog/context-engineering-for-agents)

### 短期记忆与长期记忆

记忆管理是上下文工程的一部分。应用需要决定保留哪些信息、保留多久，以及何时把它们提供给模型。

- **短期记忆**管理当前任务或会话的工作状态，包括对话历史、近期的工具调用结果和中间结论。应用可以在上下文窗口之外保留完整记录，每次调用时再提供相关片段或摘要。
- **长期记忆**跨会话持久保存有用的信息，例如用户偏好和过往项目摘要。应用可以在新会话中按需取回相关记录，让回答更符合用户偏好，并延续之前的工作。

例如，助手可以用短期记忆记录已经核对过的政策文件。到了另一次会话，它可以从长期记忆中取回用户的偏好，在政策摘要中注明生效日期并附上来源链接。

### 检索增强生成（RAG）

**检索增强生成（Retrieval-augmented generation，RAG）**先从外部资料库查找相关信息，再把这些信息提供给模型作为回答依据。常见的向量检索流程分三步。[RAG 原始论文](https://arxiv.org/abs/2005.11401)

1. **切分文档。** 将长文档拆成可单独检索的片段（chunk），尽量把相关内容放在同一个片段里，并为每个片段保存来源链接、章节标题等元数据。
2. **生成嵌入并建立索引。** 嵌入模型把每个片段转换为数值向量（embedding）。系统可以借助向量索引查找与查询向量相近的片段，包括措辞不同但意思相关的内容。[Dense Passage Retrieval 论文](https://arxiv.org/abs/2004.04906)
3. **检索并生成。** 将问题转换为向量，找出候选片段，再把选中的原文和来源信息提供给模型生成回答。

例如，问「公司会付酒店的钱吗？」时，系统可能找到标题为「住宿费用报销」的条款。切分的位置会影响回答：如果例外情况落在下一个片段，只取回第一个片段就可能漏掉限制条件。RAG 是实现「选择」策略的一种方式，既可以从文档库检索，也可以从长期记忆中检索。

## 5. 自主代理

### 什么是探员？

**代理**是一个自主系统，将一个LLM包在一个迭代执行循环中，可以访问外部工具和内存来实现一个高层次的目标。

$$\text{Agent} = \text{LLM} + \text{Tools} + \text{Memory} + \text{Execution Loop}$$

当一个原始的LLM回答一个问题时，一个代理追求一个目标。 用户提供目标状态的(,例如`Fix the failing unit tests in the authentication service`),以及代理对问题的自主原因，选择动作，检查中间结果，以及自我纠正直到目标实现。

### 代理人的核心特征

1. **自主**:在每微步不需要人指导的情况下独立操作，它决定了飞行上的操作顺序和计数。
2. **基于目标**:由明确的目标驱动.它不盲目执行硬码程序脚本，而是评价每个步骤是否使其更接近目标状态。
3. **适应性**:从失败中动态恢复。当一个工具调用返回一个错误时，缺少一个文件，或者一个假说被反驳，代理检查反馈，更改其计划，并尝试一个替代路径 。

### Agent 执行循环

每轮迭代开始时，运行时汇集当前任务的上下文并调用模型。模型可以请求调用工具，也可以返回结果。运行时执行工具后，会记录返回值或错误，供模型下一轮使用。任务满足完成条件或达到执行上限时，运行时结束循环。

### ReAct 模式:思考，计划，行动，观察

**ReAct** 将推理、行动和观察交替进行。每次观察到的结果都可能改变下一步行动。下图中的 “Plan” 指为当前这一轮选择下一步行动。[ReAct 论文](https://arxiv.org/abs/2210.03629)

<SketchDiagram
  src="/static/images/ai-concepts/react-loop.svg"
  alt="Agent 依次推理、选择下一步行动、执行并观察结果。目标未达成时继续循环，完成后返回答复。"
  width={800}
  height={790}
/>

1. **Think（推理）**。模型结合任务目标、对话历史和工具结果判断当前进展。
2. **Plan（选择行动）**。模型选择下一步要调用的工具，并生成参数。
3. **Act（执行）**。宿主运行时执行工具调用，例如查询数据库或调用 API。
4. **Observe（观察）**。运行时将工具结果加入上下文，供下一轮推理使用。

```typescript
// Conceptual implementation of an autonomous ReAct agent loop
interface Tool {
  name: string
  description: string
  execute: (args: Record<string, unknown>) => Promise<string>
}

async function runAgent(goal: string, tools: Tool[], maxIterations = 10) {
  const messages: Array<{ role: string; content: string }> = [
    {
      role: 'system',
      content: 'You are an autonomous agent. Reason, plan, and call tools to reach the goal.',
    },
    { role: 'user', content: goal },
  ]

  for (let i = 0; i < maxIterations; i++) {
    // 1. Think & Plan: Call LLM with tool schemas
    const response = await callLLMWithTools(messages, tools)

    if (response.isComplete) {
      return response.finalAnswer
    }

    // 2. Act: Execute selected tool
    const { toolName, args } = response.selectedToolCall
    const tool = tools.find((t) => t.name === toolName)
    if (!tool) throw new Error(`Tool ${toolName} not found`)

    // 3. Observe: Capture environmental feedback
    const observation = await tool.execute(args)

    // Feed back into loop
    messages.push({ role: 'assistant', content: `Tool call: ${toolName}(${JSON.stringify(args)})` })
    messages.push({ role: 'tool', content: observation })
  }

  throw new Error('Agent exceeded maximum reasoning iterations')
}
```

### 先规划再执行（Plan-and-execute）

**先规划再执行**由规划器先列出多个步骤，再由执行器逐步完成，并按需将结果传给后续步骤。如果某一步失败，或新证据改变了后续行动，系统可以重新规划剩余步骤。单个步骤也可以使用 ReAct 循环。[Plan-and-execute agents](https://www.langchain.com/blog/planning-agents)

例如，Agent 要总结团队的差旅政策，可以先规划三个步骤：找到现行政策、核对生效日期、提取报销规则。如果找到的是归档版本，就先调整计划，找到替代文件后再写摘要。

### 何时使用代理

当解析路径无法在编译时静态预测时使用代理 :

- 交互故障排除、调试代码和修复错误
- 探索性数据分析和多步骤竞争性研究
- 诊断步骤取决于遥测的自动事故补救
- 操作复杂的开发者环境(,例如执行 shell 命令，运行测试套件，写入补丁)

---

## 6. 模型上下文协议（MCP）

### 什么是 MCP？

**模型上下文协议（Model Context Protocol，MCP）**是一项开放标准，为 AI 应用接入外部工具和数据源提供统一接口。宿主应用通过 MCP 客户端连接服务端，双方使用 JSON-RPC 2.0 交换消息。

<SketchDiagram
  src="/static/images/ai-concepts/mcp-architecture.svg"
  alt="Claude Desktop、Cursor IDE 和自定义 Agent 运行时通过基于 JSON-RPC 的 MCP 连接 PostgreSQL、GitHub 和本地文件系统服务端。"
  width={800}
  height={475}
/>

### 为什么有了函数调用还需要 MCP？

函数调用（function calling）让模型用函数名和结构化参数请求执行操作。应用仍需提供工具的参数定义、连接实际执行操作的服务，并把结果交回模型。如果 IDE 和桌面助手各自接入同一个工单系统，两个团队就要分别维护对接代码。

有了 MCP，两个宿主可以连接同一个兼容的工单系统服务端。各自的 MCP 客户端通过 `tools/list` 发现工具，再通过 `tools/call` 执行调用。宿主仍可通过各自模型的函数调用接口提供工具定义、接收调用请求。当多个宿主需要复用同一套集成时，统一协议尤其有价值。[MCP 架构与工具发现](https://modelcontextprotocol.io/docs/learn/architecture)

### MCP与工具的关系: MCP作为标准化工具收集

一个常见的混淆点是**工具**和**MCP**的区别。

一个 MCP 服务器可以通过谈判达成的协议来曝光工具、资源并提示。一个单独的进程是常见的，但进程定位是一个执行选择:

- **Tool(原子单位)**:一个具有JSON Schema(的单函数，例如`git_commit`或`read_file`).一个工具本身只是一个嵌入应用程序代码的孤立函数签名。
- **MCP(收集与协议)**: 架构边界和包装标准。 MCP服务器包装了一整套相关工具(例如，一个GitHub MCP服务器曝光`create_issue`,`merge_pr`,`fetch_diff`,`list_commits`),并使用标准的JSON-RPC合同在`stdio`或流式HTTP(或遗留的HTTP/SSE运输)上服务。

```
┌────────────────────────────────────────────────────────┐
│ MCP Server: github-mcp-server                          │
│                                                        │
│  ├── Tools (Collection of callable operations)         │
│  │    ├── create_issue(title, body)                    │
│  │    ├── get_pull_request_diff(pr_number)             │
│  │    └── merge_branch(head, base)                     │
│  │                                                     │
│  ├── Resources (Read-only data endpoints)              │
│  │    ├── repo://tree/main/src                         │
│  │    └── repo://logs/ci-build-latest                  │
│  │                                                     │
│  └── Prompts (Predefined workflows & templates)        │
│       └── review_pr_template(pr_id)                    │
└────────────────────────────────────────────────────────┘
```

一个代理商与其应用程序代码库内开发硬编码50bespok工具计划，而是在启动时连接到一个MCP服务器，通过`tools/list`动态列出可用的工具，并通过`tools/call`引用。

### MCP的核心原始物

MCP从服务器向客户端暴露三种基本能力:

1. **工具**: 模型请求的可执行能力，由主机执行授权和同意，这不需要每次引用时需要新的批准提示 。
2. **资源**:只读背景数据，类似于REST`GET`端点或虚拟文件系统(,例如文件内容，服务器日志，数据库表).
3. **提示**:由工具提供者为通用工作流程编写预配置的快速模板。

```typescript
// Example: Creating a lightweight MCP Server exposing a collection of SQLite tools
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'

const server = new Server(
  { name: 'sqlite-mcp-server', version: '1.0.0' },
  { capabilities: { tools: {}, resources: {} } }
)

// Expose a collection of tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'execute_sql',
      description: 'Run SQL query on local SQLite database',
      inputSchema: {
        type: 'object',
        properties: { query: { type: 'string' } },
        required: ['query'],
      },
    },
    {
      name: 'list_tables',
      description: 'List all existing database tables and schema definitions',
      inputSchema: { type: 'object', properties: {} },
    },
  ],
}))

const transport = new StdioServerTransport()
await server.connect(transport)
```

### 何时使用 MCP

- 展示企业数据和工具套件，一旦这样，一个组织内所有符合要求的AI工具都可以使用。
- 从第三方 API 集成代码中解钩代理应用逻辑
- 运行本地安全的数据连接器(,例如，检查本地 git 寄存器或 SQLite 存储)而不将 API 令牌传递给外部 SaaS 供应商

---

## 7. 技能

### 什么是技能吗？

**技能**是程序知识，域公约，专业指令的可重复使用的包件单位，它教给一个代理*如何*有效完成特定类别的任务。

虽然一个原始工具回答*"我能执行什么?"*(,例如`git_commit`,`run_command`),一个技能答案*"我该如何行为才能达到这个标准?"*(,例如如何写一个符合约定的提交信息，哪个架构边界要尊重，或者哪个边界情况来验证).

技能一般被定义为Markdown或声明性配置文件(,如克劳德或Codex中的`SKILL.md`,或Microsoft Semantic Kernel)中的语义技能，包含:

- 域快速指令和推理步骤
- 执行前验证核对表
- 必要和违禁的工具
- 预期产出计划和格式化规则

### 逐步披露:精简背景

对技能有用的加载策略是**渐进披露**:先装入描述，然后在相关时装入指令和引用。 具体的加载行为取决于主机。

在大型代码库或企业环境中，一个代理可能可获得50+专业技能(,例如安全审计，数据库迁移，反应性能剖析，Kubernetes部署).如果一个代理将每个技能的完整文本在1转时即刻丢弃到系统中，它会在用户提问前消耗大量上下文；大小取决于实际文件.这导致**迅速 bloating**,**上下文耗尽了**,以及严重的**注意 dilution**("在中途丢失").

渐进披露通过将技能加载到三个渐进层次来解决了这一点:

<SketchDiagram
  src="/static/images/ai-concepts/skill-disclosure.svg"
  alt="Agent 根据技能目录中的简短说明匹配用户请求。匹配后加载 SKILL.md，执行时按需读取参考资料。"
  width={800}
  height={570}
/>

1. **第一级:目录索引(发现元数据)**:
   只有紧凑的运单被注入初始系统提示。每个技能只贡献它的名称、文件路径和1–2句简短的描述，说明何时应该使用(说明性紧凑元数据)。
2. **Tier 2: 点播激活(完整指令)**:
   当代理机收到一个匹配技能描述的(的任务，或者当用户或管弦乐手)明确引用时，主机运行时间读取完整的`SKILL.md`机身，并将其附加到活动上下文窗口中。
3. **第3级:懒惰次资源评价(深度参考)**:
   复杂的技能往往链接到辅助文档、验证脚本或计划。这些都留在磁盘上，只有在特定子任务需要时才会被上下文读取。

```markdown
---
name: 'security-audit-skill'
description: 'Instructions and heuristics for auditing TypeScript codebases for OWASP Top 10 vulnerabilities. Use when reviewing code for security flaws.'
tools: ['read_file', 'rg_search', 'run_linter']
---

# Security Audit Playbook

When auditing code:

1. First, search for dangerous primitives: `eval()`, `dangerouslySetInnerHTML`, and raw SQL queries.
2. Verify all user inputs pass through a schema validator (Zod / TypeBox) before reaching database layers.
3. Check authentication headers and token expiration handling.
4. Categorize all findings by CVSS severity score (Critical, High, Medium, Low).
```

### 何时使用技能

利用技能使组织游戏本制度化，并保持各项目代理行为的一致性:

- 编码代码审查标准或文件模板
- 建立待命分类和事件调查运行簿
- 教学人员专有领域业务规则(,如监管合规检查)

---

## 8. 插件

### 什么是插件吗？

**插件**是一种自成一体的分布和包装机制，将工具，技能，资产和认证配置捆绑在一个单一的可安装单元中。

插件连接带有代理运行时间的软件系统。一个 GitHub 插件可能会包:

- 12个个人API工具(`create_issue`,`merge_pr`,`fetch_diff`等.)
- 2 专业技能(PR审查指南，分支命名公约)
- OAuth 证书或 API 密钥配置

```json
{
  "name": "github-developer-pack",
  "version": "1.2.0",
  "description": "Comprehensive GitHub integration for coding agents",
  "tools": ["./tools/issues.js", "./tools/pull-requests.js"],
  "skills": ["./skills/pr-review.md", "./skills/conflict-resolution.md"],
  "auth": {
    "type": "oauth2",
    "scopes": ["repo", "workflow"]
  }
}
```

### 何时使用插件

当用于在开发者、团队或市场生态系统中分布的包装能力时使用插件:

- 扩展代理IDes(VS 代码，cursor, Codex), 并带有第三方服务
- 允许终端用户切换集成(Slack, Jira, Google Drive)打开和关闭
- 将内部工具捆绑在工程小组之间

---

## 9. 多代理系统

### 什么是多代理系统？

**多代理系统(MAS)**是一个协作架构，由多个专业代理合作，各自贡献独特的技能，工具和域视角，以解决超过单一单体代理的认知能力的复杂问题。

$$\text{Multi-Agent System} = \sum (\text{Specialized Agent}_i) + \text{Communication Protocol}$$

### 主要驱动器:解决上下文爆炸

为什么不干脆建立一个全能的单一代理人呢？

根本的制约是**上下文增长**.不相关材料可以挤出有用的证据。 上下文中毒是另外一项涉及误导或恶意内容的担忧。

当一个代理通过一个长视距任务(工作时，比如在调查一个生产错误跨越多个微服务)时，它积累了数千个响亮的贝壳输出，堆积痕迹，AST堆积，以及探索性思维的代号。 在一个单一的代理中，这造成了四个严重的失败点:

1. **注意稀释("中途丢失")**:变形器注意力在膨胀的上下文中降解。 模型丢失了早期系统指令的跟踪，边缘箱，和安全界限。
2. **工具选择降解**:呈现一个带有50+工具计的LLM同时引起工具幻觉，格式错误的参数，以及无效的选择。
3. **增加输入使用量和耐用性**: 长历史为以后的呼叫添加输入符。在一次以无标记历史为例的运行中，10个呼叫发送了55,000个累积历史符，而20个发送了21万个。 这个数字随着这些假设下的呼叫数而四倍增长，而不是指数化。 实际的计费和耐用性取决于缓存、 上下文选择、 模型和提供者 。
4. **上下文污染**:第3轮产生的错误或推测性假说在第20轮上下文中持续存在，将模型偏差为循环推理循环。

**分离剂如何限制上下文生长**:

- **上下文隔离**:每个专业子代理在自己的小，原始上下文窗口内运行，只包含与其狭窄的任务相关的工具，技能和系统提示。
- **背景蒸馏**:当一个子代理完成子任务时，它只返回一个简洁，高层次的总结或最终的文物(,如一个统一的diff或经核实的结论)返回母代理。 母代理可以避免加载详细的中间输出，同时保留引用证据的功能，以供日后检查。

```
Monolithic Agent Context (Bloated & Poisoned):
[System Prompt] + [50 Tools] + [Turn 1 Tool Output (4k tokens)] + [Turn 2 Log Dump (15k tokens)] ... -> 120k tokens

MAS Context Isolation:
Supervisor Context: [Goal] + [Task Decomposition] + [Worker 1 Distilled Summary (200 tokens)] -> 2k tokens
  ├── Worker 1 Context (Isolated): [Filesystem Tools] + [Local Search] -> Complete -> Returns 200 tokens
  └── Worker 2 Context (Isolated): [Testing Tools] + [Run Test Suite] -> Complete -> Returns 150 tokens
```

### MAS的工程权衡

虽然不同的上下文可以减少不相关的材料，但它引入了显著的工程复杂性:

- **协调间接费用**:构建可靠的代理消息格式，序列化计划，以及通信通道。
- **复合耐性**: 序列剂交接引入多个独立的LLM环绕行程，乘以壁点响应时间。
- **分级错误& 漂移**:如果副代理A产生有缺陷的蒸馏摘要，则副代理B接受它为地面真理，并以糟糕的假设为基础，而不能访问被丢弃的原始日志。
- **系统僵局& 循环**:没有严格的终止条件，两个代理可以无休止地辩论，或者在无限循环中前后传递任务。

### 副代理管弦图案

编排子 Agent 时，常见的拓扑结构有五种。

<SketchDiagram
  src="/static/images/ai-concepts/agent-coordination.svg"
  alt="五种协作方式包括主管派发任务并接收摘要、顺序流水线、同伴互评、共享状态板，以及并行调查后汇总。"
  width={800}
  height={960}
/>

1. **分级主管-工人(中枢-和声)**:
   中央监督人员将目标分解，产下专门的儿童代理，通过目标次瞬间，并汇总其提炼摘要。 工人从不直接沟通。
2. **序列管/连锁(交接)**:
   代理通过工作，作为结构化的指挥棒沿着装配线(,例如*Architect*$\rightarrow$_Developer_$\rightarrow$_Tester_$\rightarrow$_技术作家_).每个代理都完善了前身的输出。
3. **同行协作与辩论(生成器-批评)**:
   两位专业代理在一个迭代循环中工作。一位代理生成候选解决方案(,例如代码补丁),而一位对抗性评论家代理则评价边缘案例、安全缺陷或测试失败。他们会一直到评论家批准或达到转弯门槛为止。
4. **事件驱动的黑板/共享内存(swarm)**:
   代理不直接相互引用，而是从共享的共享板或信息总线上读取并发布。代理订阅任务主题，并声称子任务符合其能力 。
5. **动态叉-join(散射-gather / 平行代表团)**:
   当一个代理遇到独立的子问题(,例如搜索三个独立的寄存器或测试四个假说)时，它动态叉平行的工人代理，等待其完成，并合并了脱节的书写集。

### 何时使用多代理系统

- 复杂的软件开发，跨越不同的阶段(架构，编码，测试执行，文档)
- 具有自然界限的任务，从大型密码库的平行调查中受益
- 上下文爆炸使单代理人推理在长期执行范围内降解的系统

---

## 10. 兽医

### 什么是管弦乐手？

**编排器**是管理多 Agent 系统，工作流程执行，状态持久化，以及资源分配的集中协调引擎。

虽然个别特工执行有界限的环路，但指挥员却坐在环路之外:

- **Routing**: 检查进场任务，并将其分配到相应的代理或工作流程。
- **状态与内存管理**:维持全局执行状态，跟踪对话历史，并同步跨代理共享内存。
- **货币和缩放**:管理并行执行，任务超时，重试，以及速率限制。
- **冲突解决**:当两个代理商得出矛盾的结论或要求相同的独家锁时，仲裁分歧。

```typescript
// Architectural skeleton of a multi-agent orchestrator
class Orchestrator {
  private registry: Map<string, SpecializedAgent> = new Map()
  private sharedContext: Map<string, unknown> = new Map()

  registerAgent(role: string, agent: SpecializedAgent) {
    this.registry.set(role, agent)
  }

  async executeMission(goal: string): Promise<MissionResult> {
    const planner = this.registry.get('planner')!
    const plan = await planner.execute({ goal })

    for (const step of plan.steps) {
      const worker = this.registry.get(step.assignedRole)
      if (!worker) throw new Error(`Unassigned role: ${step.assignedRole}`)

      const stepResult = await worker.execute({
        task: step.description,
        context: this.sharedContext.get(step.dependsOn),
      })

      this.sharedContext.set(step.id, stepResult)
    }

    const synthesizer = this.registry.get('synthesizer')!
    return synthesizer.execute({ history: Array.from(this.sharedContext.entries()) })
  }
}
```

### 何时使用编排器

当您的建筑跨度时执行一个编排器:

- 两名以上协作人员
- 与检查、暂停或恢复要求同步的任务队列
- 人力启动审批中断长期代理业务。

---

## 11. 钩子

### 什么是钩子？

**Hooks**是决定性的，生命周期的截取点，允许主机应用程序在关键代理事件之前，期间或之后注入自定义逻辑。

LLM本质上是概率性的，非定型的，以及黑盒的.**Hooks提供了观测，检查，变异，或中止代理操作所需的定型软件边界**. 类似于Git hooks, Webhooks,或React 生命周期方法，代理 hooks给出软件工程师应用定义的截取点。 执行取决于哪些操作通过这些点。

<SketchDiagram
  src="/static/images/ai-concepts/lifecycle-hooks.svg"
  alt="beforePrompt 处理输入。工具调用经过 beforeToolCall 和 afterToolCall，结果反馈给 Agent。答复通过 afterModelCall 检查。"
  width={800}
  height={900}
/>

### 常用的毒剂生命周期钩

现代代理框架(,如AI SDK,LangChain,或自定义企业运行时间)暴露了整个执行生命周期的钩子:

| 生命周期钩        | 事件触发器               | 初级使用案例                                         |
| :---------------- | :----------------------- | :--------------------------------------------------- |
| `beforePrompt`    | 在用户提示输入上下文前， | PII 编辑，即时注射检测，符号正常化                   |
| `beforeModelCall` | 向 LLM API               | 发出请求前右侧动态快速注入，上下文窗口压缩，缓存查询 |
| `afterModelCall`  | 模型返回符后立即返回     | 遥测记录，毒性过滤，JSON语法修复                     |
| `beforeToolCall`  | Model 请求工具引用       | 许可检查，论证消毒，人类批准 gating                  |
| `afterToolCall`   | 主机运行时间完成工具执行 | 规范输出，掩盖秘密，缓存工具结果                     |
| `onAgentSpawn`    | 子代理或工人初始化       | 分配沙箱容器，继承母预算                             |
| `onError`         | 工具故障或模型超时发生   | 重试排程，倒置模型引用，错误报告                     |

### 守则的实施:生命周期钩子登记簿

```typescript
// Concrete implementation of an agent lifecycle hook registry
type HookFn<T> = (context: T) => Promise<T | void>

class AgentHookRegistry {
  private beforeToolCallHooks: HookFn<{ toolName: string; args: any }>[] = []
  private afterToolCallHooks: HookFn<{ toolName: string; result: any }>[] = []

  onBeforeToolCall(fn: HookFn<{ toolName: string; args: any }>) {
    this.beforeToolCallHooks.push(fn)
  }

  async triggerBeforeToolCall(toolCall: { toolName: string; args: any }) {
    for (const hook of this.beforeToolCallHooks) {
      await hook(toolCall)
    }
  }
}

// Registering hooks for security, governance, and logging
const hooks = new AgentHookRegistry()

// 1. Narrow capability authorization (illustrative policy).
// The dispatcher must also enforce this policy; a hook is not a process sandbox.
hooks.onBeforeToolCall(async ({ toolName }) => {
  const allowedTools = new Set(['read_parser_source', 'run_parser_checks'])
  if (!allowedTools.has(toolName)) {
    throw new Error('This task does not authorize that capability.')
  }
})

// 2. Budget and telemetry hook
hooks.onBeforeToolCall(async ({ toolName }) => {
  console.log(`[Telemetry] Agent invoking tool: ${toolName}`)
})
```

### 何时使用钩子

钩子是基础层，用于:

- 在模型外安装决定性的护栏
- 包含每个工具引用的分布式跟踪和OpenTelemetter 度量衡
- 长期代理机构执行象征性、成本和费率限制预算
- 在敏感状态突变前注入人-在-在-在-在-在-在-在-在-在-在-在-在敏感状态突变前得到批准

---

## 12. 护卫设施

### 护栏是什么？

**Guardrails**是可编程的安全机制，验证规则，以及评价投入，中间行动和输出的政策层，以防止AI系统采取不适当，不安全，或超出范围的行动。

护卫可以拒绝特定的无效请求，也可以减少不安全产出的机会。 其保障取决于其执行和覆盖范围；基于模型的判断或模式过滤器不是沙盒。

### 为什么催眠器不是护栏？

在AI工程中，一个普遍存在的建筑反平板电脑正在依赖系统提示作为安全控制:

> _"你是一个有帮助的助手。你永远不能运行破坏性的 shell 命令，你永远不能透露内部的客户数据库记录。"_

**即时安全在生产中从根本上是不可靠的**:

1. **易感快速注射**:隐藏在外部数据中的间接快速注射(,例如GitHub问题中的恶意评论，从网页中刮掉的文本，或者客户数据库中的一行)可以指示模型忽略以前的系统指令。
2. **概率执行**: LLMs是统计符号预测器，而不是决定性逻辑引擎。作为假设计算，每次操作1%的违反概率给预期的10次超过1000次操作；实际计数不确定，这不是一个测量模型率。在企业软件中，1%的失败率是不可容忍的。
3. **背景稀释**:随着对话历史发展到数万个符号，系统启动时放置的即时指令会受到注意力退化的影响。
4. **零物理执行**: 快速指令不能取消数据库用户的`DROP`权限，不能杀死一个运行中的bash进程，也不能隔离一个套接字连接。

真正的安全性需要**定型码在型号**之外执行。

### 通过钩子实施护栏

因为提示不能强制安全，所以**护栏一般直接在生命周期钩子内执行**:

<SketchDiagram
  src="/static/images/ai-concepts/guardrail-layers.svg"
  alt="运行时过滤输入，检查工具权限和沙箱边界，清理送回模型的工具结果，并在答复前检查模型输出。"
  width={800}
  height={900}
/>

1. **输入式护栏(挂在`beforePrompt`)**:
   - 在内容进入上下文前，旗下可疑的快速注入。检测会错过攻击或拒绝良性内容，因此，将授权独立于此过滤器。
   - 在网络传输到外部模型提供者之前，编辑个人可识别信息(PII).
2. **执行/工具护栏(挂在`beforeToolCall`)**上:
   - 验证带有schemas的输入结构，并分别执行语义限制。对于数据库访问，固定的只读查询能力和适当限制的数据库证书比接受任意的SQL文本的schema更强。
   - 执行授权政策(,例如，验证当前用户会话有引用`refund_customer`)的权限。
   - 沙盒文件系统路径和 shell 命令可以防止目录的 traversal 或特权升级。
3. **输出护栏(挂载在`afterModelCall`)**:
   - 将生成的索赔与所获取的证据进行比较，并报告不支持的报表。这可以减少错误，而不保证正确性。
   - 对泄露的API密钥，令牌，或机密数据进行扫描响应。
   - 验证结构化输出格式符合(,例如，Zod schema在将有效载荷传递到下游微服务之前解析).

调度器应该授权一个狭小的能力，验证其参数，并在一个具有所需文件系统和网络限制的环境中运行.例如，`run_parser_checks`可以映射到应用程序所维护的固定命令.对任意 shell 文本的正则表达式不能执行相同的边界。 Hook names in this article is explain, not a share frame API.

[MCP架构与主机责任](https://modelcontextprotocol.io/specification/2025-11-25/architecture)

### 何时使用护栏

护栏在生产中是不可谈判的:

- 任何与公众用户互动的客户端应用程序
- 任何具有写、执行或财务突变权限的代理人
- 受监管行业(金融，医疗，法定)具有法定隐私和审计义务。

---

## 13. 办法

### 什么是绳子？

在经典的软件工程中，测试牵引器是集软件和测试数据为一体，在监测程序单元的行为和输出的同时，在不同条件下运行一个程序单元。

在本篇文章中，一个**运行时的jap**是一个围绕一个模式的软件，该模式提供上下文，发送工具，记录状态，并强制执行执行限制.一个**评价使用**运行任务，并在控制条件下检查结果.一个系统可能相互共享基础设施，但术语描述了不同的责任。

$$\text{Harness} = \text{Environment Provisioning} + \text{Context Scaffolding} + \text{Execution Sandbox} + \text{Evaluation Engine}$$

如果代理是驱动器，工具是方向盘和踏板，则**的Harness是底盘，遥测钻机，并证明地面**. Agent 负责推理并选择要执行的动作；Harness负责设定代理所察觉的外部现实，执行操作限制，并核实代理的工作是否实际解决问题。

### 人工智能装置的核心能力

一种电源装置可履行四项核心工程功能:

1. **环境供给和沙箱**:
   - 喷泉隔离，可复制的工作空间(,如麻黄多克容器，微VM,git工作树，或限制本地刮痕目录).
   - 强制执行文件系统读/写边界和网络隔离政策，以防止运行中的代理器损坏主机环境或过滤数据。

2. **上下文注入和快速脚手架**:
   - 在代理商第一次转机前集成并注入基线上下文:系统提示，工作空间路径定义，环境变量，工具声明，重播级指令(如`AGENTS.md`),以及可用的技能。
   - 屏蔽人工设置锅炉板的代理环路，同时确保可预见，可复制的初始状态。

3. **运行时治理和遥测**:
   - 执行执行预算:最大推理迭代(转动),象征性消费限额，墙时超时，以及财务成本上限。
   - 捕捉高真性执行痕迹:记录可观察到的模型响应，拟议工具呼叫，工具结果，以及用于重播，调试的中间文物，以及尸检后分析。

4. **自动验证和评价(eval habel)**:
   - 在基准和测试模式(中，如SWE-bench,GAIA,或内部回归测试床)中，在代理完成运行后，该控制伞执行决定论断言。
   - 运行测试跑者(`pytest`,`jest`,`pnpm test`),编译代码，检查git diffs,或运行一个LLM-as-a-judge的分级器以产生记录结果.基于模型的分级器仍然是不确定的判断；确定性检查也只确定了它们实际测试的条件。

<SketchDiagram
  src="/static/images/ai-concepts/runtime-evaluation-harness.svg"
  alt="基准任务进入 Harness 后，依次创建工作区、注入上下文并在沙箱中运行 Agent。系统记录遥测数据并验证结果，给出评估结论。"
  width={800}
  height={697}
/>

### 评价和运行时间循环

下面的示例展示了评估与运行 harness 的概念实现。它在隔离的 Git 仓库中运行 Agent，并通过自动化测试验证修复。

```typescript
import { execSync } from 'child_process'
import { runAgent } from './agent'

interface HarnessConfig {
  taskPrompt: string
  repoPath: string
  testCommand: string
  maxTurns: number
  tokenBudget: number
}

interface BenchmarkResult {
  passed: boolean
  totalTurns: number
  tokensUsed: number
  patch: string
  logs: string[]
}

async function runInHarness(config: HarnessConfig): Promise<BenchmarkResult> {
  // 1. Provision isolated git worktree
  const worktreePath = `/tmp/agent-worktrees/${Date.now()}`
  execSync(`git worktree add ${worktreePath} HEAD`, { cwd: config.repoPath })

  const telemetry = { tokens: 0, turns: 0, logs: [] as string[] }

  try {
    // 2. Inject context and run agent within execution sandbox
    const agentResult = await runAgent({
      goal: config.taskPrompt,
      cwd: worktreePath,
      maxTurns: config.maxTurns,
      tokenBudget: config.tokenBudget,
      onStep: (step) => {
        telemetry.turns++
        telemetry.tokens += step.tokenUsage
        telemetry.logs.push(`[Turn ${telemetry.turns}] ${step.summary}`)
      },
    })

    // 3. Extract generated patch
    const patch = execSync('git diff', { cwd: worktreePath }).toString()

    // 4. Run deterministic verification suite
    let passed = false
    try {
      execSync(config.testCommand, { cwd: worktreePath, stdio: 'pipe' })
      passed = true
    } catch {
      passed = false
    }

    return {
      passed,
      totalTurns: telemetry.turns,
      tokensUsed: telemetry.tokens,
      patch,
      logs: telemetry.logs,
    }
  } finally {
    // Teardown worktree and sandbox
    execSync(`git worktree remove --force ${worktreePath}`, { cwd: config.repoPath })
  }
}
```

### 什么时候用绳子

在四种主要工程设想中，利用技术至关重要:

- **基准和评价**:测量代理精度，工具调用精度，以及标准化套件的完成率(,例如SWE-bench,HumanEval,GAIA)或专有测试套件。
- **安全代理执行**:运行开发者编码代理(,如Codex,SWE代理，或Claude Code)在包含的环境中，在其中不可信工具执行(shell命令，脚本)不能损坏主机。
- **CI/CD回归测试**:在运输代理更新到生产之前，针对确定性的试验床测试快速，模型，或工具变化。
- **后训练的轨迹收集**: 装配完整，可复制的动作轨迹和反馈循环，用于强化学习(RLHF/RLAIF)或有监督的微调。

---

# 概念如何连接:统一架构

下图展示了这些组件在一个系统中如何配合。

<SketchDiagram
  src="/static/images/ai-concepts/unified-architecture.svg"
  alt="Harness 包含控制、编排、Agent 执行、工具集成和评估。编排器调度工作流和多个 Agent，插件提供技能与 MCP 集成，工具访问外部 API、数据库和文件。"
  width={800}
  height={1070}
/>

图表是一种可能的安排。一个工作流程可以包含一个代理步骤，运行时间可以服务一个代理，而不需要单独的管弦乐手，一个评价工具也可以测试。根据任务选择边界，而不是执行每个框。

# 结语

LLM 根据收到的上下文生成回应。工作流预先定义执行步骤，Agent 则根据工具反馈决定下一步行动。在多 Agent 系统中，各个 Agent 可以在各自的上下文中专注于子任务，由编排器协调交接、汇总结果。

先选定一个任务，再明确什么证据能证明任务已完成。以差旅政策为例，摘要中的报销限额和生效日期都应能在现行政策中核对。如果第一次尝试失败，就追查问题出在哪一步。系统可能需要改进检索、增加核对来源的工具，或者在 Harness 中加入完成检查。找到具体缺口后，再补上对应的组件。

想看 Agent 和 Harness 如何配合，可以阅读 [AI Agent 与 Harness](/zh/blog/ai-agents-and-harnesses-from-tool-loops-to-reliable-systems)中的完整示例。
