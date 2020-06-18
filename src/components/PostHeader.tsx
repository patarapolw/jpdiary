import styled from '@emotion/styled'
import dayjs from 'dayjs'
import { useStaticQuery } from 'gatsby'
import React from 'react'
import tw from 'tailwind.macro'

import { getGravatarUrl } from '@/lib/gravatar'

interface IProp {
  post: any
}

declare const query: any

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
    ${tw`mb-2`}

    .tw-flow-grow-1 {
      ${tw`flex-grow`}
    }

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
    <Section>
      <a className="post-meta-author" href={authorUrl} target="_blank" rel="noreferrer noopener nofollow">
        <span>
          <img src={getGravatarUrl(authorEmail, 24)} alt={authorName} />
        </span>
        <span>{authorName}</span>
      </a>

      <div className="tw-flex-grow-1"></div>

      {dateString ? <div>{dateString}</div> : null}
    </Section>
  )
}

export default PostHeader
