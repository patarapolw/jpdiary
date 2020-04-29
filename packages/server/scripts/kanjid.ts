import fs from 'fs'

// @ts-ignore
import { Iconv } from 'iconv'
import mongoose from 'mongoose'
import XRegExp from 'xregexp'

import 'log-buffer'

import { DbCharacterModel } from '../src/db/mongo'

/**
 * - the KANJIDIC and KANJD212 files are text files with one line per kanji and the information fields
 * separated by spaces. The format of each line is:
 *   - the kanji itself followed by the hexadecimal form of the JIS ku-ten coding, e.g. "亜 3021"
 * (the decimal ku-ten code is 16-01);
 *   - information fields beginning with one or two-letter codes as per the table below. For example "S10" indicates a stroke count of 10;
 *   - the Japanese readings of the kanji. ON readings (音読み) are generally in katakana and KUN readings (訓読み) in hiragana. An exception is the set of kokuji for measurements such as centimetres, where the reading is in katakana. Hyphens are used to indicate prefixes/suffixes, and '.' indicates the portion of the reading that is okurigana. There may be several classes of reading fields, with ordinary readings first, followed by members of the other classes, if any. The current other classes, and their tagging, are:
 *     - where the kanji has special nanori (i.e. name) readings, these are preceded the marker "T1";
 *     - where the kanji is a radical, and the radical name is not already a reading, the radical name is preceded the marker "T2".
 *   - the meanings (usually in English). Each field begins with an open brace '{' and ends at the next close brace '}'.
 */
async function readKanjiDic (src: string) {
  const rows: any[] = []
  const promises: Promise<any>[] = []

  const parseRow = async (r: string) => {
    const [ks, remaining = ''] = r.split(/ (.*)$/g)
    if (!ks) {
      return
    }

    const kanji = ks

    const readings: string[] = []
    const info: string[] = []
    const meanings = (remaining.match(/\{(.+?)\}/g) || []).map(r => r.slice(1, r.length - 1))

    remaining.replace(/\{.+?\}/g, '').split(' ').filter(r => r).map((r) => {
      if (XRegExp('[\\p{Hiragana}\\p{Katakana}]').test(r)) {
        readings.push(r)
      } else {
        info.push(r)
      }
    })

    rows.push({
      kanji,
      readings,
      info,
      meanings
    })

    if (rows.length > 1000) {
      const rs = rows.splice(0, 1000)
      await DbCharacterModel.insertMany(rs)
    }
  }

  return new Promise((resolve, reject) => {
    let s = ''
    fs.createReadStream(`/Users/patarapolw/Dropbox/Chinese/${src}`)
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
          DbCharacterModel.insertMany(rows)
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

  await readKanjiDic('kanjidic')
  await readKanjiDic('kanjd212')

  client.disconnect()
}

if (require.main === module) {
  main()
}
