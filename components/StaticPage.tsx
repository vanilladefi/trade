import cx from 'classnames'
import { StaticPageType } from 'lib/staticPage'
import { BreakPoint } from 'components/GlobalStyles/Breakpoints'
import Layout from 'components/Layout'
import Wrapper from 'components/Wrapper'

export default function StaticPage(page: StaticPageType): JSX.Element {
  return (
    <Layout title={`${page.title} | Vanilla`}>
      <Wrapper>
        <div className={cx('staticPage', page.layout)}>
          <h1 className='title'>{page.title}</h1>
          {page.excerpt && <p className='excerpt'>{page.excerpt}</p>}
          <div
            className='content'
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </Wrapper>
      {/* FAQ styling */}
      <style global jsx>{`
        .faq {
          padding: 4rem;
        }

        .faq .content ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .faq .content li {
          text-align: justify;
        }

        .faq .content > ul {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-gap: 2rem;
        }

        @media (max-width: ${BreakPoint.sm}px) {
          .faq {
            padding: 2rem 2rem 4rem;
          }
          .faq .content > ul {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: ${BreakPoint.xs}px) {
          .faq {
            padding: 0 0 4rem;
          }
        }
      `}</style>
    </Layout>
  )
}
