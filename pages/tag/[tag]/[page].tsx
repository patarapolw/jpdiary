import Head from 'next/head'

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

const TagPaged = ({ posts, count, tag, title, banner, author }: IProp) => {
  return (
    <>
      <Head>
        <title>Tag: {tag} - {title}</title>
      </Head>
      <BlogLayout banner={banner} >
        <PostQuery defaults={{ posts, count }} author={author} />
      </BlogLayout>
    </>
  )
}

export default TagPaged

export const getStaticPaths = async () => {
  const { default: tagJson } = await import('@/build/tag.json')

  return {
    paths: Object.entries(tagJson).map(([tag, count]) => {
      return Array(Math.ceil(count / 5) - 1).fill(tag).map((t, i) => ({
        params: {
          tag: t,
          page: (i + 2).toString()
        }
      }))
    }).reduce((prev, c) => [...prev, ...c], []),
    fallback: false
  }
}

export const getStaticProps = async ({ params: { tag, page } }: {
  params: {
    tag: string
    page: string
  }
}): Promise<{ props: IProp }> => {
  const { default: search } = await import('@/scripts/search')
  const { default: { title, banner, author } } = await import('@/theme-config.json')

  const r = search({
    tag,
    offset: (parseInt(page) - 1) * 5
  })

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
