'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { LeadCaptureState, LeadEventType } from '@/types/lead-capture';

const STORAGE_KEY = 'rioporto_lead_capture';
const SESSION_KEY = 'rioporto_session_id';

export function useLeadCapture() {
  const pathname = usePathname();
  const [state, setState] = useState<LeadCaptureState>({
    hasSeenPopup: false,
    popupShowCount: 0,
    pagesViewed: 0,
    timeOnSite: 0,
    scrollDepth: 0,
    isExitIntent: false,
  });
  const [shouldShowPopup, setShouldShowPopup] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  // Inicializar estado do localStorage
  useEffect(() => {
    // Gerar ou recuperar session ID
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    setSessionId(sid);

    // Recuperar estado salvo
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const savedState = JSON.parse(saved);
        setState(prev => ({ ...prev, ...savedState }));
      } catch (error) {
        console.error('Erro ao recuperar estado:', error);
      }
    }
  }, []);

  // Salvar estado quando mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Tracking de páginas vistas
  useEffect(() => {
    setState(prev => ({ ...prev, pagesViewed: prev.pagesViewed + 1 }));
    trackEvent('page_view', { page: pathname });
  }, [pathname]);

  // Tracking de tempo no site
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({ ...prev, timeOnSite: prev.timeOnSite + 1 }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Tracking de scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const scrollPercent = Math.round((scrolled / scrollHeight) * 100);
      
      setState(prev => ({ 
        ...prev, 
        scrollDepth: Math.max(prev.scrollDepth, scrollPercent) 
      }));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Exit intent detection
  useEffect(() => {
    const handleMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !state.isExitIntent) {
        setState(prev => ({ ...prev, isExitIntent: true }));
      }
    };

    document.addEventListener('mouseout', handleMouseOut);
    return () => document.removeEventListener('mouseout', handleMouseOut);
  }, [state.isExitIntent]);

  // Lógica para decidir quando mostrar popup
  useEffect(() => {
    // Não mostrar se já viu recentemente
    if (state.hasSeenPopup && state.lastPopupDate) {
      const lastDate = new Date(state.lastPopupDate);
      const daysSince = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) return; // Não mostrar por 7 dias
    }

    // Condições para mostrar
    const conditions = {
      timeReached: state.timeOnSite >= 30, // 30 segundos
      scrollReached: state.scrollDepth >= 50, // 50% da página
      pagesReached: state.pagesViewed >= 2, // 2 páginas
      exitIntent: state.isExitIntent,
    };

    // Se qualquer condição for verdadeira, mostrar popup
    if (Object.values(conditions).some(v => v) && !shouldShowPopup) {
      setShouldShowPopup(true);
    }
  }, [state, shouldShowPopup]);

  // Função para rastrear eventos
  const trackEvent = useCallback(async (
    eventType: LeadEventType, 
    eventData?: Record<string, any>
  ) => {
    try {
      await fetch('/api/lead-capture/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          event_type: eventType,
          event_data: eventData,
        }),
      });
    } catch (error) {
      console.error('Erro ao rastrear evento:', error);
    }
  }, [sessionId]);

  // Função para marcar popup como visto
  const markPopupAsSeen = useCallback(() => {
    setState(prev => ({
      ...prev,
      hasSeenPopup: true,
      popupShowCount: prev.popupShowCount + 1,
      lastPopupDate: new Date().toISOString(),
    }));
    setShouldShowPopup(false);
    trackEvent('popup_shown');
  }, [trackEvent]);

  // Função para resetar para testes
  const resetState = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      hasSeenPopup: false,
      popupShowCount: 0,
      pagesViewed: 0,
      timeOnSite: 0,
      scrollDepth: 0,
      isExitIntent: false,
    });
    setShouldShowPopup(false);
  }, []);

  return {
    state,
    shouldShowPopup,
    sessionId,
    trackEvent,
    markPopupAsSeen,
    resetState,
  };
}