import PostFull from '@/components/PostFull'
import SEO from '@/components/seo'

const Post = (p: any) => {
  return (
    <>
      <SEO title={p.title} description={p.description} image={p.image} tag={p.tag} />
      <PostFull post={p} />
    </>
  )
}

export default Post
