import { Head } from 'next/document'

import rawJson from '@/build/raw.json'
import PostFull from '@/components/PostFull'
import post from '@/scripts/post'
import config from '@/theme-config.json'
import { IPost } from '@/types/post'

const Post = (p: IPost) => {
  return (
    <>
      <Head>
        <title>{p.title} - {config.title}</title>
        <meta name="description" content={config.description} />
        <meta name="keywords" content={(p.tag || []).join(',')} />
        <meta property="og:image" content={p.image} />
        <meta property="twitter:image" content={p.image} />
      </Head>
      <PostFull post={p} />
    </>
  )
}

export default Post

export const getStaticPaths = async () => {
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
}): Promise<{ props: IPost }> => {
  const r = post({ slug })

  return {
    props: r
  }
}
