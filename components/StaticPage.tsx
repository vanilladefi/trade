import Layout from 'components/Layout'
import Wrapper from 'components/Wrapper'

type Props = {
  children: React.ReactChild
  title: string
}

export default function StaticPage({ children, title }: Props): JSX.Element {
  return (
    <Layout title={`${title} | Vanilla`}>
      <Wrapper>
        <div className='staticPage'>
          <div className='content'>{children}</div>
        </div>
      </Wrapper>
      <style jsx>{`
        .content {
          padding: 0 1rem 5rem;
          max-width: 48rem;
          line-height: 1.6;
          margin: 0 auto;
        }
      `}</style>
    </Layout>
  )
}
