import BlogLayout from '@/components/layouts/BlogLayout'
import PostQuery from '@/components/PostQuery'
import { IPost } from '@/types/post'

interface IProp {
  posts: IPost[]
  count: number
  banner: string
  author: typeof import('@/theme-config.json')['author']
}

const BlogPaged = ({ posts, count, banner, author }: IProp) => {
  return (
    <BlogLayout banner={banner}>
      <PostQuery defaults={{ posts, count }} author={author} />
    </BlogLayout>
  )
}

export default BlogPaged

export const getStaticPaths = async () => {
  const { default: rawJson } = await import('@/build/raw.json')

  return {
    paths: Array(Math.ceil(Object.keys(rawJson).length / 5) - 1).fill(null).map((_, i) => {
      return {
        params: {
          page: (i + 2).toString()
        }
      }
    }),
    fallback: false
  }
}

export const getStaticProps = async ({ params: { page } }: {
  params: {
    page: string
  }
}): Promise<{ props: IProp }> => {
  const { default: search } = await import('@/scripts/search')
  const r = search({ offset: (parseInt(page) - 1) * 5 })

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
