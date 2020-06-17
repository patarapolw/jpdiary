import { graphql } from 'gatsby'

import BlogLayout from '@/components/layouts/BlogLayout'
import PostQuery from '@/components/PostQuery'
import SEO from '@/components/seo'

export const pageQuery = graphql`
  query BlogPostQuery($skip: Int!) {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 5
      skip: $skip
    ) {
      edges {
        node {
          excerpt(truncate: true)
          frontmatter {
            title
            tag
            date
          }
          rawBody
        }
      }
    }
  }
`

const Blog = ({
  pageContext: {
    page
  }
}: {
  pageContext: {
    page: number
  }
}) => {
  return (
    <>
      <SEO />
      <BlogLayout>
        <PostQuery page={page} />
      </BlogLayout>
    </>
  )
}

export default Blog
