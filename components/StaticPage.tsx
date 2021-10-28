import dynamic from 'next/dynamic'
import { PrerenderProps } from 'types/content'

const Layout = dynamic(import('components/Layout'))
const Wrapper = dynamic(import('components/Wrapper'))

export type StaticPageProps = PrerenderProps & {
  children: React.ReactChild
  pageTitle: string
  SEOTitle: string
}

const StaticPage: React.FC<StaticPageProps> = ({
  children,
  pageTitle,
  SEOTitle,
  ...rest
}: StaticPageProps) => {
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

export default StaticPage
