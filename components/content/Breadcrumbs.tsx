import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allItems = [{ name: 'Home', url: '/' }, ...items]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://shieldhomepro.com${item.url}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="py-3">
        <ol className="flex flex-wrap items-center gap-1 text-sm">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1
            return (
              <li key={item.url} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
                )}
                {isLast ? (
                  <span className="text-gray-500 font-medium truncate max-w-[200px] sm:max-w-none">
                    {item.name}
                  </span>
                ) : (
                  <a
                    href={item.url}
                    className={cn(
                      'text-gray-500 hover:text-[#00C853] transition-colors',
                      index === 0 && 'flex items-center gap-1'
                    )}
                  >
                    {index === 0 && <Home size={14} className="flex-shrink-0" />}
                    <span>{item.name}</span>
                  </a>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
