import BlogLayout from '@/components/layouts/BlogLayout'
import PostQuery from '@/components/PostQuery'
import SEO from '@/components/seo'

interface IProp {
  posts: any[]
  count: number
  tag: string
}

const TagPaged = ({ posts, count, tag }: IProp) => {
  return (
    <>
      <SEO title={`Tag: ${tag}`} />
      <BlogLayout>
        <PostQuery defaults={{ posts, count }} />
      </BlogLayout>
    </>
  )
}

export default TagPaged
