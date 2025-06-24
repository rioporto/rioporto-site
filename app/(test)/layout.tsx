import { SimpleAuthProvider } from "@/contexts/simple-auth-context"

export default function TestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SimpleAuthProvider>
      <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
        <header style={{ background: "#333", color: "white", padding: "1rem" }}>
          <h2>Test Layout (Simplificado)</h2>
        </header>
        <main style={{ padding: "2rem" }}>
          {children}
        </main>
      </div>
    </SimpleAuthProvider>
  )
}
