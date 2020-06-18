import Prism from 'prismjs'
import { createRef, useEffect } from 'react'
import breaks from 'remark-breaks'
import parse from 'remark-parse'
import remark2react from 'remark-react'
import unified from 'unified'

const RemarkReact = ({ markdown }: {
  markdown: string
}) => {
  const root = createRef<HTMLDivElement>()

  useEffect(() => {
    const dom = root.current
    dom.querySelectorAll('iframe').forEach((el) => {
      const w = el.getAttribute('width')
      const h = el.getAttribute('height')

      el.style.width = w ? `${w}px` : el.style.width
      el.style.height = h ? `${h}px` : el.style.height
    })

    Prism.highlightAllUnder(dom)
  })

  return (
    <div className="content" ref={root}>
      {
        (unified()
          .use(parse)
          .use(breaks)
          .use(remark2react, {
            sanitize: false
          })
          .processSync(markdown) as any).result
      }
    </div>
  )
}

export default RemarkReact
