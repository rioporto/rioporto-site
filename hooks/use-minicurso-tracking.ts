import { useCallback, useEffect, useRef } from 'react';

interface TrackingOptions {
  token: string;
  onError?: (error: Error) => void;
}

export function useMinicursoTracking({ token, onError }: TrackingOptions) {
  const startTimeRef = useRef<number>(Date.now());
  const currentPageRef = useRef<string | null>(null);

  // Função para enviar dados de tracking
  const track = useCallback(async (
    activity_type: 'page_view' | 'course_complete',
    data?: {
      page_id?: string;
      duration_seconds?: number;
      metadata?: Record<string, any>;
    }
  ) => {
    try {
      const response = await fetch('/api/minicurso/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          activity_type,
          ...data
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao registrar atividade');
      }
    } catch (error) {
      console.error('Tracking error:', error);
      onError?.(error as Error);
    }
  }, [token, onError]);

  // Rastrear visualização de página
  const trackPageView = useCallback((pageId: string) => {
    // Se estava em outra página, calcular tempo gasto
    if (currentPageRef.current && currentPageRef.current !== pageId) {
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      track('page_view', {
        page_id: currentPageRef.current,
        duration_seconds: duration
      });
    }

    // Atualizar página atual e resetar timer
    currentPageRef.current = pageId;
    startTimeRef.current = Date.now();

    // Rastrear nova página
    track('page_view', { page_id: pageId });
  }, [track]);

  // Rastrear conclusão do curso
  const trackCourseComplete = useCallback(() => {
    track('course_complete', {
      metadata: {
        totalTime: Math.round((Date.now() - startTimeRef.current) / 1000)
      }
    });
  }, [track]);

  // Buscar progresso atual
  const getProgress = useCallback(async () => {
    try {
      const response = await fetch(`/api/minicurso/tracking?token=${token}`);
      if (!response.ok) throw new Error('Erro ao buscar progresso');
      
      const data = await response.json();
      return data.stats;
    } catch (error) {
      console.error('Error fetching progress:', error);
      onError?.(error as Error);
      return null;
    }
  }, [token, onError]);

  // Registrar tempo na página ao sair
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentPageRef.current) {
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
        
        // Usar sendBeacon para garantir envio ao sair
        const data = {
          token,
          activity_type: 'page_view',
          page_id: currentPageRef.current,
          duration_seconds: duration
        };
        
        navigator.sendBeacon('/api/minicurso/tracking', JSON.stringify(data));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [token]);

  return {
    trackPageView,
    trackCourseComplete,
    getProgress
  };
}