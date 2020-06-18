import { graphql, Link, useStaticQuery } from 'gatsby'
import React, { useState } from 'react'

const query = graphql`
  query BlogLayout {
    site {
      siteMetadata {
        banner
      }
    }
  }
`

const BlogLayout = ({ children }: {
  children: React.ReactNode
}) => {
  const [isNavExpanded, setNavExpanded] = useState(false)
  const {
    site: {
      siteMetadata: {
        banner
      }
    }
  } = useStaticQuery(query)

  return (
    <section>
      <nav className="navbar has-shadow is-fixed-top" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link to="/" className="navbar-item">
            <h1 className="tw-font-bold">{banner}</h1>
          </Link>

          <a
            role="button"
            className={['navbar-burger', 'burger', isNavExpanded ? 'is-active' : ''].join(' ')}
            aria-label="menu"
            aria-expanded={isNavExpanded}
            onClick={() => setNavExpanded(!isNavExpanded)}
            onKeyPress={() => setNavExpanded(!isNavExpanded)}
            tabIndex={0}
            data-target="navbarMain">
            <span aria-hidden="true">-</span>
            <span aria-hidden="true">-</span>
            <span aria-hidden="true">-</span>
          </a>
        </div>

        <div id="navbarMain" className={['navbar-menu', isNavExpanded ? 'is-active' : ''].join(' ')}>
          {/* <div className="navbar-start">
          </div> */}
        </div>
      </nav>

      <article style={{ marginTop: '3.25rem' }}>
        <div className="container">
          <div className="columns">
            <main className="column is-8-desktop is-offset-2-desktop">
              {children}
            </main>
          </div>
        </div>
      </article>
    </section>
  )
}

export default BlogLayout
