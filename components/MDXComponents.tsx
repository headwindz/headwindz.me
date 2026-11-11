import TOCInline from 'pliny/ui/TOCInline'
import CodeSnippet from './CodeSnippet'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
import LiveDemo from './LiveDemo'
import Mermaid from './Mermaid'

export const components: MDXComponents = {
  Image,
  h1: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
  TOCInline,
  a: CustomLink,
  pre: CodeSnippet,
  table: TableWrapper,
  BlogNewsletterForm,
  LiveDemo,
  Mermaid,
}
