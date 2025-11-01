import { createClient } from 'contentful'
import { Document } from '@contentful/rich-text-types'

if (!process.env.CONTENTFUL_SPACE_ID) {
  throw new Error('CONTENTFUL_SPACE_ID is required')
}

if (!process.env.CONTENTFUL_ACCESS_TOKEN) {
  throw new Error('CONTENTFUL_ACCESS_TOKEN is required')
}

export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
})

export interface BlogPost {
  sys: {
    id: string
    createdAt: string
    updatedAt: string
  }
  fields: {
    title: string
    slug: string
    subtitle?: string
    excerpt?: string
    content: Document
    featuredImage?: {
      fields: {
        file: {
          url: string
          details: {
            image: {
              width: number
              height: number
            }
          }
        }
        title: string
      }
    }
    publishedDate: string
    author?: string | object
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'blogPost',
      order: ['-fields.publishedDate'],
    })

    return response.items as unknown as BlogPost[]
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'blogPost',
      'fields.slug': slug,
      limit: 1,
    })

    if (response.items.length > 0) {
      return response.items[0] as unknown as BlogPost
    }

    return null
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}