import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import Image from '@/components/Image'
import Link from '@/components/Link'
import SocialIcon from '@/components/social-icons'
import AboutTerminal from '@/components/AboutTerminal'
import { ArrowUpRight } from 'lucide-react'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, bluesky, linkedin, github } = content
  return (
    <div className="about-command-page">
      <header className="about-command-heading">
        <h1>
          Meet the person
          <br />
          behind the prompt<span>.</span>
        </h1>
        <p>A little background, a few interests, and the things I build.</p>
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
              <SocialIcon kind="github" href={github} />
              <SocialIcon kind="mail" href={email ? `mailto:${email}` : undefined} />
              <SocialIcon kind="linkedin" href={linkedin} />
              <SocialIcon kind="x" href={twitter} />
              <SocialIcon kind="bluesky" href={bluesky} />
            </div>
          </>
        }
      >
        {children}
      </AboutTerminal>
      <div className="about-command-footer">
        <Link href="/projects">
          Explore projects <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
        <Link href="/blog">
          Read the blog <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
