import HomeCommand from '@/components/HomeCommand'
import projectsData from '@/data/projectsData'
import Card from '@/components/ProjectCard'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ locale: 'zh', title: '项目' })

const descriptions: Record<string, string> = {
  'Awesome web3': 'Web3 学习平台，提供加密货币和区块链发展时间线、术语表与精选资料。',
  Figx: '以 TypeScript 为基础的 Figma 工具库，提供原生类型支持、颜色转换和插件开发 API，并附有详细文档。',
  Toolhub:
    '日常在线工具集合，涵盖 JSON 格式化与查看、图片压缩、OCR、二维码生成、哈希计算、颜色选择与调色板、WCAG 对比度检查、Base64 编解码、进制转换以及 JWT 解析。',
}

export default function Projects() {
  return (
    <div className="mx-auto">
      <div className="space-y-4 pt-3">
        <div className="space-y-2">
          <h1 className="journal-page-title">项目</h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">我做过的项目</p>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {projectsData.map((project) => (
            <div key={project.title} className="py-4 first:pt-0 last:pb-0">
              <Card
                title={project.title}
                description={descriptions[project.title] || project.description}
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
