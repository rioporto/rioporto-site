// lib/security/validation.ts
// Validações de segurança seguindo OWASP Top 10

import { z } from 'zod'

// Rate limiting em memória (para produção, usar Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

/**
 * Rate limiting simples
 */
export function checkRateLimit(identifier: string, maxRequests = 10, windowMs = 60000): boolean {
  const now = Date.now()
  const userLimit = rateLimitMap.get(identifier)

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    })
    return true
  }

  if (userLimit.count >= maxRequests) {
    return false
  }

  userLimit.count++
  return true
}

/**
 * Schema de validação para cotação
 */
export const cotacaoSchema = z.object({
  tipo: z.enum(['compra', 'venda']),
  cryptoName: z.string().min(1).max(100),
  valorBRL: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Valor BRL inválido'),
  valorCripto: z.string().regex(/^\d+(\.\d{1,8})?$/, 'Valor cripto inválido'),
  price: z.number().positive(),
  wallet: z.string().max(200).optional(),
  observacoes: z.string().max(500).optional(),
  nome: z.string().min(3).max(100),
  email: z.string().email().max(100),
  telefone: z.string().max(20).optional(),
})

/**
 * Sanitiza strings para prevenir XSS
 */
export function sanitizeString(input: string): string {
  if (!input) return ''
  
  // Remove tags HTML básicas e caracteres perigosos
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[<>\"']/g, '')
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove caracteres de controle
    .trim()
}

/**
 * Sanitiza objeto completo
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = {} as T
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeString(value) as T[keyof T]
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key as keyof T] = sanitizeObject(value)
    } else {
      sanitized[key as keyof T] = value
    }
  }
  
  return sanitized
}

/**
 * Valida e sanitiza dados de cotação
 */
export function validateAndSanitizeCotacao(data: unknown) {
  // Primeiro, valida a estrutura
  const validated = cotacaoSchema.parse(data)
  
  // Depois, sanitiza os campos de texto
  return {
    ...validated,
    nome: sanitizeString(validated.nome),
    email: sanitizeString(validated.email),
    telefone: validated.telefone ? sanitizeString(validated.telefone) : undefined,
    wallet: validated.wallet ? sanitizeString(validated.wallet) : undefined,
    observacoes: validated.observacoes ? sanitizeString(validated.observacoes) : undefined,
    cryptoName: sanitizeString(validated.cryptoName),
  }
}

/**
 * Mascara dados sensíveis para logs
 */
export function maskSensitiveData(data: any): any {
  const masked = { ...data }
  
  // Mascara email
  if (masked.email) {
    const [local, domain] = masked.email.split('@')
    masked.email = local.substring(0, 3) + '***@' + domain
  }
  
  // Mascara telefone
  if (masked.telefone) {
    masked.telefone = masked.telefone.substring(0, 4) + '****' + masked.telefone.slice(-2)
  }
  
  // Mascara wallet
  if (masked.wallet) {
    masked.wallet = masked.wallet.substring(0, 6) + '...' + masked.wallet.slice(-4)
  }
  
  // Remove nome completo dos logs
  if (masked.nome) {
    const nomes = masked.nome.split(' ')
    masked.nome = nomes[0] + ' ' + (nomes[nomes.length - 1] || '').charAt(0) + '.'
  }
  
  return masked
}

/**
 * Gera token CSRF
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array)
  } else {
    // Fallback para servidor
    const crypto = require('crypto')
    return crypto.randomBytes(32).toString('hex')
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Headers de segurança recomendados
 */
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.zdassets.com https://*.zendesk.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.zendesk.com https://api.coingecko.com wss://*.zendesk.com",
}

/**
 * Valida origem da requisição
 */
export function validateOrigin(origin: string | null): boolean {
  const allowedOrigins = [
    'https://rioporto-site.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ]
  
  if (!origin) return false
  return allowedOrigins.includes(origin)
}