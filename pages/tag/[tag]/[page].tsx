import { Head } from 'next/document'

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

const TagPaged = ({ posts, count, tag }: IProp) => {
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

export default TagPaged

export const getStaticProps = async ({ params: { tag, page } }: {
  params: {
    tag: string
    page: string
  }
}): Promise<{ props: IProp }> => {
  const r = search({
    tag,
    offset: (parseInt(page) - 1) * 5
  })

  return {
    props: {
      posts: r.result,
      count: r.count,
      tag
    }
  }
}
