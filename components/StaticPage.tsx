import Layout from 'components/Layout'
import Wrapper from 'components/Wrapper'
import { PrerenderProps } from 'types/content'

export type StaticPageProps = PrerenderProps & {
  children: React.ReactChild
  pageTitle: string
  SEOTitle: string
}

export default function StaticPage({
  children,
  pageTitle,
  SEOTitle,
  ...rest
}: StaticPageProps): JSX.Element {
  return (
    <Layout title={`${SEOTitle} | Vanilla`} {...rest}>
      <Wrapper>
        <div className='staticPage'>
          <div className='content'>
            <h1>{pageTitle}</h1>
            {children}
          </div>
        </div>
      </Wrapper>
      <style jsx>{`
        .content {
          padding: 0 1rem 5rem;
          max-width: 48rem;
          line-height: 1.6;
          margin: 0 auto;
          font-size: var(--static-page-fontsize);
        }
        .icon {
          border: 1px solid red;
        }
      `}</style>
    </Layout>
  )
}
