import dayjs from 'dayjs'

import { getGravatarUrl } from '@/assets/gravatar'
import config from '@/theme-config.json'
import { IPost } from '@/types/post'

const PostHeader = ({ post }: {
  post: IPost
}) => {
  const dateString = (() => {
    const djs = post.date ? dayjs(post.date) : null
    if (djs && djs.isValid()) {
      return djs.format('ddd D MMMM YYYY')
    }
    return null
  })()

  return (
    <section className="tw-mb-2 post-meta">
      <a className="post-meta-author" href={config.author.url} target="_blank" rel="noreferrer noopener nofollow">
        <span>
          <img src={getGravatarUrl(config.author.email, 64)} alt={config.author.name} />
        </span>
        <span>{config.author.name}</span>
      </a>

      <div className="tw-flex-grow"></div>

      {dateString ? <div>{dateString}</div> : null}

      <style jsx>{`
      .post-meta {
        display: flex;
        flex-direction: row;
        white-space: nowrap;
        overflow: auto;
      }

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
      `}</style>
    </section>
  )
}

export default PostHeader
