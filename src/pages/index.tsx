import BlogLayout from '@/components/layouts/BlogLayout'
import PostQuery from '@/components/PostQuery'
import SEO from '@/components/seo'

interface IProp {
  posts: any[]
  count: number
}

const Home = (defaults: IProp) => {
  return (
    <>
      <SEO />
      <BlogLayout>
        <PostQuery defaults={defaults} />
      </BlogLayout>
    </>
  )
}

export default Home
