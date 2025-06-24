import { NextResponse } from 'next/server'
import { getBlogPosts } from '@/lib/blog/api'

export async function GET() {
  const { posts } = await getBlogPosts({ limit: 50 })
  
  const baseUrl = 'https://rioporto.com'
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Rio Porto P2P Blog</title>
    <description>Conteúdo educativo sobre Bitcoin, criptomoedas e investimentos</description>
    <link>${baseUrl}/blog</link>
    <language>pt-BR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api/blog/rss" rel="self" type="application/rss+xml"/>
    ${posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt}]]></description>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <dc:creator><![CDATA[${post.author_name}]]></dc:creator>
      <pubDate>${new Date(post.published_at || '').toUTCString()}</pubDate>
      <category>${post.category_name}</category>
      ${post.tags?.map(tag => `<category>${tag.name}</category>`).join('')}
    </item>`).join('')}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}