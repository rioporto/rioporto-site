'use client';

import { useEffect, useRef } from 'react';

interface ReCaptchaProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpired?: () => void;
}

declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaLoad?: () => void;
  }
}

export function ReCaptcha({ 
  siteKey, 
  onVerify, 
  onError, 
  onExpired 
}: ReCaptchaProps) {
  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Função para carregar o script do reCAPTCHA
    const loadRecaptchaScript = () => {
      if (window.grecaptcha) {
        renderCaptcha();
        return;
      }

      window.onRecaptchaLoad = renderCaptcha;

      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };

    // Função para renderizar o captcha
    const renderCaptcha = () => {
      if (!captchaRef.current || widgetIdRef.current !== null) return;

      try {
        widgetIdRef.current = window.grecaptcha.render(captchaRef.current, {
          sitekey: siteKey,
          callback: onVerify,
          'error-callback': onError,
          'expired-callback': onExpired,
          theme: 'light', // ou 'dark' baseado no tema
          size: 'normal',
        });
      } catch (error) {
        console.error('Erro ao renderizar reCAPTCHA:', error);
        onError?.();
      }
    };

    loadRecaptchaScript();

    // Cleanup
    return () => {
      if (widgetIdRef.current !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
        } catch (error) {
          console.error('Erro ao resetar reCAPTCHA:', error);
        }
      }
    };
  }, [siteKey, onVerify, onError, onExpired]);

  return (
    <div 
      ref={captchaRef} 
      className="g-recaptcha"
    />
  );
}

// Hook para resetar o captcha
export function useRecaptchaReset() {
  return (widgetId: number | null) => {
    if (widgetId !== null && window.grecaptcha) {
      try {
        window.grecaptcha.reset(widgetId);
      } catch (error) {
        console.error('Erro ao resetar reCAPTCHA:', error);
      }
    }
  };
}