import Link from 'next/link'
import { useEffect } from 'react'

import { fixDOM } from '@/assets/fix-html'
import { initRemark42 } from '@/assets/remark42'
import sExtra from '@/styles/extra.module.scss'
import sMargin from '@/styles/margin.module.scss'
import themeConfig from '@/theme-config.json'
import { IPost } from '@/types/post'

import PostHeader from './PostHeader'

declare global {
  interface Window {
    remark42Observer: MutationObserver
  }
}

const PostFull = ({ post }: {
  post: IPost
}) => {
  useEffect(() => {
    if (!window.remark42Observer) {
      window.remark42Observer = new MutationObserver((muts) => {
        muts.map((mut) => {
          mut.addedNodes.forEach((n) => {
            if (n instanceof HTMLElement) {
              const mainEl = n.querySelector('main')
              if (mainEl) {
                fixDOM(n)
              }

              const remarkEl = n.querySelector('#remark42')

              if (remarkEl) {
                const { REMARK42 } = window as any
                if (REMARK42) {
                  REMARK42.destroy()
                }

                initRemark42(themeConfig.comment.remark42, location.origin + location.pathname)
              }
            }
          })

          mut.removedNodes.forEach((n) => {
            if (n instanceof HTMLElement) {
              const remarkEl = n.querySelector('#remark42')
              const { REMARK42 } = window as any
              if (REMARK42) {
                REMARK42.destroy()
              }
            }
          })
        })
      })

      window.remark42Observer.observe(document.body, {
        childList: true,
        characterData: true,
        subtree: true
      })

      const remarkEl = document.querySelector('#remark42')

      if (remarkEl) {
        const { REMARK42 } = window as any
        if (REMARK42) {
          REMARK42.destroy()
        }

        initRemark42(themeConfig.comment.remark42, location.origin + location.pathname)
      }
    }
  }, [])

  return (
    <section>
      <article className={sMargin['my-1']}>
        <div className="card-content content">
          <PostHeader post={post} />
          <h1 className="title">{post.title}</h1>

          {post.image ? (
            <div className="image-full">
              <img src={post.image} alt={post.title} />
            </div>
          ) : null}

          <div dangerouslySetInnerHTML={{ __html: post.html }}></div>
          <div className={sExtra['break-word']}>
            <span>Tags: {(post.tag || []).map((t: string) => (
              <span className="u-tag" key={t}>
                <Link href={`/tag/${t}`}><a>{t}</a></Link>
              </span>
            ))}</span>
          </div>
        </div>
      </article>

      <footer className={['card', sMargin['my-1']].join(' ')}>
        <div className="card-content">
          <div id="remark42"></div>
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
