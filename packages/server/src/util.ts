import { spawn, ChildProcessWithoutNullStreams } from 'child_process'

export class MeCab {
  p: ChildProcessWithoutNullStreams

  constructor () {
    this.p = spawn('mecab')
  }

  async close () {
    return new Promise((resolve) => {
      this.p.stdin.end()
      this.p.once('close', resolve)
    })
  }

  async split (s: string): Promise<string[]> {
    const runner = new Promise<string[]>((resolve, reject) => {
      this.p.stdout.once('data', (data: Buffer) => {
        const ss = data.toString().split('\n').map(row => row.split('\t')[0])
        const eos = ss.indexOf('EOS')

        resolve(eos === -1 ? ss : ss.slice(0, eos))
      })

      this.p.once('error', reject)
    })

    this.p.stdin.write(s)
    this.p.stdin.write('\n')

    return runner
  }
}
