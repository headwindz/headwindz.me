import 'css/tailwind.css'
import 'pliny/search/algolia.css'
import 'remark-github-blockquote-alert/alert.css'

import { Space_Grotesk } from 'next/font/google'
import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import SearchProvider from '@/components/SearchProvider'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from '../app/theme-providers'
import { Metadata } from 'next'
import { LocaleProvider } from './LocaleProvider'
import { dictionaries, type Locale } from '../lib/i18n'

const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

export const siteDocumentMetadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
}

export default function SiteDocument({
  children,
  locale = 'en',
}: {
  children: React.ReactNode
  locale?: Locale
}) {
  const basePath = process.env.BASE_PATH || ''

  return (
    <html
      lang={locale === 'zh' ? 'zh-CN' : 'en'}
      className={`${space_grotesk.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      <link rel="alternate" type="application/rss+xml" href={`${basePath}/feed.xml`} />
      <body className="journal-site antialiased">
        <a href="#main-content" className="skip-link">
          {dictionaries[locale].skip}
        </a>
        <ThemeProviders>
          <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
          <SectionContainer>
            <LocaleProvider locale={locale}>
              <SearchProvider>
                <Header locale={locale} />
                <main id="main-content" tabIndex={-1} className="pb-4 outline-none">
                  {children}
                </main>
              </SearchProvider>
            </LocaleProvider>
            <Footer locale={locale} />
          </SectionContainer>
        </ThemeProviders>
        <SpeedInsights />
      </body>
    </html>
  )
}
