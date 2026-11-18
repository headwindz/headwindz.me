import Link from '@/components/Link'

export default function NotFound() {
  return (
    <div className="py-24">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="my-6">找不到这个页面。</p>
      <Link href="/zh/">返回首页</Link>
    </div>
  )
}
