export interface IPost {
  slug: string
  title: string
  image?: string
  tag?: string[]
  date?: string | Date
  excerpt: string
  excerptHtml: string
  html: string
}
