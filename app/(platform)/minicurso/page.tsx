'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { MinicursoViewer } from '@/components/minicurso/minicurso-viewer';
import { toast } from 'sonner';

export default function MinicursoPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Verificar se o usuário tem acesso
    const checkAccess = async () => {
      if (!user) {
        toast.error('Faça login para acessar o minicurso');
        router.push('/login?redirect=/minicurso');
        return;
      }

      // Verificar se o usuário já baixou o ebook/minicurso
      try {
        const response = await fetch('/api/lead-capture/check-access', {
          headers: {
            'Authorization': `Bearer ${user.id}`
          }
        });

        if (!response.ok) {
          toast.error('Você precisa se cadastrar para acessar o minicurso');
          router.push('/');
        }
      } catch (error) {
        console.error('Erro ao verificar acesso:', error);
      }
    };

    checkAccess();
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MinicursoViewer />
    </div>
  );
}