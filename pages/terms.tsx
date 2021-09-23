import { MDXProvider } from '@mdx-js/react'
import MDX from '@mdx-js/runtime'
import StaticPage, { StaticPageProps } from 'components/StaticPage'
import fs from 'fs'
import matter from 'gray-matter'
import { GetStaticProps } from 'next'
import Link, { LinkProps } from 'next/link'

type PostProps = StaticPageProps & {
  mdx: string
}

const Terms = (props: PostProps): JSX.Element => {
  const components = {
    Link: (props: React.PropsWithChildren<LinkProps>) => <Link {...props} />,
  }
  return (
    <MDXProvider components={components}>
      <StaticPage {...props}>
        <MDX>{props.mdx}</MDX>
      </StaticPage>
    </MDXProvider>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const rawFileSource = fs.readFileSync('data/content/terms.mdx')
  const { content } = matter(rawFileSource)
  return {
    props: {
      mdx: content,
      pageTitle: 'Terms of Use',
      SEOTitle: 'Terms of Use',
    },
  }
}

export default Terms
