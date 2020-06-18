const fs = require('fs')
const path = require('path')
const lunr = require('lunr')

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  createTypes(/* graphql */`
    type Mdx implements Node {
      frontmatter: MdxFrontmatter!
    }

    type MdxFrontmatter {
      title: String!
      date: String
      tag: [String!]
      image: String
    }

    type SitePage @infer {
      context: SitePageContext!
    }

    type SitePageContext @dontInfer {
      slug: String!
      title: String!
      tag: [String!]
      excerpt: String!
      excerptBody: String!
      body: String!
      date: String
      image: String
    }
  `)
}

exports.createPages = async ({ graphql, actions }) => {
  const {
    data: {
      allMdx: {
        edges
      }
    }
  } = await graphql(/* graphql */`
    query {
      allMdx {
        edges {
          node {
            excerpt(truncate: true)
            fileAbsolutePath
            frontmatter {
              title
              tag
              date
            }
            rawBody
            body
          }
        }
      }
    }
  `)

  const { createPage } = actions

  const tagMap = new Map()
  const rawJson = []

  edges.map(({
    node: {
      excerpt,
      fileAbsolutePath,
      frontmatter: {
        title,
        tag: postTag,
        date
      },
      rawBody,
      body
    }
  }) => {
    (postTag || []).map((t) => {
      tagMap.set(t, (tagMap.get(t) || 0) + 1)
    })

    let y = ''
    let mo = ''

    if (date) {
      const [_y, _mo] = date.split('T')[0].split('-')
      y = _y
      mo = _mo
    }

    const slug = fileAbsolutePath.replace(/^.*\//, '').replace(/.\.+$/, '')
    const excerptBody = rawBody.split(/<!-- excerpt -->/)[0].replace(/^---\n.*?\n---\n/s, '')

    rawJson.push({
      slug,
      title,
      tag: postTag,
      excerpt,
      excerptBody
    })

    createPage({
      path: date ? `/post/${y}/${mo}/${slug}` : `/post/${slug}`,
      component: path.resolve('./src/templates/post.tsx'),
      context: {
        slug,
        title,
        tag: postTag,
        date,
        excerptBody,
        body
      }
    })
  })

  fs.writeFileSync(
    './build/raw.json',
    JSON.stringify(
      rawJson.reduce((prev, { slug, ...p }) => ({ ...prev, [slug]: p }), {})
    )
  )

  fs.writeFileSync(
    './build/idx.json',
    JSON.stringify(
      lunr(function () {
        this.ref('slug')
        this.field('title', { boost: 5 })
        this.field('tag', { boost: 5 })
        this.field('excerpt')

        rawJson.map((doc) => {
          this.add(doc)
        })
      })
    )
  )

  Array.from(tagMap).map(([t, count]) => {
    Array(count).fill(null).map((_, i) => {
      createPage({
        path: i ? `/tag/${t}/${i + 1}` : `/tag/${t}`,
        component: path.resolve('./src/templates/tagged.tsx'),
        context: {
          skip: i * 5,
          tag: t
        }
      })
    })
  })

  Array(edges.length).fill(null).map((_, i) => {
    createPage({
      path: i ? `/blog/${i + 1}` : '/blog',
      component: path.resolve('./src/templates/blog.tsx'),
      context: {
        skip: i * 5
      }
    })
  })

  createPage({
    path: '/',
    component: path.resolve('./src/templates/blog.tsx'),
    context: {
      skip: 0
    }
  })
}
