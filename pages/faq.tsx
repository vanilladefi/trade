import { GetStaticProps } from 'next'
import { getStaticBySlugRendered } from 'lib/staticPage'
import StaticPage from 'components/StaticPage'

export default StaticPage

export const getStaticProps: GetStaticProps = async () => {
  const page = await getStaticBySlugRendered('faq')
  return {
    props: { ...page },
  }
}
