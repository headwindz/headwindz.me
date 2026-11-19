'use client'

import type { Blog } from 'contentlayer/generated'
import WorkspacePreview from './demos/all-about-my-development/WorkspacePreview'
import DesignTokenPreview from './demos/building-enterprise-design-systems/DesignTokenPreview'
import ConceptsPreview from './demos/ai-concepts-from-llms-to-multi-agent-systems/ConceptsPreview'
import StablecoinPreview from './demos/web3-stablecoins/StablecoinPreview'
import Web3Overview from './demos/introduction-to-web3/Web3Overview'
import AgentLoop from './demos/ai-agents-and-harnesses-from-tool-loops-to-reliable-systems/AgentLoop'

const previews = {
  'introduction-to-web3': Web3Overview,
  'all-about-my-development': WorkspacePreview,
  'building-enterprise-design-systems': DesignTokenPreview,
  'ai-concepts-from-llms-to-multi-agent-systems': ConceptsPreview,
  'web3-stablecoins': StablecoinPreview,
  'ai-agents-and-harnesses-from-tool-loops-to-reliable-systems': AgentLoop,
}

export default function ArticlePreview({
  post,
}: {
  post: Pick<Blog, 'slug' | 'tags' | 'readingTime'>
}) {
  const Preview = Object.hasOwn(previews, post.slug)
    ? previews[post.slug as keyof typeof previews]
    : undefined
  if (Preview) return <Preview />
  return (
    <div className="post-cover p-4 text-sm">
      {[post.readingTime.text, ...post.tags].join(' · ')}
    </div>
  )
}
