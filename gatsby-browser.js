import 'bulma/bulma.sass'
import '@fortawesome/fontawesome-free/scss/fontawesome.scss'
import './src/styles/tailwind.css'

import Prism from 'prismjs'

import themeConfig from './theme-config.json'

function fixDOM (dom) {
  dom.querySelectorAll('iframe').forEach((el) => {
    const w = el.getAttribute('width')
    const h = el.getAttribute('height')

    el.style.width = w ? `${w}px` : el.style.width
    el.style.height = h ? `${h}px` : el.style.height
  })

  Prism.highlightAllUnder(dom)

  return dom
}

let initRemark42Timeout

function initRemark42 (url) {
  if (initRemark42Timeout) {
    clearTimeout(initRemark42Timeout)
  }

  initRemark42Timeout = setTimeout(() => {
    // eslint-disable-next-line camelcase
    const remark_config = {
      host: themeConfig.comment.remark42.host, // hostname of remark server, same as REMARK_URL in backend config, e.g. "https://demo.remark42.com"
      site_id: themeConfig.comment.remark42.siteId,
      components: ['embed'], // optional param; which components to load. default to ["embed"]
      // to load all components define components as ['embed', 'last-comments', 'counter']
      // available component are:
      //     - 'embed': basic comments widget
      //     - 'last-comments': last comments widget, see `Last Comments` section below
      //     - 'counter': counter widget, see `Counter` section below
      url, // optional param; if it isn't defined
      // `window.location.origin + window.location.pathname` will be used,
      //
      // Note that if you use query parameters as significant part of url
      // (the one that actually changes content on page)
      // you will have to configure url manually to keep query params, as
      // `window.location.origin + window.location.pathname` doesn't contain query params and
      // hash. For example default url for `https://example/com/example-post?id=1#hash`
      // would be `https://example/com/example-post`.
      //
      // The problem with query params is that they often contain useless params added by
      // various trackers (utm params) and doesn't have defined order, so Remark treats differently
      // all this examples:
      // https://example.com/?postid=1&date=2007-02-11
      // https://example.com/?date=2007-02-11&postid=1
      // https://example.com/?date=2007-02-11&postid=1&utm_source=google
      //
      // If you deal with query parameters make sure you pass only significant part of it
      // in well defined order
      max_shown_comments: 10, // optional param; if it isn't defined default value (15) will be used
      // theme: , // optional param; if it isn't defined default value ('light') will be used
      // page_title: 'Moving to Remark42', // optional param; if it isn't defined `document.title` will be used
      locale: 'en' // set up locale and language, if it isn't defined default value ('en') will be used,
    }

  // eslint-disable-next-line camelcase
  ;(window).remark_config = remark_config
    document.querySelectorAll('script.remark42-script').forEach((el) => el.remove())

    ;(function (c) {
      for (let i = 0; i < c.length; i++) {
        const d = document
        const s = d.createElement('script')
        s.className = 'remark42-script'
        s.src = remark_config.host + '/web/' + c[i] + '.js'
        s.defer = true
        ;(d.head || d.body).appendChild(s)
      }
    })(remark_config.components || ['embed'])
  }, 1000)
}

const observer = new MutationObserver((muts) => {
  muts.forEach((mut) => {
    mut.addedNodes.forEach((addedNode) => {
      if (addedNode instanceof HTMLElement) {
        const mainEl = document.querySelector('main')

        if (mainEl) {
          fixDOM(mainEl)
        }

        const remarkEl = document.querySelector('#remark42')

        if (remarkEl) {
          const { REMARK42 } = window
          if (REMARK42) {
            REMARK42.destroy()
          }

          initRemark42(location.origin + location.pathname)
        }
      }
    })
  })
})

observer.observe(document.body, {
  subtree: true,
  childList: true,
  characterData: true,
  attributes: true,
  attributeFilter: ['id']
})

export const onPreRouteUpdate = () => {
  const { REMARK42 } = window
  if (REMARK42) {
    REMARK42.destroy()
  }
}
