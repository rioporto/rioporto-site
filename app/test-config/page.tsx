'use client';

import { useEffect, useState } from 'react';

export default function TestConfigPage() {
  const [status, setStatus] = useState<any>({
    loading: true,
    zendesk: {},
    vercel: {}
  });

  useEffect(() => {
    checkEverything();
  }, []);

  async function checkEverything() {
    const newStatus: any = {
      loading: false,
      zendesk: {},
      vercel: {}
    };

    // 1. Verificar Zendesk
    newStatus.zendesk.key = !!process.env.NEXT_PUBLIC_ZENDESK_KEY;
    newStatus.zendesk.widget = typeof window !== 'undefined' && typeof window.zE !== 'undefined';
    
    // 2. Verificar Variáveis de Ambiente
    newStatus.vercel = {
      zendesk_key: !!process.env.NEXT_PUBLIC_ZENDESK_KEY,
      supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabase_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      is_production: process.env.NODE_ENV === 'production'
    };

    // 3. Testar API de Tracking
    try {
      const response = await fetch('/api/minicurso/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: 'test-lead-id',
          activityType: 'page_view',
          pageId: 'test',
          duration: 0
        })
      });
      newStatus.api = {
        tracking: response.ok,
        tracking_status: response.status
      };
    } catch (e) {
      newStatus.api = { tracking: false, error: e };
    }

    // Aguardar um pouco para o widget carregar
    setTimeout(() => {
      newStatus.zendesk.widget = typeof window.zE !== 'undefined';
      setStatus(newStatus);
    }, 2000);

    setStatus(newStatus);
  }

  const StatusIcon = ({ success }: { success: boolean }) => (
    <span className={success ? 'text-green-600' : 'text-red-600'}>
      {success ? '✅' : '❌'}
    </span>
  );

  if (status.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Verificando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">🧪 Teste de Configuração - Rio Porto P2P</h1>
      
      {/* Zendesk */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">💬 Zendesk</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Chave configurada</span>
            <StatusIcon success={status.zendesk.key} />
          </div>
          <div className="flex items-center justify-between">
            <span>Widget carregado</span>
            <StatusIcon success={status.zendesk.widget} />
          </div>
        </div>
        {status.zendesk.key && (
          <div className="mt-4 p-4 bg-blue-50 rounded">
            <p className="text-sm">Chave: {process.env.NEXT_PUBLIC_ZENDESK_KEY?.substring(0, 8)}...</p>
          </div>
        )}
      </div>

      {/* Variáveis de Ambiente */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">🔐 Variáveis de Ambiente</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>NEXT_PUBLIC_ZENDESK_KEY</span>
            <StatusIcon success={status.vercel.zendesk_key} />
          </div>
          <div className="flex items-center justify-between">
            <span>NEXT_PUBLIC_SUPABASE_URL</span>
            <StatusIcon success={status.vercel.supabase_url} />
          </div>
          <div className="flex items-center justify-between">
            <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
            <StatusIcon success={status.vercel.supabase_anon_key} />
          </div>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <p className="text-sm">Ambiente: {status.vercel.is_production ? 'Produção' : 'Desenvolvimento'}</p>
        </div>
      </div>

      {/* APIs */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">🔌 APIs</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>API de Tracking (/api/minicurso/tracking)</span>
            <StatusIcon success={status.api?.tracking} />
            {status.api?.tracking_status && (
              <span className="text-sm text-gray-500">Status: {status.api.tracking_status}</span>
            )}
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">🚀 Ações de Teste</h2>
        <div className="space-y-3">
          <button
            onClick={() => {
              if (window.zE) {
                window.zE('webWidget', 'open');
              } else {
                alert('Widget Zendesk ainda não carregou. Aguarde alguns segundos.');
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Abrir Widget Zendesk
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 ml-3"
          >
            Recarregar Testes
          </button>
        </div>
      </div>

      {/* Teste SQL Manual */}
      <div className="mt-8 p-6 bg-yellow-50 rounded-lg">
        <h3 className="font-semibold mb-2">📊 Para verificar as migrações SQL:</h3>
        <p className="text-sm mb-2">Execute no Supabase SQL Editor:</p>
        <pre className="bg-gray-800 text-white p-3 rounded text-xs overflow-x-auto">
{`-- Verificar se as tabelas existem
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('minicurso_activities', 'support_tickets');

-- Verificar colunas de progresso
SELECT column_name FROM information_schema.columns
WHERE table_name = 'leads'
AND column_name IN ('course_progress', 'last_page_viewed');`}
        </pre>
      </div>

      {/* Instruções Vercel */}
      <div className="mt-6 p-6 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">📝 Para verificar na Vercel:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Acesse: https://vercel.com/dashboard</li>
          <li>Selecione o projeto: rioporto-site</li>
          <li>Vá em: Settings → Environment Variables</li>
          <li>Verifique se todas as variáveis estão configuradas</li>
        </ol>
      </div>
    </div>
  );
}

// Declaração para TypeScript
declare global {
  interface Window {
    zE: any;
  }
}