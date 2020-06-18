import Link from 'next/link'
import { createRef, useEffect } from 'react'

import { initRemark42 } from '@/assets/remark42'
import themeConfig from '@/theme-config.json'
import { IPost } from '@/types/post'

import PostHeader from './PostHeader'
import RemarkReact from './RemarkReact'

const PostFull = ({ post }: {
  post: IPost
}) => {
  const remarkRef = createRef<HTMLDivElement>()

  useEffect(() => {
    initRemark42(themeConfig.comment.remark42, location.origin + location.pathname)

    return () => {
      const { REMARK42 } = window as any
      if (REMARK42) {
        REMARK42.destroy()
      }
    }
  }, [remarkRef.current])

  return (
    <section>
      <article className="card tw-my-4">
        <div className="card-content content">
          <PostHeader post={post} />
          <h1 className="title">{post.title}</h1>

          {post.image ? (
            <div className="image-full">
              <img src={post.image} alt={post.title} />
            </div>
          ) : null}

          <RemarkReact markdown={post.markdown} />

          <div className="tw-break-word">
            <span>Tags: {(post.tag || []).map((t: string) => (
              <span className="u-tag" key={t}>
                <Link href={`/tag/${t}`}><a>{t}</a></Link>
              </span>
            ))}</span>
          </div>
        </div>
      </article>

      <footer className="card tw-my-4">
        <div className="card-content">
          <div id="remark42" ref={remarkRef}></div>
        </div>
      </footer>

      <style jsx>{`
      .u-tag + .u-tag {
        margin-left: 0.5em;
      }

      .image-full {
        text-align: center;
        margin: 1rem;
      }

      .image-full img {
        min-width: 500px;
        width: auto;
      }

      @media only screen and (max-width: 800px) {
        .image-full {
          margin-left: -1.5rem;
          margin-right: -1.5rem;
        }

        .image-full img {
          min-width: unset;
          width: auto;
        }
      }
      `}</style>
    </section>
  )
}

export default PostFull
