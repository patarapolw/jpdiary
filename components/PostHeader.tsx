import dayjs from 'dayjs'

import { IPost } from '@/types/post'
import sMargin from '@/styles/margin.module.scss'
import sExtra from '@/styles/extra.module.scss'
import config from '@/theme-config.json'
import { getGravatarUrl } from '@/assets/util'

interface IProp {
  post: IPost
}

const PostHeader = ({ post }: IProp) => {
  const dateString = (() => {
    const djs = post.date ? dayjs(post.date) : null
    if (djs && djs.isValid()) {
      return djs.format('ddd D MMMM YYYY')
    }
    return null
  })()

  return (
    <section className={[sMargin['mb-0_5'], 'post-meta'].join(' ')}>
      <a className="post-meta-author" href={config.author.url} target="_blank" rel="noreferrer noopener nofollow">
        <span>
          <img src={getGravatarUrl(config.author.email, 24)} alt={config.author.name} />
        </span>
        <span>{config.author.name}</span>
      </a>

      <div className={sExtra['flex-grow-1']}></div>

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
