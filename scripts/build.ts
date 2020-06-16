import fs from 'fs'
import fg from 'fast-glob'
import yaml from 'js-yaml'
import rimraf from 'rimraf'
import * as z from 'zod'
import lunr from 'lunr'
import dayjs from 'dayjs'
import MakeHtml from './make-html'

export async function buildIndexes() {
  await new Promise((resolve, reject) => {
    rimraf('./build/*.json', (e) => (e ? reject(e) : resolve()))
  })

  const files = await fg('content/**/*.md')
  const rawJson: any[] = []

  files.map((f) => {
    const slug = f.replace(/^.+\//, '').replace(/\.md/, '')
    let header: Record<string, any> = {}
    const md = fs.readFileSync(f, 'utf8')
    const makeHtml = new MakeHtml(slug)
    let excerptMarkdown = md

    if (md.startsWith('---\n')) {
      const [h, c = ''] = md.substr(4).split(/---\n(.*)$/s)
      header = yaml.safeLoad(h, {
        schema: yaml.JSON_SCHEMA
      })
      excerptMarkdown = c.split(/<!-- excerpt(?:_separator)? -->/)[0]
    }

    const p = {
      slug,
      title: header.title,
      date: header.date ? dayjs(header.date).toISOString() : undefined,
      image: header.image,
      tag: z
        .array(z.string())
        .parse(header.tag || [])
        .map((t) => t.toLocaleLowerCase().replace(/ /g, '-')),
      excerptMarkdown,
      excerpt: makeHtml.render(excerptMarkdown),
      html: makeHtml.render(md)
    }

    rawJson.push(p)
  })

  fs.writeFileSync(
    './build/raw.json',
    JSON.stringify(
      rawJson.reduce((prev, { slug, ...p }) => ({ ...prev, [slug]: p }), {})
    )
  )
  fs.writeFileSync(
    './build/idx.json',
    JSON.stringify(
      lunr(function() {
        this.ref('slug')
        this.field('title', { boost: 5 })
        this.field('tag', { boost: 5 })
        this.field('excerpt')

        rawJson.map((doc) => {
          doc.excerpt = doc.excerptMarkdown
          this.add(doc)
        })
      })
    )
  )
  fs.writeFileSync(
    './build/tag.json',
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
