import '@/styles/tailwind.css'

import App, { AppProps } from 'next/app'
import Head from 'next/head'

export default class MyApp extends App<AppProps & { title: string }> {
  static async getInitialProps ({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    const { default: { title } } = await import('@/theme-config.json')

    return { pageProps, title }
  }

  render () {
    const { title, Component, pageProps } = this.props

    return (
      <>
        <Head>
          <title>{title}</title>
        </Head>
        <Component {...pageProps} />
      </>
    )
  }
}
