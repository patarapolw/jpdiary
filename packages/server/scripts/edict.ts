import fs from 'fs'

// @ts-ignore
import { Iconv } from 'iconv'
import mongoose from 'mongoose'

import 'log-buffer'

import { DbVocabModel } from '../src/db/mongo'

/**
 * KANJI-1;KANJI-2 [KANA-1;KANA-2] /(general information) (see xxxx) gloss/gloss/.../
 *
 * 収集(P);蒐集;拾集;収輯 [しゅうしゅう] /(n,vs) gathering up/collection/accumulation/(P)/
 *
 * In addition, the EDICT2 has as its last field the sequence number of the entry.
 * This matches the "ent_seq" entity value in the XML edition. The field has the format: EntLnnnnnnnnX.
 * The EntL is a unique string to help identify the field.
 * The "X", if present, indicates that an audio clip of the entry reading is available from the JapanesePod101.com site.
 */
async function readEdict () {
  const rows: any[] = []
  const promises: Promise<any>[] = []

  const parseRow = async (r: string) => {
    let [ks, remaining = ''] = r.split(/ (.*)$/g)
    if (!ks) {
      return
    }

    const kanji = ks.split(';')

    let readings: string[] = []
    if (remaining.startsWith('[')) {
      const [rs, remaining1 = ''] = remaining.slice(1).split(/\] (.*)$/g)
      readings = rs.split(';')
      remaining = remaining1
    }

    const info: string[] = []
    let meanings: string[] = []
    let ent_seq: string | undefined
    if (remaining.startsWith('/')) {
      meanings = remaining.slice(1).split('/').filter(r => r)
      if (meanings[0]) {
        meanings[0] = meanings[0].replace(/\((.+?)\)/g, (_, p1) => {
          info.push(p1)
          return ''
        }).trim()
      }

      const last = meanings[meanings.length - 1] || ''
      if (last.startsWith('EntL')) {
        ent_seq = last
        meanings.pop()
      }
    }

    rows.push({
      kanji,
      readings,
      info,
      meanings,
      ent_seq
    })

    if (rows.length > 1000) {
      const rs = rows.splice(0, 1000)
      await DbVocabModel.insertMany(rs)
    }
  }

  return new Promise((resolve, reject) => {
    let s = ''
    fs.createReadStream('/Users/patarapolw/Dropbox/Chinese/edict2')
      .pipe(new Iconv('EUC-JP', 'UTF-8'))
      .on('data', (d: Buffer) => {
        s += d.toString()
        const rows = s.split('\n')
        s = rows.splice(rows.length - 1, 1)[0]
        rows.map((r) => {
          promises.push(parseRow(r))
        })
      })
      .on('error', reject)
      .on('end', async () => {
        promises.push(
          parseRow(s),
          DbVocabModel.insertMany(rows)
        )

        await Promise.all(promises)
        resolve()
      })
  })
}

async function main () {
  const client = await mongoose.connect(process.env.MONGO_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })

  await readEdict()

  client.disconnect()
}

if (require.main === module) {
  main()
}
