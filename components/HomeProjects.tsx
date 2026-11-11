import { ArrowUpRight } from 'lucide-react'
import projects from '@/data/projectsData'
import Image from './Image'
import Link from './Link'

export default function HomeProjects() {
  if (!projects.length) return null

  return (
    <section className="home-projects" aria-labelledby="home-projects-title">
      <div className="section-heading">
        <h2 id="home-projects-title">Things I’ve been making</h2>
        <Link href="/projects">
          All projects <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <ul className="home-project-grid">
        {projects.map((project) => (
          <li key={project.title}>
            <Link href={project.href || '/projects'} className="home-project-card">
              {project.imgSrc && (
                <div className="home-project-picture">
                  <Image
                    src={project.imgSrc}
                    alt={`${project.title} preview`}
                    width={544}
                    height={306}
                    sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1183px) 30vw, 357px"
                  />
                </div>
              )}
              <div className="home-project-copy">
                <h3>{project.title}</h3>
                <p>{project.summary || project.description}</p>
                <span className="home-project-visit">
                  Visit project <ArrowUpRight size={17} aria-hidden="true" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
