// app/providers/zendesk-provider.tsx
'use client';

import { useAuth } from '@/contexts/auth-context';
import { ZendeskWidget } from '@/components/zendesk/zendesk-widget';

export function ZendeskProvider() {
  const { user } = useAuth();
  
  // Pegar a chave do Zendesk das variáveis de ambiente
  const zendeskKey = process.env.NEXT_PUBLIC_ZENDESK_KEY;
  
  console.log('ZendeskProvider - Key:', zendeskKey ? 'Found' : 'Not found');
  console.log('ZendeskProvider - User:', user ? 'Logged in' : 'Not logged in');
  
  if (!zendeskKey) {
    console.warn('Zendesk key not found in environment variables');
    return null;
  }
  
  return (
    <ZendeskWidget
      zendeskKey={zendeskKey}
      userEmail={user?.email}
      userName={user?.user_metadata?.full_name || user?.email?.split('@')[0]}
    />
  );
}