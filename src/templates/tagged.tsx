import { graphql } from 'gatsby'
import React from 'react'

import BlogLayout from '@/components/layouts/BlogLayout'
import PostQuery from '@/components/PostQuery'
import SEO from '@/components/seo'

export const pageQuery = graphql`
  query TaggedPostQuery($skip: Int!, $tag: String!) {
    allMdx(
      filter: { frontmatter: { tag: { eq: $tag } } }
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 5
      skip: $skip
    ) {
      edges {
        node {
          fileAbsolutePath
          frontmatter {
            title
            tag
            date
          }
          rawBody
        }
      }
      pageInfo {
        totalCount
      }
    }
  }
`

const Tagged = ({
  data: {
    allMdx: {
      edges,
      pageInfo: {
        totalCount: count
      }
    }
  },
  pageContext: {
    tag
  },
  location
}: {
  data: {
    allMdx: {
      edges: {
        node: {
          fileAbsolutePath: string
          frontmatter: {
            title: string
            tag?: string[]
            date?: string
          }
          rawBody: string
        }
      }[]
      pageInfo: {
        totalCount: number
      }
    }
  },
  pageContext: {
    tag: string
  }
  location: Location
}) => {
  return (
    <>
      <SEO title={`Tag: ${tag}`} />
      <BlogLayout>
        <PostQuery location={location} defaults={{
          posts: edges.map((el) => {
            return {
              title: el.node.frontmatter.title,
              tag: el.node.frontmatter.tag,
              date: el.node.frontmatter.date,
              excerptBody: el.node.rawBody.split(/<!-- excerpt -->/)[0].replace(/^---\n.*?\n---\n/s, ''),
              slug: el.node.fileAbsolutePath.replace(/^.*\//, '').replace(/\..+$/, '')
            }
          }),
          count
        }} />
      </BlogLayout>
    </>
  )
}

export default Tagged
