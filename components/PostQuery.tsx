import { IPost } from '@/types/post'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import qs from 'query-string'

import sMargin from '@/styles/margin.module.scss'
import sExtra from '@/styles/extra.module.scss'
import Empty from './Empty'
import PostTeaser from './PostTeaser'
import Pagination from './Pagination'
import { normalizeArray } from '@/assets/util'

interface IProp {
  defaults: {
    posts: IPost[]
    count: number
  }
}

const PostQuery = ({ defaults }: IProp) => {
  const [count, setCount] = useState(defaults.count)
  const [posts, setPosts] = useState(defaults.posts)

  const { query: { q, page, tag } } = useRouter()
  const [isQReady, setQReady] = useState(!q)

  if (!isQReady) {
    useEffect(() => {
      (async () => {
        const { count, result } = await fetch(`/.netlify/functions/search?${qs.stringify({
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
        <header className={sMargin['m-1']}>
          Tag: <span className={sExtra.bold}>{tag}</span>
        </header>
      ) : null}

      {isQReady ? (
        posts.length > 0 ? (
          <article>
            {posts.map((p) => (
              <PostTeaser post={p} key={p.slug} />
            ))}
            <Pagination
              current={parseInt(normalizeArray(page) || '1')}
              total={count}
              q={normalizeArray(q)} />
          </article>
        ) : <Empty />
      ) : null /* Loading */}
    </section>
  )
}

export default PostQuery
