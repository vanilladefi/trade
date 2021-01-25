import { GetStaticProps } from 'next'
import StaticPage from '../components/StaticPage'
import { getStaticBySlugRendered } from '../lib/staticPage'

export default StaticPage

export const getStaticProps: GetStaticProps = async () => {
  const page = await getStaticBySlugRendered('faq')
  return {
    props: { ...page },
  }
}
