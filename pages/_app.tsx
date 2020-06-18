import '@/styles/tailwind.css'

import { NextSeo } from 'next-seo'
import App, { AppProps } from 'next/app'

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
        <NextSeo title={title} />
        <Component {...pageProps} />
      </>
    )
  }
}
