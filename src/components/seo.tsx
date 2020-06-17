import { useLocation } from '@reach/router'
import { graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import { Helmet } from 'react-helmet'

const query = graphql`
  query SEO {
    site {
      siteMetadata {
        defaultTitle: title
        defaultDescription: description
        baseUrl
        keywords
        analytics {
          plausible
        }
      }
    }
  }
`

const SEO = ({ title, description, image, article, tag }: {
  title?: string
  description?: string
  image?: string
  article?: boolean
  tag?: string[]
}) => {
  const { pathname } = useLocation()
  const {
    site: {
      siteMetadata: {
        defaultTitle,
        defeaultDescription,
        baseUrl,
        keywords,
        analytics: {
          plausible
        }
      }
    }
  } = useStaticQuery(query)

  const seo = {
    image: (image ? `${baseUrl}${image}` : null) as string | null,
    fullUrl: `${baseUrl}${pathname}`,
    title: title ? `${title} - ${defaultTitle}` : defaultTitle,
    description: description || defeaultDescription
  }

  return (
    <Helmet title={seo.title}>
      <meta property="og:url" content={seo.fullUrl} />

      <meta property="og:title" content={seo.title} />
      <meta name="twitter:title" content={seo.title} />

      <meta name="keywords" content={(tag || keywords).join(',')} />

      {seo.image ? <meta name="image" content={seo.image} /> : null}
      {seo.image ? <meta property="og:image" content={seo.image} /> : null}
      {seo.image ? <meta name="twitter:image" content={seo.image} /> : null}

      {article ? <meta property="og:type" content="article" /> : null}

      <meta name="description" content={seo.description} />
      <meta property="og:description" content={seo.description} />
      <meta name="twitter:description" content={seo.description} />

      <meta name="twitter:card" content="summary_large_image" />

      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css"/>
      <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>

      {/* {sidebarTwitter ? (
        <script async charSet="utf8" src="https://platform.twitter.com/widgets.js"></script>
      ) : null} */}

      <script async defer src="https://plausible.io/js/plausible.js" data-domain={plausible}></script>
    </Helmet>
  )
}

export default SEO
