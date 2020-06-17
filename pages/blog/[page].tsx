import rawJson from '@/build/raw.json'
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

export const getStaticPaths = async () => {
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
  const r = search({ offset: (parseInt(page) - 1) * 5 })

  return {
    props: {
      posts: r.result,
      count: r.count
    }
  }
}
