import { Metadata } from 'next'
import { getPostBySlug, getPostsByCategory } from '@/lib/blog/api'

export async function generateBlogMetadata({
  title,
  description,
  slug,
  image,
  publishedAt,
  author
}: {
  title: string
  description: string
  slug?: string
  image?: string
  publishedAt?: string
  author?: string
}): Promise<Metadata> {
  const url = `https://rioporto.com${slug ? `/blog/${slug}` : '/blog'}`

  return {
    title: `${title} | Rio Porto P2P Blog`,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Rio Porto P2P',
      images: image ? [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        }
      ] : [
        {
          url: 'https://rioporto.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Rio Porto P2P - Bitcoin e Criptomoedas',
        }
      ],
      locale: 'pt_BR',
      type: slug ? 'article' : 'website',
      ...(slug && publishedAt && {
        article: {
          publishedTime: publishedAt,
          authors: author ? [author] : ['Rio Porto P2P'],
          tags: ['bitcoin', 'criptomoedas', 'investimento']
        }
      })
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : ['https://rioporto.com/twitter-image.jpg'],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

// Schema.org para posts do blog
export function generateArticleJsonLd({
  title,
  description,
  slug,
  image,
  publishedAt,
  modifiedAt,
  author,
  content
}: {
  title: string
  description: string
  slug: string
  image?: string
  publishedAt: string
  modifiedAt: string
  author: string
  content?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: image || 'https://rioporto.com/og-image.jpg',
    datePublished: publishedAt,
    dateModified: modifiedAt,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Rio Porto P2P',
      logo: {
        '@type': 'ImageObject',
        url: 'https://rioporto.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://rioporto.com/blog/${slug}`,
    },
    ...(content && {
      articleBody: content.substring(0, 5000) // Limitar tamanho
    })
  }
}

// Schema.org para lista de posts
export function generateBlogJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Centro de Conhecimento - Rio Porto P2P',
    description: 'Análises especializadas e inteligência de mercado sobre Bitcoin, ativos digitais e tendências do mercado financeiro',
    url: 'https://rioporto.com/blog',
    publisher: {
      '@type': 'Organization',
      name: 'Rio Porto P2P',
      logo: {
        '@type': 'ImageObject',
        url: 'https://rioporto.com/logo.png',
      },
    },
  }
}