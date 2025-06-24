import { Metadata } from 'next'
import BlogPageClient from './client'
import { generateBlogMetadata, generateBlogJsonLd } from '@/lib/blog/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return generateBlogMetadata({
    title: 'Centro de Conhecimento - Bitcoin e Ativos Digitais | Rio Porto P2P',
    description: 'Análises especializadas, guias estratégicos e insights exclusivos sobre Bitcoin, criptoativos e mercado financeiro digital.',
  })
}

export default function BlogPage() {
  const jsonLd = generateBlogJsonLd()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPageClient />
    </>
  )
}