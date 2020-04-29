import { FastifyInstance } from 'fastify'
import MeCab from 'mecab-lite'

export default (f: FastifyInstance, _: any, next: () => void) => {
  const mc = new MeCab()

  f.post('/split', {
    schema: {
      tags: ['lib'],
      summary: 'Cut Japanese text into segments (with MeCab)',
      body: {
        type: 'object',
        required: ['entry'],
        properties: {
          entry: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            result: { type: 'array', items: { type: 'string' } }
          }
        }
      }
    }
  }, async (req) => {
    const { entry } = req.body
    return {
      result: mc.wakatigakiSync(entry)
    }
  })

  next()
}
