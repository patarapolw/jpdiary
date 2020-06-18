import Head from 'next/head'

import tagJson from '@/build/tag.json'
import BlogLayout from '@/components/layouts/BlogLayout'
import PostQuery from '@/components/PostQuery'
import search from '@/scripts/search'
import config from '@/theme-config.json'
import { IPost } from '@/types/post'

interface IProp {
  posts: IPost[]
  count: number
  tag: string
}

const Tag = ({ posts, count, tag }: IProp) => {
  return (
    <>
      <Head>
        <title>Tag: {tag} - {config.title}</title>
      </Head>
      <BlogLayout>
        <PostQuery defaults={{ posts, count }} />
      </BlogLayout>
    </>
  )
}

export default Tag

export const getStaticPaths = async () => {
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
  const r = search({
    tag
  })

  return {
    props: {
      posts: r.result,
      count: r.count,
      tag
    }
  }
}
