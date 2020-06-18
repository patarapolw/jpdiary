import { NextSeo } from 'next-seo'

import BlogLayout from '@/components/layouts/BlogLayout'
import PostQuery from '@/components/PostQuery'
import { IPost } from '@/types/post'

interface IProp {
  posts: IPost[]
  count: number
  tag: string
  title: string
  banner: string
  author: typeof import('@/theme-config.json')['author']
}

const Tag = ({ posts, count, tag, title, banner, author }: IProp) => {
  return (
    <>
      <NextSeo title={`Tag: ${tag} - ${title}`} />
      <BlogLayout banner={banner}>
        <PostQuery defaults={{ posts, count }} author={author} />
      </BlogLayout>
    </>
  )
}

export default Tag

export const getStaticPaths = async () => {
  const { default: tagJson } = await import('@/build/tag.json')

  return {
    paths: Object.entries(tagJson).map(([tag]) => {
      return {
        params: {
          tag
        }
      }
    }),
    fallback: false
  }
}

export const getStaticProps = async ({ params: { tag } }: {
  params: {
    tag: string
  }
}): Promise<{ props: IProp }> => {
  const { default: search } = await import('@/scripts/search')
  const r = search({
    tag
  })

  const { default: { title, banner, author } } = await import('@/theme-config.json')

  return {
    props: {
      posts: r.result,
      count: r.count,
      tag,
      title,
      banner,
      author
    }
  }
}
