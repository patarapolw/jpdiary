import { AppProps } from 'next/app'
import Head from 'next/head'

import config from '@/theme-config.json'

const MyApp = ({ Component, pageProps }: AppProps) => {
  console.log(pageProps)

  return (
    <>
      <Head>
        <title>{config.title}</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
