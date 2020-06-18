import styled from '@emotion/styled'
import dayjs from 'dayjs'
import { graphql, useStaticQuery } from 'gatsby'
import React from 'react'

import { getGravatarUrl } from '@/lib/gravatar'

interface IProp {
  post: any
}

const query = graphql`
  query PostHeader {
    site {
      siteMetadata {
        author {
          url
          email
          name
        }
      }
    }
  }
`

const PostHeader = ({ post }: IProp) => {
  const dateString = (() => {
    const djs = post.date ? dayjs(post.date) : null
    if (djs && djs.isValid()) {
      return djs.format('ddd D MMMM YYYY')
    }
    return null
  })()

  const {
    site: {
      siteMetadata: {
        author: {
          url: authorUrl,
          email: authorEmail,
          name: authorName
        }
      }
    }
  } = useStaticQuery(query)

  const Section = styled.section`
    display: flex;
    flex-direction: row;
    white-space: nowrap;
    overflow: auto;

    .post-meta-author {
      display: flex;
      flex-direction: row;
      white-space: nowrap;
      justify-content: center;
    }

    .post-meta-author img {
      border: none;
      display: block;
      width: 24px;
      min-width: 24px;
    }

    .post-meta-author span + span {
      margin-left: 0.5rem;
    }
  `

  return (
    <Section className="tw-mb-2">
      <a className="post-meta-author" href={authorUrl} target="_blank" rel="noreferrer noopener nofollow">
        <span>
          <img src={getGravatarUrl(authorEmail, 24)} alt={authorName} />
        </span>
        <span>{authorName}</span>
      </a>

      <div className="tw-flex-grow"></div>

      {dateString ? <div>{dateString}</div> : null}
    </Section>
  )
}

export default PostHeader
