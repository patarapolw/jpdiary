declare module 'mecab-lite' {
  class MeCab {
    parseSync(text: string): string[][]
    wakatigakiSync(text: string): string[]

    parse(text: string, cb: (err: any, items: string[][]) => void): void
    wakatigaki(text: string, cb: (err: any, items: string[]) => void): void

    /**
     * @default "/usr/local/bin/mecab"
     */
    MECAB: string
    ENCODING: 'SHIFT_JIS' | 'UTF-8'
    /**
     * @default process.env['HOME'] + '/tmp'
     */
    TMP_DIR: string
  }

  export = MeCab
}
