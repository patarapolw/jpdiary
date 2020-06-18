import { useRouter } from 'next/router'
import qs from 'query-string'
import { useEffect, useState } from 'react'

import { normalizeArray } from '@/assets/util'
import { IPost } from '@/types/post'

import Empty from './Empty'
import Pagination from './Pagination'
import PostTeaser from './PostTeaser'

const PostQuery = ({ defaults, author }: {
  defaults: {
    posts: IPost[]
    count: number
  }
  author: typeof import('@/theme-config.json')['author']
}) => {
  const [count, setCount] = useState(defaults.count)
  const [posts, setPosts] = useState(defaults.posts)

  const { query: { q, page, tag } } = useRouter()
  const [isQReady, setQReady] = useState(!q)

  if (!isQReady) {
    useEffect(() => {
      (async () => {
        const { count, result } = await fetch(`/api/search?${qs.stringify({
          q,
          offset: (parseInt(normalizeArray(page) || '1') - 1) * 5,
          tag
        })}`).then((r) => r.json())

        setCount(count)
        setPosts(result)
        setQReady(true)
      })().catch(console.error)
    }, [])
  }

  return (
    <section>
      {tag ? (
        <header className="tw-m-4">
          Tag: <span className="tw-text-bold">{tag}</span>
        </header>
      ) : null}

      {isQReady ? (
        posts.length > 0 ? (
          <article>
            {posts.map((p) => (
              <div className="post-query-entry" key={p.slug}>
                <PostTeaser post={p} author={author} />
              </div>
            ))}
            <Pagination
              current={parseInt(normalizeArray(page) || '1')}
              total={Math.ceil(count / 5)}
              q={normalizeArray(q)} />
          </article>
        ) : <Empty />
      ) : null /* Loading */}

      <style jsx>{`
      .post-query-entry {
        margin-top: 1rem;
      }
      `}</style>
    </section>
  )
}

export default PostQuery
