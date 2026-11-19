export type Locale = 'en' | 'zh'

export function localizedHref(href: string, locale: Locale) {
  if (locale === 'en' || !href.startsWith('/') || href.startsWith('//')) return href
  if (href === '/zh' || href.startsWith('/zh/')) return href
  return href === '/' ? '/zh/' : `/zh${href}`
}

export const dictionaries = {
  en: {
    home: 'Home',
    blogs: 'Blogs',
    projects: 'Projects',
    tags: 'Tags',
    posts: 'Posts',
    allPosts: 'All posts',
    allProjects: 'All projects',
    visitProject: 'Visit project',
    empty: 'No featured posts.',
    skip: 'Skip to content',
    source: 'View Source',
    navigation: 'Main navigation',
    toggleMenu: 'Toggle Menu',
    closeMenu: 'Close menu',
    search: 'Search',
    content: 'Content',
    allBlogs: 'All blogs',
    toc: 'In this article',
    sections: 'Article sections',
    previous: 'Previous Post',
    next: 'Next Post',
    dark: 'Switch to dark mode',
    light: 'Switch to light mode',
    top: 'Scroll To Top',
    comment: 'Scroll To Comment',
    terminal: 'Interactive profile terminal',
    profileSections: 'Profile sections',
    profileCommand: 'Profile command',
    commandPlaceholder: 'Type a command',
    run: 'Run command',
    complete: 'Tab to complete',
    commands: 'Commands',
    noMatch: 'No matching command.',
    about: 'about',
    interests: 'interests',
    opensource: 'opensource',
  },
  zh: {
    home: '首页',
    blogs: '文章',
    projects: '项目',
    tags: '标签',
    posts: '文章',
    allPosts: '全部文章',
    allProjects: '全部项目',
    visitProject: '访问项目',
    empty: '暂无精选文章。',
    skip: '跳至正文',
    source: '查看源码',
    navigation: '主导航',
    toggleMenu: '打开菜单',
    closeMenu: '关闭菜单',
    search: '搜索',
    content: '文章',
    allBlogs: '全部文章',
    toc: '本文目录',
    sections: '文章章节',
    previous: '上一篇',
    next: '下一篇',
    dark: '切换深色模式',
    light: '切换浅色模式',
    top: '返回顶部',
    comment: '跳至评论',
    terminal: '交互式个人介绍终端',
    profileSections: '个人介绍栏目',
    profileCommand: '个人介绍命令',
    commandPlaceholder: '输入命令',
    run: '运行命令',
    complete: '按 Tab 补全',
    commands: '命令',
    noMatch: '没有匹配的命令。',
    about: '关于我',
    interests: '探索方向',
    opensource: '开源贡献',
  },
} as const

export const featuredTranslations: Record<string, { title: string; summary: string }> = {
  'introduction-to-web3': {
    title: 'Web3 入门',
    summary: '理解区块链、钱包和智能合约的工作原理，以及 Web3 对运营方、链下数据和信任的依赖。',
  },
  'ai-agents-and-harnesses-from-tool-loops-to-reliable-systems': {
    title: 'AI Agent 与 Harness：从工具循环到可靠系统',
    summary:
      '模型、工具与 Harness 如何组成 Agent，以及如何围绕有界执行循环扩展上下文、权限、恢复、评估和多 Agent 协作。',
  },
  'ai-concepts-from-llms-to-multi-agent-systems': {
    title: '读懂现代 AI 的核心概念',
    summary:
      '梳理 LLM、工作流、Agent、工具、MCP、Skills、插件、编排器、Hooks、护栏与 Harness 等核心概念及其架构关系。',
  },
  'building-enterprise-design-systems': {
    title: '构建企业级设计系统：从设计模式到前端架构',
    summary:
      '如何构建和维护企业级设计系统：跨产品团队共享模式、组件 API、设计令牌、主题、文档和升级流程。',
  },
}
