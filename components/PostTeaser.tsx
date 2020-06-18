import dayjs from 'dayjs'
import Link from 'next/link'

import { IPost } from '@/types/post'

import PostHeader from './PostHeader'
import RemarkReact from './RemarkReact'

const PostTeaser = ({ post, author }: {
  post: IPost
  author: typeof import('@/theme-config.json')['author']
}) => {
  const postUrl = (() => {
    const { date, slug } = post
    if (date) {
      const d = dayjs(date).toDate()
      return `/post/${d.getFullYear().toString()}/${(d.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${slug}`
    }
    return `/post/${slug}`
  })()

  return (
    <section className="card">
      <article className="card-content">
        <PostHeader post={post} author={author} />
        <div className="post-content">
          {post.image ? (
            <div className="image-teaser">
              <img src={post.image} alt={post.title} />
            </div>
          ) : null}

          <Link href={postUrl}>
            <a className="header-link">
              <h2 className="title">{post.title}</h2>
            </a>
          </Link>

          <RemarkReact markdown={post.excerpt} />
        </div>
      </article>

      <style jsx>{`
      .header-link h2:hover {
        color: red;
      }

      .content {
        width: 100%;
        margin: 0;
        max-width: 80vw;
      }

      .post-content {
        width: 100%;
        overflow: visible;
      }

      .image-teaser {
        width: calc(100% + 3rem);
        margin-top: 1rem;
        margin-bottom: 1rem;
        margin-left: -1.5rem;
        margin-right: -1.5rem;
      }

      @media only screen and (min-width: 800px) {
        .image-teaser {
          width: 100%;
          max-width: 300px;
          max-height: 300px;
          float: right;
          margin: 1rem;
        }

        .post-content {
          overflow: auto;
        }
      }
      `}</style>
    </section>
  )
}

export default PostTeaser
