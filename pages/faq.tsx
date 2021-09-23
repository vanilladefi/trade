import { MDXProvider } from '@mdx-js/react'
import MDX from '@mdx-js/runtime'
import Button, { ButtonProps } from 'components/input/Button'
import StaticPage, { StaticPageProps } from 'components/StaticPage'
import Katex from 'components/typography/Katex'
import ResponsiveImage, {
  ImageProps,
} from 'components/typography/ResponsiveImage'
import fs from 'fs'
import matter from 'gray-matter'
import { GetStaticProps } from 'next'
import Link, { LinkProps } from 'next/link'

type PostProps = StaticPageProps & {
  mdx: string
}

const FAQ = (props: PostProps): JSX.Element => {
  const components = {
    Link: (props: React.PropsWithChildren<LinkProps>) => <Link {...props} />,
    ResponsiveImage: (props: ImageProps) => <ResponsiveImage {...props} />,
    Button: (props: ButtonProps) => <Button {...props} />,
    Katex: () => <Katex />,
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
  const rawFileSource = fs.readFileSync('data/content/faq.mdx')
  const { content } = matter(rawFileSource)
  return {
    props: {
      mdx: content,
      pageTitle: 'Frequently Asked Questions',
      SEOTitle: 'FAQ',
    },
  }
}

export default FAQ
