import { readFileSync } from 'fs'
import { join } from 'path'
import LiveDemoEditor from './LiveDemoEditor'

interface LiveDemoProps {
  code?: string
  demoPath?: string
}

export default function LiveDemo({ code, demoPath }: LiveDemoProps) {
  let source = code || ''
  if (demoPath && !source && /^[a-z0-9-]+\/[a-z0-9-]+\.tsx$/.test(demoPath)) {
    try {
      source = readFileSync(join(process.cwd(), 'demos', demoPath), 'utf8')
    } catch {
      source = '// Demo source could not be loaded.'
    }
  }
  return (
    <LiveDemoEditor
      key={demoPath}
      initialCode={source.replace(/^['"]use client['"]\s*\n\s*/m, '')}
      runtimeUrl={`${process.env.BASE_PATH || ''}/static/demo-runtime.js`}
    />
  )
}
