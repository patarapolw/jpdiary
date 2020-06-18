import { Head } from 'next/document'

import rawJson from '@/build/raw.json'
import BlogLayout from '@/components/layouts/BlogLayout'
import PostFull from '@/components/PostFull'
import post from '@/scripts/post'
import config from '@/theme-config.json'
import { IPost } from '@/types/post'

const PostAtRoot = (p: IPost) => {
  return (
    <>
      <Head>
        <title>{p.title} - {config.title}</title>
        <meta name="description" content={config.description} />
        <meta name="keywords" content={(p.tag || []).join(',')} />
        <meta property="og:image" content={p.image} />
        <meta property="twitter:image" content={p.image} />
      </Head>
      <BlogLayout>
        <PostFull post={p} />
      </BlogLayout>
    </>
  )
}

export default PostAtRoot

export const getStaticPaths = async () => {
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
}): Promise<{ props: IPost }> => {
  const r = post({ slug: y })

  return {
    props: r
  }
}
