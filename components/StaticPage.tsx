import cx from 'classnames'
import { StaticPageType } from '../lib/staticPage'
import { useCurrentBreakPoint } from './grid/breakpointHooks'
import Layout from './Layout'
import Wrapper from './Wrapper'

export default function StaticPage(page: StaticPageType): JSX.Element {
  const breakpoint = useCurrentBreakPoint()
  return (
    <Layout title={`${page.title} | Vanilla`}>
      <Wrapper>
        <div className={cx('staticPage', page.layout, breakpoint)}>
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
        .faq.sm {
          padding: 2rem 2rem 4rem;
        }
        .faq.xs {
          padding: 0 0 4rem;
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
        .faq.xs .content > ul,
        .faq.sm .content > ul {
          grid-template-columns: 1fr;
        }
      `}</style>
    </Layout>
  )
}
