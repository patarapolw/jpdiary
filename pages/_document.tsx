import dotProp from 'dot-prop-immutable'
import Document, { Head, Html, Main, NextScript } from 'next/document'

import config from '@/theme-config.json'

export default class MyDocument extends Document {
  render () {
    const sidebarTwitter = dotProp.get(config, 'sidebar.twitter')
    const plausible = config.analytics.plausible

    return (
      <Html lang="en">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8"/>
          <meta name="keywords" content={config.keywords.join(',')} />
          <meta name="description" content={config.description} />

          {sidebarTwitter ? (
            <script async charSet="utf8" src="https://platform.twitter.com/widgets.js"></script>
          ) : null}

          {plausible ? (
            <script async defer src="https://plausible.io/js/plausible.js" data-domain={plausible}></script>
          ) : null}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
