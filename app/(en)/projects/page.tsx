import HomeCommand from '@/components/HomeCommand'
import projectsData from '@/data/projectsData'
import Card from '@/components/ProjectCard'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Projects' })

export default function Projects() {
  return (
    <div className="mx-auto">
      <div className="space-y-4 pt-3">
        <div className="space-y-2">
          <h1 className="journal-page-title">Projects</h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">Things I BUIDL!</p>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {projectsData.map((project) => (
            <div key={project.title} className="py-4 first:pt-0 last:pb-0">
              <Card
                title={project.title}
                description={project.description}
                imgSrc={project.imgSrc}
                href={project.href}
              />
            </div>
          ))}
        </div>
      </div>
      <HomeCommand />
    </div>
  )
}
