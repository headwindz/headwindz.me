import SiteDocument, { siteDocumentMetadata } from '@/components/SiteDocument'

export const metadata = {
  ...siteDocumentMetadata,
  description: 'Michael Zheng 的个人博客，分享前端开发、AI、Web3 与软件工程实践。',
  openGraph: {
    ...siteDocumentMetadata.openGraph,
    title: 'Michael Zheng 的个人博客',
    description: '分享前端开发、AI、Web3 与软件工程实践。',
    locale: 'zh_CN',
  },
  twitter: {
    ...siteDocumentMetadata.twitter,
    title: 'Michael Zheng 的个人博客',
    description: '分享前端开发、AI、Web3 与软件工程实践。',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteDocument locale="zh">{children}</SiteDocument>
}
