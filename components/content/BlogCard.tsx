import { Clock, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BlogPostPreview {
  slug: string
  title: string
  excerpt: string
  category: string
  publishedAt: string
  readTime: string
  author: string
}

export interface BlogCardProps {
  post: BlogPostPreview
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const CATEGORY_COLORS: Record<string, string> = {
  'Home Security': 'bg-green-100 text-green-800',
  'Smart Home': 'bg-blue-100 text-blue-800',
  'Safety Tips': 'bg-amber-100 text-amber-800',
  Comparisons: 'bg-purple-100 text-purple-800',
  News: 'bg-red-100 text-red-800',
}

export default function BlogCard({ post }: BlogCardProps) {
  const categoryColor =
    CATEGORY_COLORS[post.category] || 'bg-gray-100 text-gray-800'

  return (
    <a
      href={`/blog/${post.slug}`}
      className="group block bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-gray-300 hover:-translate-y-0.5"
    >
      {/* Card body */}
      <div className="p-5 sm:p-6">
        {/* Category badge */}
        <span
          className={cn(
            'inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3',
            categoryColor
          )}
        >
          {post.category}
        </span>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 leading-snug mb-2 group-hover:text-emerald-500 transition-colors line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Meta row */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <User size={13} className="flex-shrink-0" />
            <span className="truncate max-w-[120px]">{post.author}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>{formatDate(post.publishedAt)}</span>
            <span className="flex items-center gap-1">
              <Clock size={13} className="flex-shrink-0" />
              {post.readTime}
            </span>
          </div>
        </div>
      </div>
    </a>
  )
}
