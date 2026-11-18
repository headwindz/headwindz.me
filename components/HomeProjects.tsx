import { dictionaries, localizedHref, type Locale } from '../lib/i18n'
import { ArrowUpRight } from 'lucide-react'
import projects from '@/data/projectsData'
import Image from './Image'
import Link from './Link'

export default function HomeProjects({ locale = 'en' }: { locale?: Locale }) {
  const t = dictionaries[locale]
  const summaries: Record<string, string> = {
    'Awesome web3': '通过历史时间线、术语表和精选学习资源探索 Web3。',
    Figx: '以 TypeScript 为基础的工具库，支持 Figma 插件开发、颜色处理等功能。',
    Toolhub: '日常工具集合，支持 JSON 格式化、图片压缩、颜色选择等操作。',
  }
  if (!projects.length) return null

  return (
    <section className="home-projects" aria-labelledby="home-projects-title">
      <div className="section-heading">
        <h2 id="home-projects-title">{t.projects}</h2>
        <Link href={localizedHref('/projects', locale)}>
          {t.allProjects} <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <ul className="home-project-grid">
        {projects.map((project) => (
          <li key={project.title}>
            <Link
              href={localizedHref(project.href || '/projects', locale)}
              className="home-project-card"
            >
              {project.imgSrc && (
                <div className="home-project-picture">
                  <Image
                    src={project.imgSrc}
                    alt={`${project.title}${locale === 'zh' ? '预览' : ' preview'}`}
                    loading="eager"
                    unoptimized
                    width={544}
                    height={306}
                    sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1183px) 30vw, 357px"
                  />
                </div>
              )}
              <div className="home-project-copy">
                <h3>{project.title}</h3>
                <p>
                  {locale === 'zh'
                    ? summaries[project.title]
                    : project.summary || project.description}
                </p>
                <span className="home-project-visit">
                  {t.visitProject} <ArrowUpRight size={17} aria-hidden="true" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
