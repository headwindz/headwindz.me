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
  const { name, avatar, occupation, company, email, twitter, linkedin, github } = content
  return (
    <div id="about" className="about-command-page home-profile">
      <AboutTerminal
        identity={
          <>
            {avatar && (
              <Image src={avatar} alt={name} width={72} height={72} className="terminal-avatar" />
            )}
            <div>
              <h1>{name}</h1>
              <p>
                {occupation}
                {company ? ` · ${company}` : ''}
              </p>
            </div>
            <div className="terminal-socials">
              <SocialIcon kind="github" size={6} href={github || siteMetadata.github} />
              <SocialIcon kind="mail" href={email ? `mailto:${email}` : undefined} />
              <SocialIcon kind="linkedin" href={linkedin} />
              <SocialIcon kind="x" size={5.5} href={twitter || siteMetadata.x} />
            </div>
          </>
        }
      >
        {children}
      </AboutTerminal>
    </div>
  )
}
