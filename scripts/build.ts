import dayjs from 'dayjs'
import fg from 'fast-glob'
import fs from 'fs'
import yaml from 'js-yaml'
import lunr from 'lunr'
import path from 'path'
import rimraf from 'rimraf'
import * as z from 'zod'

import { IPost } from '@/types/post'

export async function buildIndexes () {
  const buildPath = (p: string) => path.join(__dirname, '../build', p)
  const contentPath = (p: string) => path.join(__dirname, '../_posts', p)

  await new Promise((resolve, reject) => {
    rimraf(buildPath('*.json'), (e) => (e ? reject(e) : resolve()))
  })

  const files = await fg(contentPath('**/*.md'))
  const rawJson: IPost[] = []

  files.map((f) => {
    const slug = f.replace(/^.+\//, '').replace(/\.md/, '')
    let header: Record<string, any> = {}
    let markdown = fs.readFileSync(f, 'utf8')
    let excerpt = markdown

    if (markdown.startsWith('---\n')) {
      const [h, c = ''] = markdown.substr(4).split(/---\n(.*)$/s)
      header = yaml.safeLoad(h, {
        schema: yaml.JSON_SCHEMA
      })
      excerpt = c.split(/<!-- excerpt(?:_separator)? -->/)[0]
      markdown = c
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
      markdown
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
