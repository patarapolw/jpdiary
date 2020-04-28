import { FastifyInstance } from 'fastify'

import { DbVocabModel } from '../db/mongo'
import { escapeRegExp } from '../util'

export default (f: FastifyInstance, _: any, next: () => void) => {
  f.post('/match', {
    schema: {
      tags: ['vocab'],
      summary: 'Query for a given vocab',
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
                  kanji: { type: 'array', items: { type: 'string' } },
                  reading: { type: 'array', items: { type: 'string' } },
                  info: { type: 'array', items: { type: 'string' } },
                  meaning: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          }
        }
      }
    }
  }, async (req) => {
    const { entry } = req.body

    const conds = [
      {
        $match: {
          $or: [
            { kanji: entry },
            { reading: entry }
          ]
        }
      }
    ]

    const rData = await DbVocabModel.aggregate([
      ...conds
    ])

    return {
      result: rData
    }
  })

  f.post('/q', {
    schema: {
      tags: ['vocab'],
      summary: 'Query for vocab',
      body: {
        type: 'object',
        required: ['entry'],
        properties: {
          entry: { type: 'string' },
          kanji: { type: 'string' },
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
                  kanji: { type: 'array', items: { type: 'string' } },
                  reading: { type: 'array', items: { type: 'string' } },
                  info: { type: 'array', items: { type: 'string' } },
                  meaning: { type: 'array', items: { type: 'string' } }
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
    const { entry, kanji, offset = 0, limit = 10 } = req.body

    const conds = [
      {
        $match: kanji ? {
          $and: [
            { kanji: new RegExp(`[${kanji}]`) },
            {
              $or: [
                { kanji: new RegExp(escapeRegExp(entry)) },
                { reading: new RegExp(escapeRegExp(entry)) }
              ]
            }
          ]
        } : {
          $or: [
            { kanji: new RegExp(escapeRegExp(entry)) },
            { reading: new RegExp(escapeRegExp(entry)) }
          ]
        }
      }
    ]

    const [rData, rCount] = await Promise.all([
      DbVocabModel.aggregate([
        ...conds,
        { $skip: offset },
        { $limit: limit }
      ]),
      DbVocabModel.aggregate([
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
      tags: ['vocab'],
      summary: 'Randomize a vocab given a limited set of Kanji',
      body: {
        type: 'object',
        properties: {
          kanji: { type: 'string' }
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
                  reading: { type: 'array', items: { type: 'string' } },
                  info: { type: 'array', items: { type: 'string' } },
                  meaning: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          }
        }
      }
    }
  }, async (req) => {
    const { kanji } = req.body
    const r = (await DbVocabModel.aggregate([
      {
        $match: {
          kanji: kanji ? new RegExp(`[${kanji}]`) : undefined
        }
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
