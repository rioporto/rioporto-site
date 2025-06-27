// scripts/test-twilio.js
// Script para testar configuração do Twilio
// Execute com: node scripts/test-twilio.js

const twilio = require('twilio');
require('dotenv').config({ path: '.env.local' });

async function testTwilio() {
  console.log('🔍 Testando configuração Twilio...\n');

  // Verificar variáveis de ambiente
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

  console.log('1️⃣ Verificando variáveis de ambiente:');
  console.log(`   Account SID: ${accountSid ? '✅ Configurado' : '❌ Faltando'}`);
  console.log(`   Auth Token: ${authToken ? '✅ Configurado' : '❌ Faltando'}`);
  console.log(`   Phone Number: ${phoneNumber ? `✅ ${phoneNumber}` : '❌ Faltando'}`);

  if (!accountSid || !authToken || !phoneNumber) {
    console.log('\n❌ Configure as variáveis no .env.local primeiro!');
    return;
  }

  try {
    // Inicializar cliente
    const client = twilio(accountSid, authToken);
    console.log('\n2️⃣ Cliente Twilio inicializado com sucesso!');

    // Verificar conta
    const account = await client.api.accounts(accountSid).fetch();
    console.log('\n3️⃣ Informações da conta:');
    console.log(`   Status: ${account.status}`);
    console.log(`   Tipo: ${account.type}`);
    console.log(`   Nome: ${account.friendlyName}`);

    // Para enviar SMS de teste (descomente e configure)
    /*
    const testNumber = '+5521999999999'; // Seu número verificado
    console.log('\n4️⃣ Enviando SMS de teste...');
    
    const message = await client.messages.create({
      body: 'Rio Porto P2P - Teste de configuração Twilio ✅',
      from: phoneNumber,
      to: testNumber
    });
    
    console.log(`   SMS enviado! ID: ${message.sid}`);
    console.log(`   Status: ${message.status}`);
    */

    console.log('\n✅ Twilio configurado corretamente!');
    console.log('\n💡 Próximos passos:');
    console.log('   1. Se conta trial, verifique números em: https://console.twilio.com/verified');
    console.log('   2. Descomente o código de SMS teste acima');
    console.log('   3. Execute novamente para testar envio');

  } catch (error) {
    console.log('\n❌ Erro ao conectar com Twilio:');
    console.log(`   ${error.message}`);
    console.log('\n💡 Verifique:');
    console.log('   - Account SID está correto (começa com AC)');
    console.log('   - Auth Token está correto');
    console.log('   - Sua conta está ativa');
  }
}

testTwilio();