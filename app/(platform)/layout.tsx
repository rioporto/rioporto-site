import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import PlatformClient from "./platform-client"

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <PlatformClient>
          {children}
        </PlatformClient>
      </main>
      <Footer />
    </>
  )
}
