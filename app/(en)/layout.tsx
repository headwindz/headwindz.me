import SiteDocument, { siteDocumentMetadata } from '@/components/SiteDocument'

export const metadata = siteDocumentMetadata

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteDocument>{children}</SiteDocument>
}
