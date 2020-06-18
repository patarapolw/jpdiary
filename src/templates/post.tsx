import React from 'react'

import BlogLayout from '@/components/layouts/BlogLayout'
import PostFull from '@/components/PostFull'
import SEO from '@/components/seo'

const Post = ({ pageContext: p }: {
  pageContext: {
    id: string
    slug: string
    title: string
    tag?: string[]
    date: string
    excerpt: string
    body: string
  }
}) => {
  return (
    <>
      <SEO
        title={p.title}
        description={p.excerpt}
        // image={p.image}
        tag={p.tag} />
      <BlogLayout>
        <PostFull post={p} />
      </BlogLayout>
    </>
  )
}

export default Post
