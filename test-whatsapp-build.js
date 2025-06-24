// test-whatsapp-build.js
// Script para testar se a build do WhatsApp funciona corretamente

console.log('🔍 Testando configuração do WhatsApp...\n');

// Verificar variáveis de ambiente
const requiredEnvVars = [
  'WHATSAPP_ACCESS_TOKEN',
  'WHATSAPP_PHONE_NUMBER_ID',
  'WHATSAPP_VERIFY_TOKEN'
];

console.log('📋 Verificando variáveis de ambiente:');
let missingVars = [];

requiredEnvVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName}: Configurada`);
  } else {
    console.log(`❌ ${varName}: NÃO configurada`);
    missingVars.push(varName);
  }
});

if (missingVars.length > 0) {
  console.log('\n⚠️  AVISO: Adicione as seguintes variáveis ao arquivo .env.local:');
  missingVars.forEach(varName => {
    console.log(`${varName}=seu_valor_aqui`);
  });
} else {
  console.log('\n✅ Todas as variáveis de ambiente estão configuradas!');
}

console.log('\n📝 Próximos passos:');
console.log('1. Execute o SQL no Supabase (arquivo: whatsapp_setup.sql)');
console.log('2. Configure as variáveis de ambiente no .env.local');
console.log('3. Configure o webhook no Meta Business Platform');
console.log('4. Execute: npm run build');
console.log('5. Deploy: git push origin main');

process.exit(0);
