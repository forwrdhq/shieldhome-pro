import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { blogPosts, getBlogPost, getRelatedPosts } from '@/lib/blog-data'
import { Shield, Clock, Calendar, ChevronRight, Phone } from 'lucide-react'
import ContentHeader from '@/components/content/ContentHeader'
import ContentFooter from '@/components/content/ContentFooter'
import Breadcrumbs from '@/components/content/Breadcrumbs'
import CTABanner from '@/components/content/CTABanner'
import AuthorBio from '@/components/content/AuthorBio'
import RelatedPosts from '@/components/content/RelatedPosts'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: {
      canonical: `https://shieldhome.pro/blog/${post.slug}`,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      type: 'article',
      url: `https://shieldhome.pro/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
    },
  }
}

function renderContent(content: string) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} id={line.slice(4).toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="text-xl font-bold text-[#1A1A2E] mt-8 mb-3">
          {line.slice(4)}
        </h3>
      )
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} id={line.slice(3).toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="text-2xl font-bold text-[#1A1A2E] mt-10 mb-4">
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith('- ')) {
      const listItems: string[] = []
      while (i < lines.length && lines[i].startsWith('- ')) {
        listItems.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside space-y-2 my-4 text-gray-700">
          {listItems.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ul>
      )
      continue
    } else if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) {
      const listItems: string[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\d+\.\s/, ''))
        i++
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal list-inside space-y-2 my-4 text-gray-700">
          {listItems.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ol>
      )
      continue
    } else if (line.trim() === '') {
      // skip empty lines
    } else {
      // Paragraph - collect consecutive non-empty, non-header lines
      const paraLines: string[] = [line]
      while (i + 1 < lines.length && lines[i + 1].trim() !== '' && !lines[i + 1].startsWith('#') && !lines[i + 1].startsWith('- ') && !/^\d+\.\s/.test(lines[i + 1])) {
        i++
        paraLines.push(lines[i])
      }
      const text = paraLines.join(' ')
      // Handle **bold** inline
      const parts = text.split(/(\*\*[^*]+\*\*)/g)
      elements.push(
        <p key={i} className="text-gray-700 leading-relaxed my-4">
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} className="font-semibold text-[#1A1A2E]">{part.slice(2, -2)}</strong>
            }
            return part
          })}
        </p>
      )
    }
    i++
  }

  return elements
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const relatedPosts = getRelatedPosts(slug, 3)

  // Extract headings for schema
  const headings = post.content
    .split('\n')
    .filter((line: string) => line.startsWith('## '))
    .map((line: string) => line.slice(3))

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ShieldHome Pro',
      url: 'https://shieldhome.pro',
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: `https://shieldhome.pro/blog/${post.slug}`,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://shieldhome.pro' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://shieldhome.pro/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://shieldhome.pro/blog/${post.slug}` },
    ],
  }

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <ContentHeader />

      <main>
        {/* Article Header */}
        <section className="bg-[#1A1A2E] py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs
              items={[
                { name: 'Home', url: '/' },
                { name: 'Blog', url: '/blog' },
                { name: post.title, url: `/blog/${post.slug}` },
              ]}
            />
            <div className="mt-6">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#00C853]/20 text-[#00C853] uppercase tracking-wider mb-4 capitalize">
                {post.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
                {post.title}
              </h1>
              <p className="text-gray-300 text-lg mb-6">{post.excerpt}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#00C853]/20 flex items-center justify-center">
                    <Shield size={14} className="text-[#00C853]" />
                  </div>
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>{post.publishedAt}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Body */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
              {/* Main Content */}
              <article className="max-w-none">
                {renderContent(post.content)}

                {/* Mid-article CTA */}
                <div className="my-10">
                  <CTABanner variant="quiz" />
                </div>
              </article>

              {/* Sidebar */}
              <aside className="hidden lg:block">
                <div className="sticky top-24 space-y-6">
                  {/* Quick Quote CTA */}
                  <div className="bg-gradient-to-b from-[#1A1A2E] to-[#2D2D4E] rounded-xl p-6 text-center">
                    <Shield className="text-[#00C853] mx-auto mb-3" size={32} />
                    <h3 className="text-white font-bold text-lg mb-2">Get a Free Quote</h3>
                    <p className="text-gray-300 text-sm mb-4">60-second quiz. No obligation.</p>
                    <Link
                      href="/home-security-quiz"
                      className="block bg-[#00C853] hover:bg-[#00A846] text-white px-6 py-3 rounded-lg font-bold text-sm transition-colors"
                    >
                      Start Free Quiz
                    </Link>
                    <div className="mt-3">
                      <a href={`tel:${PHONE_NUMBER_RAW}`} className="text-gray-400 hover:text-white text-xs flex items-center justify-center gap-1 transition-colors">
                        <Phone size={12} />
                        <span>Or call {PHONE_NUMBER}</span>
                      </a>
                    </div>
                  </div>

                  {/* Table of Contents */}
                  {headings.length > 0 && (
                    <div className="bg-[#F8F9FA] rounded-xl p-6">
                      <h3 className="font-bold text-[#1A1A2E] mb-3 text-sm uppercase tracking-wider">In This Article</h3>
                      <nav className="space-y-2">
                        {headings.map((heading: string, idx: number) => (
                          <a
                            key={idx}
                            href={`#${heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                            className="block text-sm text-gray-600 hover:text-[#00C853] transition-colors py-1 border-l-2 border-gray-200 hover:border-[#00C853] pl-3"
                          >
                            {heading}
                          </a>
                        ))}
                      </nav>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Author Bio */}
        <section className="py-8 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <AuthorBio />
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-12 bg-[#F8F9FA]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <RelatedPosts posts={relatedPosts} />
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <CTABanner variant="phone" />
      </main>

      <ContentFooter />
    </div>
  )
}
