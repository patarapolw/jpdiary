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

const Post = ({ post: p, banner, remark42, author }: IProps) => {
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
        <PostFull author={author} remark42={remark42} post={p} />
      </BlogLayout>
    </>
  )
}

export default Post

export const getStaticPaths = async () => {
  const { default: rawJson } = await import('@/build/raw.json')

  const paths = Object.entries(rawJson).map(([slug, { date }]) => {
    if (!date) {
      return
    }

    const d = new Date(date)

    return {
      params: {
        slug,
        y: d.getFullYear().toString(),
        mo: (d.getMonth() + 1).toString().padStart(2, '0')
      }
    }
  }).filter((el) => el)

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps = async ({ params: { slug } }: {
  params: {
    y: string
    mo: string
    slug: string
  }
}): Promise<{ props: IProps }> => {
  const { default: post } = await import('@/scripts/post')
  const r = post({ slug })

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
