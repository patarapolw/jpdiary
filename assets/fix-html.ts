import Prism from 'prismjs'

export function fixDOM(dom: Element) {
  dom.querySelectorAll('iframe').forEach((el) => {
    const w = el.getAttribute('width')
    const h = el.getAttribute('height')

    el.style.width = w ? `${w}px` : el.style.width
    el.style.height = h ? `${h}px` : el.style.height
  })

  Prism.highlightAllUnder(dom)

  return dom
}
