'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Download, BookOpen, Shield, TrendingUp, FileText, X } from 'lucide-react';
import Image from 'next/image';
import { useLeadCapture } from '@/hooks/use-lead-capture';
import { PopupSettings, CreateLeadDTO } from '@/types/lead-capture';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

export function LeadCaptureModal() {
  const { user } = useAuth();
  const { shouldShowPopup, markPopupAsSeen, trackEvent } = useLeadCapture();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<PopupSettings | null>(null);
  const [formData, setFormData] = useState<CreateLeadDTO>({
    full_name: '',
    email: '',
    whatsapp: '',
    experience_level: undefined,
    interest: undefined,
  });
  const [errors, setErrors] = useState<Partial<CreateLeadDTO>>({});

  // Carregar configurações do popup
  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch('/api/lead-capture/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    }
    loadSettings();
  }, []);

  // Mostrar popup quando necessário
  useEffect(() => {
    if (shouldShowPopup && !user && settings?.active) {
      setIsOpen(true);
      markPopupAsSeen();
    }
  }, [shouldShowPopup, user, settings, markPopupAsSeen]);

  // Preencher dados do usuário logado
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
      }));
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateLeadDTO> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Nome completo é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp é obrigatório';
    } else if (!/^\d{10,11}$/.test(formData.whatsapp.replace(/\D/g, ''))) {
      newErrors.whatsapp = 'WhatsApp inválido (use DDD + número)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      if (numbers.length > 6) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
      } else if (numbers.length > 2) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
      } else if (numbers.length > 0) {
        return `(${numbers}`;
      }
    }
    return value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    trackEvent('form_submitted');

    try {
      // Capturar UTMs da URL
      const urlParams = new URLSearchParams(window.location.search);
      const leadData = {
        ...formData,
        utm_source: urlParams.get('utm_source') || undefined,
        utm_medium: urlParams.get('utm_medium') || undefined,
        utm_campaign: urlParams.get('utm_campaign') || undefined,
      };

      const response = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar dados');
      }

      // Download do e-book
      if (settings?.ebook_url) {
        trackEvent('ebook_downloaded');
        window.open(settings.ebook_url, '_blank');
      }

      toast.success('E-book enviado! Verifique seu email.');
      setIsOpen(false);
    } catch (error) {
      console.error('Erro:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao processar sua solicitação');
    } finally {
      setIsLoading(false);
    }
  };

  if (!settings || !settings.active) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <button
          onClick={() => {
            setIsOpen(false);
            trackEvent('popup_closed');
          }}
          className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Fechar</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Lado esquerdo - Capa do E-book */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-8 flex flex-col items-center justify-center text-white">
            <div className="text-center space-y-4">
              <BookOpen className="w-16 h-16 mx-auto" />
              <div className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">
                🎙️ COM NARRAÇÃO EM ÁUDIO
              </div>
              <h3 className="text-2xl font-bold">{settings.ebook_title}</h3>
              
              {settings.ebook_cover_url && (
                <div className="relative w-48 h-64 mx-auto shadow-2xl">
                  <Image
                    src={settings.ebook_cover_url}
                    alt={settings.ebook_title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}

              <div className="space-y-2 text-left">
                {settings.benefits.map((benefit, index) => (
                  <p key={index} className="text-sm flex items-start gap-2">
                    <span className="text-green-300">✓</span>
                    <span>{benefit}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Lado direito - Formulário */}
          <div className="p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl">{settings.title}</DialogTitle>
              {settings.subtitle && (
                <p className="text-muted-foreground mt-2">{settings.subtitle}</p>
              )}
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="full_name">Nome Completo *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="João da Silva"
                  disabled={isLoading}
                  onFocus={() => trackEvent('form_started')}
                />
                {errors.full_name && (
                  <p className="text-sm text-destructive mt-1">{errors.full_name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="whatsapp">WhatsApp *</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: formatWhatsApp(e.target.value) })}
                  placeholder="(21) 99999-9999"
                  disabled={isLoading}
                  maxLength={15}
                />
                {errors.whatsapp && (
                  <p className="text-sm text-destructive mt-1">{errors.whatsapp}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experience">Experiência com Bitcoin</Label>
                  <Select
                    value={formData.experience_level}
                    onValueChange={(value: any) => setFormData({ ...formData, experience_level: value })}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="experience">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iniciante">Iniciante</SelectItem>
                      <SelectItem value="intermediario">Intermediário</SelectItem>
                      <SelectItem value="avancado">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="interest">Interesse</Label>
                  <Select
                    value={formData.interest}
                    onValueChange={(value: any) => setFormData({ ...formData, interest: value })}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="interest">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comprar">Quero Comprar</SelectItem>
                      <SelectItem value="vender">Quero Vender</SelectItem>
                      <SelectItem value="ambos">Ambos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Seus dados estão seguros. Utilizamos criptografia e não compartilhamos suas informações.
                </AlertDescription>
              </Alert>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Acessar Minicurso Grátis
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Ao baixar, você concorda em receber nossas comunicações sobre Bitcoin e criptomoedas.
              </p>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}