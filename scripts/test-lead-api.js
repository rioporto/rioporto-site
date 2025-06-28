// scripts/test-lead-api.js
// Script para testar a API de lead capture diretamente

async function testLeadAPI() {
  console.log('🧪 Testando API de Lead Capture...\n');
  
  const testData = {
    name: 'Teste API',
    email: 'teste' + Date.now() + '@example.com',
    whatsapp: '11999999999',
    lead_source: 'test-script'
  };
  
  console.log('📤 Enviando dados:', JSON.stringify(testData, null, 2));
  
  try {
    const response = await fetch('http://localhost:3000/api/lead-capture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('\n📥 Status da resposta:', response.status);
    
    const data = await response.json();
    console.log('\n📄 Resposta:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('\n✅ Sucesso! Token gerado:', data.accessToken?.substring(0, 20) + '...');
      console.log('🆔 Lead ID:', data.leadId);
    } else {
      console.log('\n❌ Erro:', data.error);
      if (data.details) {
        console.log('📋 Detalhes:', JSON.stringify(data.details, null, 2));
      }
    }
    
  } catch (error) {
    console.error('\n💥 Erro na requisição:', error.message);
  }
}

// Executar teste
console.log('⚠️  Certifique-se de que o servidor está rodando em http://localhost:3000\n');
testLeadAPI();
