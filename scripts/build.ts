import dayjs from 'dayjs'
import fg from 'fast-glob'
import fs from 'fs'
import yaml from 'js-yaml'
import lunr from 'lunr'
import path from 'path'
import rimraf from 'rimraf'
import * as z from 'zod'

import { IPost } from '@/types/post'

import MakeHtml from './make-html'

export async function buildIndexes () {
  const buildPath = (p: string) => path.join(__dirname, '../build', p)
  const contentPath = (p: string) => path.join(__dirname, '../content', p)

  await new Promise((resolve, reject) => {
    rimraf(buildPath('*.json'), (e) => (e ? reject(e) : resolve()))
  })

  const files = await fg(contentPath('**/*.md'))
  const rawJson: IPost[] = []

  files.map((f) => {
    const slug = f.replace(/^.+\//, '').replace(/\.md/, '')
    let header: Record<string, any> = {}
    const md = fs.readFileSync(f, 'utf8')
    const makeHtml = new MakeHtml(slug)
    let excerpt = md

    if (md.startsWith('---\n')) {
      const [h, c = ''] = md.substr(4).split(/---\n(.*)$/s)
      header = yaml.safeLoad(h, {
        schema: yaml.JSON_SCHEMA
      })
      excerpt = c.split(/<!-- excerpt(?:_separator)? -->/)[0]
    }

    const p = {
      slug,
      title: z.string().parse(header.title),
      date: header.date ? dayjs(header.date).toISOString() : undefined,
      image: z.string().optional().parse(header.image),
      tag: z
        .array(z.string())
        .parse(header.tag || [])
        .map((t) => t.toLocaleLowerCase().replace(/ /g, '-')),
      excerpt,
      excerptHtml: makeHtml.render(excerpt),
      html: makeHtml.render(md)
    }

    rawJson.push(p)
  })

  fs.writeFileSync(
    buildPath('raw.json'),
    JSON.stringify(
      rawJson.reduce((prev, { slug, ...p }) => ({ ...prev, [slug]: p }), {})
    )
  )
  fs.writeFileSync(
    buildPath('idx.json'),
    JSON.stringify(
      lunr(function () {
        this.ref('slug')
        this.field('title', { boost: 5 })
        this.field('tag', { boost: 5 })
        this.field('excerpt')

        rawJson.map((doc) => {
          this.add(doc)
        })
      })
    )
  )
  fs.writeFileSync(
    buildPath('tag.json'),
    JSON.stringify(
      rawJson.reduce((prev, { tag = [] }) => {
        const ts: string[] = tag

        ts.map((t) => {
          prev[t] = (prev[t] || 0) + 1
        })

        return prev
      }, {})
    )
  )
}

if (require.main === module) {
  buildIndexes()
}
