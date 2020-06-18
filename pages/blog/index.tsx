import BlogLayout from '@/components/layouts/BlogLayout'
import PostQuery from '@/components/PostQuery'
import { IPost } from '@/types/post'

interface IProp {
  posts: IPost[]
  count: number
  banner: string
  author: typeof import('@/theme-config.json')['author']
}

const Blog = ({ posts, count, banner, author }: IProp) => {
  return (
    <BlogLayout banner={banner}>
      <PostQuery defaults={{ posts, count }} author={author} />
    </BlogLayout>
  )
}

export default Blog

export const getStaticProps = async (): Promise<{ props: IProp }> => {
  const { default: search } = await import('@/scripts/search')
  const r = search()

  const { default: { banner, author } } = await import('@/theme-config.json')

  return {
    props: {
      posts: r.result,
      count: r.count,
      banner,
      author
    }
  }
}
