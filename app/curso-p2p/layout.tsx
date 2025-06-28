// app/curso-p2p/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manual P2P: Negocie Bitcoin como um Profissional - Curso Gratuito',
  description: 'Aprenda a negociar Bitcoin P2P com segurança total. Descubra estratégias profissionais para economizar em taxas e evitar golpes. Acesso gratuito por tempo limitado!',
  keywords: 'bitcoin p2p, curso bitcoin, negociação p2p, bitcoin brasil, como comprar bitcoin, curso gratuito bitcoin, manual p2p',
  openGraph: {
    title: 'Manual P2P: Negocie Bitcoin como um Profissional',
    description: 'Curso gratuito revela os segredos dos traders profissionais de Bitcoin P2P. Economize milhares em taxas!',
    type: 'website',
    url: 'https://rioporto.com/curso-p2p',
    images: [
      {
        url: '/images/curso-p2p-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Manual P2P - Curso de Bitcoin'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manual P2P: Negocie Bitcoin como um Profissional',
    description: 'Curso gratuito revela os segredos dos traders profissionais de Bitcoin P2P',
    images: ['/images/curso-p2p-og.jpg']
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default function CursoP2PLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
