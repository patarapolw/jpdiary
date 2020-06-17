import BlogLayout from '@/components/layouts/BlogLayout'
import PostQuery from '@/components/PostQuery'

interface IProp {
  posts: any[]
  count: number
}

const Blog = (defaults: IProp) => {
  return (
    <BlogLayout>
      <PostQuery defaults={defaults} />
    </BlogLayout>
  )
}

export default Blog
