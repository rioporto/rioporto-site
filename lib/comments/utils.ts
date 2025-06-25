// lib/comments/utils.ts
import { createClient } from '@/lib/supabase/server';

/**
 * Verifica se um usuário é administrador
 */
export async function checkIfUserIsAdmin(userId: string | undefined): Promise<boolean> {
  if (!userId) return false;
  
  const supabase = await createClient();
  
  // Por enquanto, vamos verificar se o email é do admin
  // TODO: Implementar sistema de roles apropriado
  const { data: user } = await supabase
    .from('users')
    .select('email')
    .eq('id', userId)
    .single();
  
  return user?.email === 'johnnyhelder@gmail.com';
}

/**
 * Verifica o token do reCAPTCHA
 */
export async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.warn('RECAPTCHA_SECRET_KEY não configurada');
    return true; // Permitir em desenvolvimento
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Erro ao verificar reCAPTCHA:', error);
    return false;
  }
}

/**
 * Sanitiza conteúdo HTML para evitar XSS
 */
export function sanitizeHtml(content: string): string {
  // Remove tags HTML perigosas mas permite formatação básica
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/on\w+\s*=\s*"[^"]*"/gi, '') // Remove event handlers
    .replace(/on\w+\s*=\s*'[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

/**
 * Formata data relativa (ex: "há 2 horas")
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'agora mesmo';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `há ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `há ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `há ${diffInDays} ${diffInDays === 1 ? 'dia' : 'dias'}`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `há ${diffInMonths} ${diffInMonths === 1 ? 'mês' : 'meses'}`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `há ${diffInYears} ${diffInYears === 1 ? 'ano' : 'anos'}`;
}

/**
 * Gera avatar baseado no nome/email
 */
export function generateAvatar(name?: string | null, email?: string | null): string {
  const seed = name || email || 'anonymous';
  const initials = seed
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  // Gerar cor baseada no seed
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  const backgroundColor = `hsl(${hue}, 70%, 50%)`;
  
  // Retornar URL de um serviço de avatar ou gerar SVG
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${backgroundColor.slice(4, -1).replace(/,/g, '')}&color=fff`;
}

/**
 * Valida email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Extrai menções (@username) do conteúdo
 */
export function extractMentions(content: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const matches = content.match(mentionRegex);
  return matches ? matches.map(m => m.slice(1)) : [];
}

/**
 * Verifica se o conteúdo contém spam
 */
export async function checkForSpam(
  content: string,
  authorEmail?: string | null
): Promise<{ isSpam: boolean; confidence: number; reasons: string[] }> {
  const reasons: string[] = [];
  let spamScore = 0;

  // Verificar comprimento muito curto ou muito longo
  if (content.length < 10) {
    reasons.push('Conteúdo muito curto');
    spamScore += 20;
  }
  
  if (content.length > 3000) {
    reasons.push('Conteúdo muito longo');
    spamScore += 10;
  }

  // Verificar repetição excessiva de caracteres
  const repeatedChars = /(.)\1{4,}/g;
  if (repeatedChars.test(content)) {
    reasons.push('Caracteres repetidos excessivamente');
    spamScore += 30;
  }

  // Verificar excesso de links
  const linkCount = (content.match(/https?:\/\//g) || []).length;
  if (linkCount > 3) {
    reasons.push('Muitos links');
    spamScore += linkCount * 10;
  }

  // Verificar excesso de CAPS
  const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
  if (capsRatio > 0.5) {
    reasons.push('Excesso de letras maiúsculas');
    spamScore += 25;
  }

  // Verificar email suspeito
  if (authorEmail && authorEmail.includes('+') && authorEmail.includes('spam')) {
    reasons.push('Email suspeito');
    spamScore += 40;
  }

  return {
    isSpam: spamScore >= 50,
    confidence: Math.min(spamScore, 100),
    reasons,
  };
}

/**
 * Limita a profundidade de respostas aninhadas
 */
export async function getCommentDepth(
  commentId: string,
  supabase: any
): Promise<number> {
  let depth = 0;
  let currentId = commentId;

  while (currentId && depth < 10) { // Limite de segurança
    const { data } = await supabase
      .from('blog_comments')
      .select('parent_id')
      .eq('id', currentId)
      .single();

    if (!data?.parent_id) break;
    
    currentId = data.parent_id;
    depth++;
  }

  return depth;
}

/**
 * Notificar autor sobre resposta ao comentário
 */
export async function notifyCommentReply(
  parentCommentId: string,
  replyContent: string
): Promise<void> {
  // TODO: Implementar sistema de notificações por email
  // Por enquanto, apenas log
  console.log(`Notificação: Nova resposta ao comentário ${parentCommentId}`);
}

/**
 * Rate limiting por IP
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || record.resetAt < now) {
    // Criar novo registro ou resetar
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt: now + windowMs,
    };
  }

  if (record.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: record.resetAt,
    };
  }

  record.count++;
  
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetAt: record.resetAt,
  };
}

// Limpar registros expirados periodicamente
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(rateLimitMap.entries());
  for (const [key, value] of entries) {
    if (value.resetAt < now) {
      rateLimitMap.delete(key);
    }
  }
}, 60000); // A cada minuto