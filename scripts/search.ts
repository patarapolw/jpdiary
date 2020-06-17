import dayjs from 'dayjs'
import lunr, { Index } from 'lunr'

import idxJson from '@/build/idx.json'
import rawJson from '@/build/raw.json'
import { IPost } from '@/types/post'

let idx: Index

export default ({ q = '', tag, offset = 0 }: {
  q?: string
  tag?: string
  offset?: number
} = {}) => {
  let allData: IPost[]

  if (q) {
    idx = idx || lunr.Index.load(idxJson)

    allData = idx.search(q).map(({ ref }) => {
      const data = rawJson[ref]
      return {
        slug: ref,
        ...data
      }
    })
  } else {
    allData = Object.keys(rawJson).map((ref) => {
      const data = rawJson[ref]
      return {
        slug: ref,
        ...data
      }
    })
  }

  if (tag) {
    allData = allData.filter((d) => d.tag && d.tag.includes(tag))
  }

  const count = allData.length
  const result = allData
    .sort(({ date: a }, { date: b }) => {
      return a ? (b ? dayjs(b).toISOString().localeCompare(dayjs(a).toISOString()) : -1) : 1
    })
    .slice(offset, offset + 5)

  return {
    count,
    result
  }
}
