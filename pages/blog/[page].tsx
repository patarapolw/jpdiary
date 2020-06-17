import BlogLayout from '@/components/layouts/BlogLayout'
import PostQuery from '@/components/PostQuery'
import search from '@/scripts/search'
import { IPost } from '@/types/post'

interface IProp {
  posts: IPost[]
  count: number
}

const BlogPaged = (defaults: IProp) => {
  return (
    <BlogLayout>
      <PostQuery defaults={defaults} />
    </BlogLayout>
  )
}

export default BlogPaged

export const getStaticProps = async ({ params: { page } }: {
  params: {
    page: string
  }
}): Promise<{ props: IProp }> => {
  const r = search({ offset: (parseInt(page) - 1) * 5 })

  return {
    props: {
      posts: r.result,
      count: r.count
    }
  }
}
