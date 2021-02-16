import Link from 'next/link'

import Layout from 'components/Layout'
import Wrapper from 'components/Wrapper'

export default function Page404(): JSX.Element {
  return (
    <Layout title='404 - Page Not Found'>
      <Wrapper className='wrapper'>
        <h1>404 - Page Not Found</h1>
        <Link href='/'>
          <a>Go back home</a>
        </Link>
      </Wrapper>
      <style jsx>{`
        :global(.wrapper) {
          flex: 2;
          align-items: center;
          justify-content: center;
        }
        h1 {
          margin-top: -10%;
        }
      `}</style>
    </Layout>
  )
}
