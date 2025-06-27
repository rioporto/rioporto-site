// types/lead-capture.ts

export interface Lead {
  id: string;
  full_name: string;
  email: string;
  whatsapp: string;
  experience_level?: 'iniciante' | 'intermediario' | 'avancado';
  interest?: 'comprar' | 'vender' | 'ambos';
  lead_source: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer_url?: string;
  landing_page?: string;
  email_verified: boolean;
  whatsapp_verified: boolean;
  lead_score: number;
  ebook_downloaded: boolean;
  ebook_downloaded_at?: string;
  last_interaction_at: string;
  created_at: string;
  updated_at: string;
}

export interface LeadEvent {
  id: string;
  lead_id?: string;
  session_id: string;
  event_type: LeadEventType;
  event_data?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export type LeadEventType = 
  | 'page_view'
  | 'popup_shown'
  | 'popup_closed'
  | 'form_started'
  | 'form_submitted'
  | 'ebook_downloaded'
  | 'email_clicked'
  | 'whatsapp_clicked';

export interface PopupSettings {
  id: string;
  name: string;
  active: boolean;
  show_after_seconds: number;
  show_after_scroll_percent: number;
  show_after_pages: number;
  show_on_exit_intent: boolean;
  hide_for_days: number;
  max_shows_per_session: number;
  title: string;
  subtitle?: string;
  ebook_title: string;
  ebook_url: string;
  ebook_cover_url?: string;
  benefits: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateLeadDTO {
  full_name: string;
  email: string;
  whatsapp: string;
  experience_level?: 'iniciante' | 'intermediario' | 'avancado';
  interest?: 'comprar' | 'vender' | 'ambos';
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export interface LeadCaptureState {
  hasSeenPopup: boolean;
  popupShowCount: number;
  lastPopupDate?: string;
  pagesViewed: number;
  timeOnSite: number;
  scrollDepth: number;
  isExitIntent: boolean;
}

export interface LeadStats {
  total_leads: number;
  days_active: number;
  verified_emails: number;
  with_whatsapp: number;
  downloads: number;
  avg_lead_score: number;
  leads_today: number;
  leads_week: number;
}