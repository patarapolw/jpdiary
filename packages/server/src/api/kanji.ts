import { FastifyInstance } from 'fastify'

import { DbCharacterModel } from '../db/mongo'

export default (f: FastifyInstance, _: any, next: () => void) => {
  f.post('/match', {
    schema: {
      tags: ['kanji'],
      summary: 'Find for a given kanji',
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
            result: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  kanji: { type: 'string' },
                  readings: { type: 'array', items: { type: 'string' } },
                  info: { type: 'array', items: { type: 'string' } },
                  meanings: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          }
        }
      }
    }
  }, async (req) => {
    const { entry } = req.body
    const rData = await DbCharacterModel.findOne({ kanji: entry })

    return {
      result: rData || {}
    }
  })

  f.post('/q', {
    schema: {
      tags: ['kanji'],
      summary: 'Query for kanji',
      body: {
        type: 'object',
        required: ['cond'],
        properties: {
          cond: { type: 'object' },
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
                properties: {
                  kanji: { type: 'string' },
                  readings: { type: 'array', items: { type: 'string' } },
                  info: { type: 'array', items: { type: 'string' } },
                  meanings: { type: 'array', items: { type: 'string' } }
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
    const { cond, offset = 0, limit = 10 } = req.body

    const conds = [
      {
        $match: cond
      }
    ]

    const [rData, rCount] = await Promise.all([
      DbCharacterModel.aggregate([
        ...conds,
        { $skip: offset },
        { $limit: limit }
      ]),
      DbCharacterModel.aggregate([
        ...conds,
        { $count: 'count' }
      ])
    ])

    return {
      result: rData,
      count: (rCount[0] || {}).count || 0,
      offset,
      limit
    }
  })

  f.post('/random', {
    schema: {
      tags: ['kanji'],
      summary: 'Randomize a Kanji',
      body: {
        type: 'object',
        required: ['cond'],
        properties: {
          cond: { type: 'object' }
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
                properties: {
                  kanji: { type: 'array', items: { type: 'string' } },
                  readings: { type: 'array', items: { type: 'string' } },
                  info: { type: 'array', items: { type: 'string' } },
                  meanings: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          }
        }
      }
    }
  }, async (req) => {
    const { cond } = req.body

    const r = (await DbCharacterModel.aggregate([
      {
        $match: cond
      },
      {
        $sample: { size: 1 }
      }
    ]))

    return {
      result: r[0]
    }
  })

  next()
}
