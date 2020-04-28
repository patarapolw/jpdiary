import { FastifyInstance } from 'fastify'

export default (f: FastifyInstance, _: any, next: () => void) => {
  f.post('/q', {
    schema: {
      tags: ['sentence'],
      summary: 'Query for a given sentence',
      body: {
        type: 'object',
        required: ['entry'],
        properties: {
          entry: { type: 'string' },
          offset: { type: 'integer' },
          limit: { type: 'integer' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            result: {
              type: 'array',
              items: {
                type: 'object',
                required: ['chinese', 'english'],
                properties: {
                  chinese: { type: 'string' },
                  pinyin: { type: 'string' },
                  english: { type: 'string' }
                }
              }
            },
            count: { type: 'integer' },
            offset: { type: 'integer' },
            limit: { type: 'integer' }
          }
        }
      }
    }
  }, async (req) => {
    const { entry, offset = 0, limit = 10 } = req.body

    return {
      result: stmt.sentenceQ({
        offset, limit
      }).all(`%${entry}%`),
      count: (stmt.sentenceQCount.get(`%${entry}%`) || {}).count || 0,
      offset,
      limit
    }
  })

  next()
}
