import rawJson from '@/build/raw.json'
import { IPost } from '@/types/post'

export default ({ slug }: {
  slug: string
}) => {
  const r: IPost = rawJson[slug] || {}
  return {
    slug,
    ...r
  }
}
