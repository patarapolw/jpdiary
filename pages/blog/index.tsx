import BlogLayout from '@/components/layouts/BlogLayout'
import PostQuery from '@/components/PostQuery'
import search from '@/scripts/search'
import { IPost } from '@/types/post'

interface IProp {
  posts: IPost[]
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

export const getStaticProps = async (): Promise<{ props: IProp }> => {
  const r = search()

  return {
    props: {
      posts: r.result,
      count: r.count
    }
  }
}
