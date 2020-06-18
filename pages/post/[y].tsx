import { NextSeo } from 'next-seo'

import BlogLayout from '@/components/layouts/BlogLayout'
import PostFull from '@/components/PostFull'
import config from '@/theme-config.json'
import { IPost } from '@/types/post'

interface IProps {
  post: IPost
  banner: string
  remark42: typeof import('@/theme-config.json')['comment']['remark42']
  author: typeof import('@/theme-config.json')['author']
}

const PostAtRoot = ({ post: p, banner, remark42, author }: IProps) => {
  return (
    <>
      <NextSeo
        title={`${p.title} - ${config.title}`}
        description={config.description}
        openGraph={{
          images: p.image ? [{
            url: p.image
          }] : undefined,
          article: { tags: p.tag }
        }} />
      <BlogLayout banner={banner}>
        <PostFull post={p} remark42={remark42} author={author} />
      </BlogLayout>
    </>
  )
}

export default PostAtRoot

export const getStaticPaths = async () => {
  const { default: rawJson } = await import('@/build/raw.json')

  return {
    paths: Object.entries(rawJson).map(([slug, { date }]) => {
      if (date) {
        return
      }

      return {
        params: {
          y: slug
        }
      }
    }).filter((el) => el),
    fallback: false
  }
}

export const getStaticProps = async ({ params: { y } }: {
  params: {
    y: string
  }
}): Promise<{ props: IProps }> => {
  const { default: post } = await import('@/scripts/post')
  const r = post({ slug: y })

  const { default: { banner, comment: { remark42 }, author } } = await import('@/theme-config.json')

  return {
    props: {
      post: r,
      banner,
      remark42,
      author
    }
  }
}
