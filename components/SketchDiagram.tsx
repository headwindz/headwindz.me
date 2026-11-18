'use client'

import { useLocale } from './LocaleProvider'
import { useRef, useState } from 'react'
import { Download, Maximize2, X } from 'lucide-react'
import Image from './Image'

type Props = {
  src: string
  alt: string
  width: number
  height: number
}

export default function SketchDiagram({ src, alt, width, height }: Props) {
  const zh = useLocale() === 'zh'
  const dialog = useRef<HTMLDialogElement>(null)
  const [zoom, setZoom] = useState(1)
  const image = (expanded = false) => (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={expanded ? '100vw' : '(max-width: 768px) 100vw, 960px'}
      className="h-auto w-full"
    />
  )

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700">
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-2 text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
        <span className="text-xs font-medium">{zh ? '图解' : 'Visual explainer'}</span>
        <div className="flex gap-2">
          <a
            href={`${process.env.BASE_PATH || ''}${src}`}
            download
            aria-label={`${zh ? '下载' : 'Download'} ${alt}`}
            className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Download size={16} />
          </a>
          <button
            type="button"
            aria-label={`${zh ? '展开' : 'Expand'} ${alt}`}
            onClick={() => {
              setZoom(1)
              dialog.current?.showModal()
            }}
            className="cursor-pointer rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
      {image()}
      <dialog
        ref={dialog}
        aria-label={alt}
        className="fixed inset-0 m-auto h-[95dvh] max-h-none w-[96vw] max-w-none flex-col overflow-hidden rounded-2xl bg-white p-0 text-gray-700 shadow-2xl backdrop:bg-black/70 open:flex"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-200 px-4 py-2">
          <span className="text-sm">{zh ? '图解' : 'Visual explainer'}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={zh ? '缩小' : 'Zoom out'}
              onClick={() => setZoom((value) => Math.max(0.6, value - 0.2))}
              className="cursor-pointer rounded-md px-2 py-1 hover:bg-gray-100"
            >
              −
            </button>
            <button
              type="button"
              aria-label={zh ? '重置缩放' : 'Reset zoom'}
              onClick={() => setZoom(1)}
              className="cursor-pointer rounded-md px-2 py-1 text-sm hover:bg-gray-100"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              aria-label={zh ? '放大' : 'Zoom in'}
              onClick={() => setZoom((value) => Math.min(3, value + 0.2))}
              className="cursor-pointer rounded-md px-2 py-1 hover:bg-gray-100"
            >
              +
            </button>
            <button
              type="button"
              aria-label={zh ? '关闭展开的图解' : 'Close expanded diagram'}
              onClick={() => dialog.current?.close()}
              className="cursor-pointer rounded-md p-2 hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-auto overscroll-contain">
          <div className="mx-auto" style={{ width: `${zoom * 100}%` }}>
            {image(true)}
          </div>
        </div>
      </dialog>
    </figure>
  )
}
