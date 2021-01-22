import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import markdownToHtml from 'lib/markdownToHtml'

export type StaticPageType = {
  slug: string
  title: string
  excerpt: string | null
  layout: string | null
  content: string
}

function getDir(name: string) {
  return join(process.cwd(), name)
}

/*
 * List all static page slugs
 */
export function getStaticSlugs(dirName = '_static'): string[] {
  return fs.readdirSync(getDir(dirName)).map((f) => f.replace(/\.md$/, ''))
}

/*
 * Return a static page by slug
 */
export function getStaticBySlug(
  slug: string,
  dirName = '_static'
): StaticPageType {
  const fullPath = join(getDir(dirName), `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data['title'],
    excerpt: data['excerpt'] ?? null,
    layout: data['layout'] ?? null,
    content,
  }
}

/*
 * Return a static page by slug with content rendered as HTML
 */
export async function getStaticBySlugRendered(
  slug: string,
  dirName = '_static'
): Promise<StaticPageType> {
  const page = getStaticBySlug(slug, dirName)
  const content = await markdownToHtml(page.content || '')
  return { ...page, content }
}
