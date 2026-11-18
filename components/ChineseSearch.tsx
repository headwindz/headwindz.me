'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { localizedHref } from '../lib/i18n'

type Post = { path: string; title: string; summary?: string; tags?: string[]; date: string }
const SearchContext = createContext<() => void>(() => {})

export function ChineseSearchButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const open = useContext(SearchContext)
  return <button {...props} onClick={open} />
}

export default function ChineseSearch({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [posts, setPosts] = useState<Post[] | null>(null)
  const [error, setError] = useState(false)
  const [selected, setSelected] = useState(0)
  const router = useRouter()
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])
  useEffect(() => {
    if (!open || posts) return
    const controller = new AbortController()
    setError(false)
    fetch(`${process.env.BASE_PATH || ''}/zh/search.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Search unavailable')
        return response.json()
      })
      .then((data: Post[]) => setPosts(data))
      .catch((error) => {
        if (error.name !== 'AbortError') setError(true)
      })
    return () => controller.abort()
  }, [open, posts])
  const results = (posts || []).filter((post) =>
    `${post.title} ${post.summary || ''} ${(post.tags || []).join(' ')}`
      .toLowerCase()
      .includes(query.trim().toLowerCase())
  )
  const visit = (post: Post) => {
    setOpen(false)
    router.push(localizedHref(`/${post.path}`, 'zh'))
  }
  return (
    <SearchContext.Provider
      value={() => {
        setQuery('')
        setSelected(0)
        setOpen(true)
      }}
    >
      {children}
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-80">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-start justify-center overflow-y-auto px-4 pt-[15vh] pb-8">
          <DialogPanel className="localized-search w-full max-w-xl rounded-xl border p-4">
            <div className="mb-4 flex items-center justify-between gap-4">
              <DialogTitle>搜索文章</DialogTitle>
              <button className="min-h-11 px-2" onClick={() => setOpen(false)}>
                关闭
              </button>
            </div>
            <input
              data-autofocus
              aria-label="搜索文章"
              placeholder="输入标题、关键词或标签"
              className="w-full rounded-md border bg-transparent px-3 py-3"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setSelected(0)
              }}
              onKeyDown={(event) => {
                if (event.nativeEvent.isComposing || !results.length) return
                if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                  event.preventDefault()
                  const next =
                    (selected + (event.key === 'ArrowDown' ? 1 : -1) + results.length) %
                    results.length
                  setSelected(next)
                  document.getElementById(`zh-search-${next}`)?.scrollIntoView({ block: 'nearest' })
                }
                if (event.key === 'Enter') {
                  event.preventDefault()
                  visit(results[selected] || results[0])
                }
              }}
            />
            <div className="sr-only" role="status">
              {results.length} 篇文章
            </div>
            {error ? (
              <p role="alert" className="py-6">
                暂时无法加载搜索，请关闭后重试。
              </p>
            ) : !posts ? (
              <p role="status" className="py-6">
                加载中…
              </p>
            ) : !results.length ? (
              <p role="status" className="py-6">
                没有找到匹配的文章。
              </p>
            ) : (
              <ul className="mt-4 max-h-[45vh] overflow-y-auto">
                {results.map((post, index) => (
                  <li key={post.path}>
                    <button
                      id={`zh-search-${index}`}
                      className="search-result w-full rounded-md p-3 text-left"
                      data-selected={index === selected}
                      onClick={() => visit(post)}
                    >
                      <time className="block text-xs">
                        {new Date(post.date).toLocaleDateString('zh-CN')}
                      </time>
                      {post.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </SearchContext.Provider>
  )
}
