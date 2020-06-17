import { Head } from 'next/document'

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
