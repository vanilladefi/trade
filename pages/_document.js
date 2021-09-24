import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  render() {
    return (
      <Html lang='en'>
        <Head>
          <meta charSet='utf-8' />
          <meta
            name='viewport'
            content='initial-scale=1.0, width=device-width'
          />
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/apple-touch-icon.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='32x32'
            href='/favicon-32x32.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='16x16'
            href='/favicon-16x16.png'
          />
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link
            rel='preconnect'
            href='https://fonts.gstatic.com'
            crossOrigin='anonymous'
          />
          <link
            href='https://fonts.googleapis.com/css2?family=Darker+Grotesque:wght@700&family=Fira+Code&family=Inter:wght@400;600&display=swap'
            rel='stylesheet'
          ></link>
          <link rel='manifest' href='/site.webmanifest' />
          <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#fd9b1e' />
          <meta name='msapplication-TileColor' content='#fd9b1e' />
          <meta name='theme-color' content='#ffffff' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
