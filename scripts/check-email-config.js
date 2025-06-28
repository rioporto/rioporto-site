// scripts/check-email-config.js
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuração de email...\n');

// Verificar .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Verificar RESEND_API_KEY
  if (envContent.includes('RESEND_API_KEY=')) {
    const hasKey = /RESEND_API_KEY=re_\w+/.test(envContent);
    if (hasKey) {
      console.log('✅ RESEND_API_KEY encontrada');
    } else {
      console.log('❌ RESEND_API_KEY parece estar vazia ou inválida');
    }
  } else {
    console.log('❌ RESEND_API_KEY não encontrada no .env.local');
  }
  
  // Verificar RESEND_FROM_EMAIL
  if (envContent.includes('RESEND_FROM_EMAIL=')) {
    console.log('✅ RESEND_FROM_EMAIL configurado');
  } else {
    console.log('⚠️  RESEND_FROM_EMAIL não encontrado (usando padrão)');
  }
  
  // Verificar NEXT_PUBLIC_APP_URL
  if (envContent.includes('NEXT_PUBLIC_APP_URL=')) {
    console.log('✅ NEXT_PUBLIC_APP_URL configurado');
  } else {
    console.log('⚠️  NEXT_PUBLIC_APP_URL não encontrado (usando padrão)');
  }
} else {
  console.log('❌ Arquivo .env.local não encontrado!');
}

// Verificar se Resend está instalado
try {
  require.resolve('resend');
  console.log('✅ Pacote resend instalado');
} catch (e) {
  console.log('❌ Pacote resend NÃO instalado - execute: npm install resend');
}

console.log('\n📋 Checklist:');
console.log('1. Execute: npm install resend');
console.log('2. Verifique se o domínio está verificado no Resend');
console.log('3. Teste em: http://localhost:3000/curso-p2p');
console.log('\n✨ Boa sorte com os testes!');
