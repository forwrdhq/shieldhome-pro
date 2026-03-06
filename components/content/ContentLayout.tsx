import { ReactNode } from 'react'
import Breadcrumbs from './Breadcrumbs'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  name: string
  url: string
}

interface ContentLayoutProps {
  children: ReactNode
  sidebar?: ReactNode
  breadcrumbs: BreadcrumbItem[]
}

export default function ContentLayout({
  children,
  sidebar,
  breadcrumbs,
}: ContentLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb bar */}
      <div className="border-b border-gray-100 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div
          className={cn(
            'flex flex-col gap-10',
            sidebar && 'lg:flex-row'
          )}
        >
          {/* Article content */}
          <article
            className={cn(
              'min-w-0 flex-1',
              /*
               * Prose-like typography for rendered content.
               * Uses Tailwind's `prose` where available, but we also
               * apply explicit styles via the `content-prose` custom
               * class so the styling works regardless of the
               * @tailwindcss/typography plugin being installed.
               */
              'content-prose',
              '[&>h1]:text-3xl [&>h1]:sm:text-4xl [&>h1]:font-extrabold [&>h1]:text-[#1A1A2E] [&>h1]:leading-tight [&>h1]:mb-4 [&>h1]:mt-0',
              '[&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-[#1A1A2E] [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:leading-snug',
              '[&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-[#1A1A2E] [&>h3]:mt-8 [&>h3]:mb-3',
              '[&>h4]:text-lg [&>h4]:font-semibold [&>h4]:text-[#1A1A2E] [&>h4]:mt-6 [&>h4]:mb-2',
              '[&>p]:text-gray-700 [&>p]:leading-relaxed [&>p]:mb-5 [&>p]:text-base',
              '[&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-5 [&>ul]:text-gray-700 [&>ul]:leading-relaxed [&>ul_li]:mb-2',
              '[&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-5 [&>ol]:text-gray-700 [&>ol]:leading-relaxed [&>ol_li]:mb-2',
              '[&>blockquote]:border-l-4 [&>blockquote]:border-[#00C853] [&>blockquote]:pl-4 [&>blockquote]:py-1 [&>blockquote]:my-6 [&>blockquote]:text-gray-600 [&>blockquote]:italic',
              '[&>a]:text-[#00C853] [&>a]:underline [&>a]:underline-offset-2 [&>a]:hover:text-[#00A846]',
              '[&>img]:rounded-xl [&>img]:my-6 [&>img]:shadow-sm',
              '[&>pre]:bg-gray-900 [&>pre]:text-gray-100 [&>pre]:rounded-lg [&>pre]:p-4 [&>pre]:overflow-x-auto [&>pre]:my-6 [&>pre]:text-sm',
              '[&>code]:bg-gray-100 [&>code]:text-[#1A1A2E] [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm',
              '[&>table]:w-full [&>table]:my-6 [&>table]:text-sm [&_th]:bg-[#F8F9FA] [&_th]:text-left [&_th]:p-3 [&_th]:font-semibold [&_th]:text-[#1A1A2E] [&_td]:p-3 [&_td]:border-b [&_td]:border-gray-100',
              '[&>hr]:my-8 [&>hr]:border-gray-200'
            )}
          >
            {children}
          </article>

          {/* Sidebar (desktop only) */}
          {sidebar && (
            <aside className="hidden lg:block w-80 flex-shrink-0">
              {sidebar}
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
