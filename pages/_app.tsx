import { AppProps } from 'next/app'
import Head from 'next/head'

import config from '@/theme-config.json'

const MyApp = ({ Component, pageProps }: AppProps) => {
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
