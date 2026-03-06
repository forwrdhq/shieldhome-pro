import BlogCard, { type BlogPostPreview } from './BlogCard'

interface RelatedPostsProps {
  posts: BlogPostPreview[]
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null

  return (
    <section className="mt-12 pt-10 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">
        You Might Also Like
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(0, 3).map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}
