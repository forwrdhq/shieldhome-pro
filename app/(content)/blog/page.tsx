import type { Metadata } from 'next'
import Link from 'next/link'
import { blogPosts, getAllCategories } from '@/lib/blog-data'
import ContentHeader from '@/components/content/ContentHeader'
import ContentFooter from '@/components/content/ContentFooter'
import BlogCard from '@/components/content/BlogCard'
import Breadcrumbs from '@/components/content/Breadcrumbs'
import CTABanner from '@/components/content/CTABanner'

export const metadata: Metadata = {
  title: 'Home Security Blog — Expert Tips, Reviews & Guides | ShieldHome Pro',
  description: 'Expert home security guides, product reviews, comparisons, and tips. Learn how to protect your home with the latest smart security technology.',
  alternates: {
    canonical: 'https://shieldhome.pro/blog',
  },
  openGraph: {
    title: 'Home Security Blog — Expert Tips, Reviews & Guides',
    description: 'Expert home security guides, product reviews, comparisons, and tips from ShieldHome Pro.',
    url: 'https://shieldhome.pro/blog',
  },
}

export default function BlogIndex() {
  const categories = getAllCategories()
  const featuredPost = blogPosts[0]
  const remainingPosts = blogPosts.slice(1)

  return (
    <div className="min-h-screen bg-white">
      <ContentHeader />

      <main>
        {/* Hero */}
        <section className="bg-[#1A1A2E] py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={[{ name: 'Home', url: '/' }, { name: 'Blog', url: '/blog' }]} />
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-6 mb-4">
              Home Security Blog
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl">
              Expert guides, honest reviews, and actionable tips to help you protect what matters most.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="border-b border-gray-200 bg-white sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 py-4 overflow-x-auto no-scrollbar">
              <Link
                href="/blog"
                className="px-4 py-2 rounded-full text-sm font-semibold bg-[#1A1A2E] text-white whitespace-nowrap"
              >
                All Posts
              </Link>
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors whitespace-nowrap capitalize cursor-default"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href={`/blog/${featuredPost.slug}`} className="block group">
              <div className="bg-gradient-to-br from-[#1A1A2E] to-[#2D2D4E] rounded-2xl p-8 md:p-12 transition-transform group-hover:scale-[1.01]">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#00C853] text-white uppercase tracking-wider mb-4">
                  Featured
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-3 group-hover:text-[#00C853] transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-300 text-lg mb-4 max-w-2xl">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{featuredPost.author}</span>
                  <span>&middot;</span>
                  <span>{featuredPost.readTime}</span>
                  <span>&middot;</span>
                  <span>{featuredPost.publishedAt}</span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* All Posts Grid */}
        <section className="py-12 bg-[#F8F9FA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-8">Latest Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {remainingPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>

        {/* Mid-page CTA */}
        <CTABanner variant="quiz" />

      </main>

      <ContentFooter />
    </div>
  )
}
