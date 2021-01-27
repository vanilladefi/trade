import cx from 'classnames'
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
        <div className={cx('staticPage')}>
          <div
            className='content'
          >{children}</div>
        </div>
      </Wrapper>
      <style jsx>{`
        .content {
          padding: var(--boxpadding);
        }
        .content > img {
          max-width: 100%;
        }
      `}</style>
    </Layout>
  )
}
