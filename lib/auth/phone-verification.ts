// lib/auth/phone-verification.ts
import { createClient } from '@/lib/supabase/server';

export async function isPhoneVerified(userId: string): Promise<boolean> {
  const supabase = createClient();
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('phone_verified')
    .eq('id', userId)
    .single();
  
  return profile?.phone_verified || false;
}

export async function requirePhoneVerification(userId: string, phone?: string): Promise<{
  verified: boolean;
  redirectUrl?: string;
}> {
  const verified = await isPhoneVerified(userId);
  
  if (!verified) {
    const phoneParam = phone ? `&phone=${encodeURIComponent(phone)}` : '';
    return {
      verified: false,
      redirectUrl: `/verificar-telefone?userId=${userId}${phoneParam}&redirect=${encodeURIComponent(window.location.pathname)}`
    };
  }
  
  return { verified: true };
}