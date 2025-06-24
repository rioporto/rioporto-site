import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "react-hot-toast"
import { Toaster as ShadcnToaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Rio Porto P2P - Compra e Venda de Bitcoin e Criptomoedas",
  description: "A Rio Porto P2P facilita a compra e venda de Bitcoin e criptomoedas com segurança, praticidade e suporte personalizado. Consultoria especializada em Bitcoin.",
  keywords: "bitcoin, criptomoedas, p2p, comprar bitcoin, vender bitcoin, stablecoin, usdt, usdc, rio de janeiro",
  authors: [{ name: "Rio Porto P2P" }],
  openGraph: {
    title: "Rio Porto P2P - Compra e Venda de Bitcoin",
    description: "Facilitamos a compra e venda de Bitcoin e criptomoedas com segurança e praticidade.",
    url: "https://www.rioporto.com",
    siteName: "Rio Porto P2P",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rio Porto P2P - Compra e Venda de Bitcoin",
    description: "Facilitamos a compra e venda de Bitcoin e criptomoedas com segurança e praticidade.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" />
          <ShadcnToaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
