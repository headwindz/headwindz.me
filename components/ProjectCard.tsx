'use client'

import Image from './Image'
import Link from './Link'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { ArrowRight, X } from 'lucide-react'
import { useState } from 'react'

const Card = ({ title, description, imgSrc, href }) => {
  const [isImageOpen, setIsImageOpen] = useState(false)

  return (
    <div className="flex flex-col items-start lg:flex-row lg:items-start">
      <div className="relative w-full lg:w-2/5">
        {imgSrc && (
          <>
            <button
              onClick={() => setIsImageOpen(true)}
              className="notebook-project-image relative block w-full cursor-pointer overflow-hidden rounded-lg"
              aria-label={`Preview ${title} image`}
              style={{ aspectRatio: '16/9' }}
            >
              <Image
                alt={title}
                src={imgSrc}
                className="h-full w-full object-cover transition-opacity hover:opacity-90"
                width={544}
                height={306}
              />
            </button>
            <Dialog
              open={isImageOpen}
              onClose={() => setIsImageOpen(false)}
              className="relative z-70"
            >
              <div className="fixed inset-0 bg-black/85" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4 sm:p-8">
                <DialogPanel className="relative max-w-6xl">
                  <DialogTitle className="sr-only">{title} image preview</DialogTitle>
                  <button
                    className="absolute top-2 right-2 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-gray-950 text-white hover:bg-gray-800"
                    onClick={() => setIsImageOpen(false)}
                    aria-label="Close image preview"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <Image
                    alt={title}
                    src={imgSrc}
                    className="max-h-[85dvh] w-auto rounded-lg object-contain"
                    width={1920}
                    height={1080}
                  />
                </DialogPanel>
              </div>
            </Dialog>
          </>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between space-y-4 pt-6 lg:pt-0 lg:pl-8">
        <div className="space-y-4">
          <h2 className="project-title text-gray-900 dark:text-gray-100">
            {href ? (
              <Link href={href} aria-label={`Link to ${title}`}>
                {title}
              </Link>
            ) : (
              title
            )}
          </h2>
          <p className="text-base leading-7 text-gray-600 dark:text-gray-400">{description}</p>
        </div>
        {href && (
          <Link
            href={href}
            className="group hover:border-primary-500 hover:text-primary-600 focus-visible:border-primary-500 focus-visible:text-primary-600 dark:hover:text-primary-400 dark:focus-visible:text-primary-400 inline-flex w-fit items-center gap-1 border-b border-transparent pb-0.5 text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400"
            aria-label={`Link to ${title}`}
          >
            View project
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  )
}

export default Card
