// scripts/check-system-status.js
// Script para verificar o status completo do sistema

const https = require('https');

async function checkSystemStatus() {
  console.log('🔍 VERIFICANDO STATUS DO SISTEMA RIO PORTO P2P\n');
  console.log('='.repeat(50));
  
  // 1. Verificar variáveis de ambiente
  console.log('\n📋 VARIÁVEIS DE AMBIENTE:');
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'RESEND_API_KEY',
    'RESEND_FROM_EMAIL'
  ];
  
  let envOk = true;
  requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
    } else {
      console.log(`❌ ${varName}: NÃO ENCONTRADA`);
      envOk = false;
    }
  });
  
  // 2. Verificar dependências
  console.log('\n📦 DEPENDÊNCIAS:');
  const deps = ['resend', '@supabase/supabase-js', 'zod'];
  deps.forEach(dep => {
    try {
      require.resolve(dep);
      console.log(`✅ ${dep}: Instalado`);
    } catch (e) {
      console.log(`❌ ${dep}: NÃO instalado`);
    }
  });
  
  // 3. Verificar servidor local
  console.log('\n🌐 SERVIDOR LOCAL:');
  const checkLocalServer = () => {
    return new Promise((resolve) => {
      const req = https.get('http://localhost:3000', (res) => {
        console.log(`✅ Servidor rodando na porta 3000 (Status: ${res.statusCode})`);
        resolve(true);
      });
      
      req.on('error', () => {
        console.log('❌ Servidor NÃO está rodando em http://localhost:3000');
        resolve(false);
      });
      
      req.setTimeout(2000, () => {
        console.log('❌ Timeout ao conectar no servidor local');
        req.destroy();
        resolve(false);
      });
    });
  };
  
  await checkLocalServer();
  
  // 4. Resumo
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMO:\n');
  
  if (!envOk) {
    console.log('⚠️  Configure as variáveis de ambiente no arquivo .env.local');
  }
  
  console.log('\n💡 PRÓXIMOS PASSOS:');
  console.log('1. Execute os scripts SQL no Supabase');
  console.log('2. npm install (se houver dependências faltando)');
  console.log('3. npm run dev (se o servidor não estiver rodando)');
  console.log('4. Teste em: http://localhost:3000/curso-p2p');
  
  console.log('\n🔗 LINKS ÚTEIS:');
  console.log('- Landing Page: http://localhost:3000/curso-p2p');
  console.log('- Dashboard: http://localhost:3000/admin/dashboard');
  console.log('- Minicurso: http://localhost:3000/minicurso');
  console.log('- Supabase: https://app.supabase.com');
  console.log('- Resend: https://resend.com/emails');
}

// Carregar variáveis de ambiente se existirem
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // Ignorar se dotenv não estiver instalado
}

// Executar verificação
checkSystemStatus();
