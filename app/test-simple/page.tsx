export default function TestSimplePage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Página de Teste Simples</h1>
      <p>Se você está vendo isso, as rotas estão funcionando!</p>
      <br />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
        <a href="/login" style={{ padding: '10px', background: '#333', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          Ir para Login
        </a>
        <a href="/dashboard" style={{ padding: '10px', background: '#333', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          Ir para Dashboard
        </a>
        <a href="/admin/comments" style={{ padding: '10px', background: '#333', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          Ir para Admin
        </a>
        <a href="/test-auth" style={{ padding: '10px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          Testar Autenticação
        </a>
      </div>
    </div>
  )
}
