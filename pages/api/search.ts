import { NextApiRequest, NextApiResponse } from 'next'

import { normalizeArray } from '@/assets/util'
import search from '@/scripts/search'

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { q, tag, offset } = req.query

  const r = search({
    q: normalizeArray(q),
    tag: normalizeArray(tag),
    offset: parseInt(normalizeArray(offset) || '0')
  })

  res.status(200).json(r)
}
