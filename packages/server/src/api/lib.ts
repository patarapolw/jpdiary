import { FastifyInstance } from 'fastify'

import { mecab } from '../util'

export default (f: FastifyInstance, _: any, next: () => void) => {
  f.post('/split', {
    schema: {
      tags: ['lib'],
      summary: 'Cut Japanese text into segments',
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
      result: mecab(entry)
    }
  })

  next()
}
