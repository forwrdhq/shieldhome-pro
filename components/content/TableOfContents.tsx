'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  headings: Heading[]
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first heading that is intersecting
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top
          )

        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      }
    )

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[]

    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      const offset = 96 // account for sticky header
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
      setActiveId(id)
    }
  }

  return (
    <nav className="sticky top-24" aria-label="Table of contents">
      <div className="border-l-2 border-gray-200 pl-0">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 pl-4">
          On This Page
        </h4>
        <ul className="space-y-1">
          {headings.map((heading) => {
            const isActive = activeId === heading.id
            const indent = heading.level === 3 ? 'pl-8' : 'pl-4'

            return (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => handleClick(e, heading.id)}
                  className={cn(
                    'block py-1.5 text-sm leading-snug border-l-2 -ml-[2px] transition-colors duration-150',
                    indent,
                    isActive
                      ? 'border-emerald-600 text-emerald-500 font-medium'
                      : 'border-transparent text-gray-500 hover:text-slate-900 hover:border-gray-400'
                  )}
                >
                  {heading.text}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
