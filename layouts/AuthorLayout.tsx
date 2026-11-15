import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import Image from '@/components/Image'
import SocialIcon from '@/components/social-icons'
import AboutTerminal from '@/components/AboutTerminal'
import siteMetadata from '@/data/siteMetadata'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, bluesky, linkedin, github } = content
  return (
    <div id="about" className="about-command-page home-profile">
      <header className="about-command-heading">
        <h1>
          Hi, I’m Michael Zheng
          <span className="terminal-dots" aria-hidden="true">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
          <span className="sr-only">.</span>
        </h1>
        <p>A full-stack engineer exploring AI agents, Web3, and the tools we build with.</p>
      </header>
      <AboutTerminal
        identity={
          <>
            {avatar && (
              <Image src={avatar} alt={name} width={72} height={72} className="terminal-avatar" />
            )}
            <div>
              <h2>{name}</h2>
              <p>
                {occupation}
                {company ? ` · ${company}` : ''}
              </p>
            </div>
            <div className="terminal-socials">
              <SocialIcon kind="github" href={github || siteMetadata.github} />
              <SocialIcon kind="mail" href={email ? `mailto:${email}` : undefined} />
              <SocialIcon kind="linkedin" href={linkedin} />
              <SocialIcon kind="x" href={twitter || siteMetadata.x} />
              <SocialIcon kind="bluesky" href={bluesky} />
            </div>
          </>
        }
      >
        {children}
      </AboutTerminal>
    </div>
  )
}
