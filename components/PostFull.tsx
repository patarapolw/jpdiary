import Link from 'next/link'
import Router from 'next/router'
import { Component } from 'react'

import { fixDOM } from '@/assets/fix-html'
import { initRemark42 } from '@/assets/remark42'
import sExtra from '@/styles/extra.module.scss'
import sMargin from '@/styles/margin.module.scss'
import { IPost } from '@/types/post'

import PostHeader from './PostHeader'

interface IProp {
  post: IPost
}

export default class PostFull extends Component<IProp> {
  render () {
    const { post } = this.props

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
}

Router.events.on('routeChangeComplete', () => {
  if (typeof window !== 'undefined') {
    const mainEl = document.querySelector('main')
    if (mainEl) {
      fixDOM(mainEl)
    }

    const { REMARK42 } = window as any
    if (REMARK42) {
      REMARK42.destroy()
    }

    initRemark42(location.origin + location.pathname)
  }
})

Router.events.on('beforeHistoryChange', () => {
  if (typeof window !== 'undefined') {
    const { REMARK42 } = window as any
    if (REMARK42) {
      REMARK42.destroy()
    }
  }
})
