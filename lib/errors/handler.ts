// lib/errors/handler.ts

import { NextResponse } from 'next/server'
import { 
  CustomError, 
  ErrorCode, 
  isAppError, 
  mapSupabaseError 
} from './types'
import { logger } from './logger'
import { toast } from 'sonner'

interface ErrorResponse {
  error: {
    code: string
    message: string
    statusCode: number
    timestamp: string
    path?: string
    details?: any
  }
}

// Handler para API Routes
export function handleApiError(
  error: any,
  path?: string
): NextResponse<ErrorResponse> {
  let appError: CustomError

  if (isAppError(error)) {
    appError = error as CustomError
  } else if (error?.code?.startsWith('PG') || error?.code?.startsWith('23')) {
    appError = mapSupabaseError(error)
  } else {
    appError = new CustomError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      error?.message || 'Erro interno do servidor',
      500,
      { originalError: error }
    )
  }

  // Log do erro
  logger.error(`API Error: ${path || 'unknown'}`, appError, {
    path,
    statusCode: appError.statusCode,
    code: appError.code
  })

  // Resposta padronizada
  return NextResponse.json(
    {
      error: {
        code: appError.code,
        message: appError.message,
        statusCode: appError.statusCode,
        timestamp: new Date().toISOString(),
        path,
        details: process.env.NODE_ENV === 'development' ? appError.details : undefined
      }
    },
    { status: appError.statusCode }
  )
}

// Handler para erros no cliente
export function handleClientError(error: any, showToast: boolean = true): void {
  let message: string
  let title: string = 'Erro'

  if (isAppError(error)) {
    const appError = error as CustomError
    message = appError.message
    
    switch (appError.code) {
      case ErrorCode.UNAUTHORIZED:
        title = 'Não autorizado'
        break
      case ErrorCode.VALIDATION_ERROR:
        title = 'Erro de validação'
        break
      case ErrorCode.NOT_FOUND:
        title = 'Não encontrado'
        break
      case ErrorCode.NETWORK_ERROR:
        title = 'Erro de conexão'
        break
      case ErrorCode.RATE_LIMIT_EXCEEDED:
        title = 'Muitas tentativas'
        break
      default:
        title = 'Erro'
    }
  } else {
    message = error?.message || 'Ocorreu um erro inesperado'
  }

  // Log do erro
  logger.error('Client Error', error, {
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined
  })

  // Mostrar toast se habilitado
  if (showToast && typeof window !== 'undefined') {
    toast.error(title, {
      description: message,
      duration: 5000
    })
  }
}

// Wrapper para chamadas assíncronas com retry
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number
    delay?: number
    backoff?: boolean
    onRetry?: (attempt: number, error: any) => void
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = true,
    onRetry
  } = options

  let lastError: any

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      // Log da tentativa
      logger.warn(`Retry attempt ${attempt}/${maxAttempts}`, {
        error: (error as any)?.message,
        attempt
      })

      // Callback de retry
      if (onRetry) {
        onRetry(attempt, error)
      }

      // Se for o último attempt, lançar o erro
      if (attempt === maxAttempts) {
        throw error
      }

      // Aguardar antes da próxima tentativa
      const waitTime = backoff ? delay * Math.pow(2, attempt - 1) : delay
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }

  throw lastError
}

// Wrapper para operações com timeout
export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number = 30000
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new CustomError(
        ErrorCode.TIMEOUT,
        `Operação excedeu o tempo limite de ${timeoutMs}ms`,
        408
      ))
    }, timeoutMs)
  })

  return Promise.race([fn(), timeoutPromise])
}

// Handler para erros de formulário
export function handleFormError(
  error: any,
  setErrors?: (errors: Record<string, string>) => void
): void {
  if (isAppError(error) && error.code === ErrorCode.VALIDATION_ERROR) {
    const validationError = error as CustomError
    
    if (validationError.details && typeof validationError.details === 'object') {
      // Se houver erros de campo específicos
      if (setErrors) {
        setErrors(validationError.details)
      }
    }
  }

  handleClientError(error)
}

// Função para criar mensagens de erro user-friendly
export function getUserFriendlyMessage(error: any): string {
  if (!error) return 'Ocorreu um erro inesperado'

  // Mensagens específicas por código
  const errorMessages: Record<string, string> = {
    [ErrorCode.UNAUTHORIZED]: 'Você precisa fazer login para continuar',
    [ErrorCode.FORBIDDEN]: 'Você não tem permissão para acessar este recurso',
    [ErrorCode.SESSION_EXPIRED]: 'Sua sessão expirou. Por favor, faça login novamente',
    [ErrorCode.NOT_FOUND]: 'O recurso solicitado não foi encontrado',
    [ErrorCode.NETWORK_ERROR]: 'Erro de conexão. Verifique sua internet',
    [ErrorCode.TIMEOUT]: 'A operação demorou muito. Tente novamente',
    [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Muitas tentativas. Aguarde um momento',
    [ErrorCode.SERVICE_UNAVAILABLE]: 'Serviço temporariamente indisponível'
  }

  if (isAppError(error)) {
    const appError = error as CustomError
    return errorMessages[appError.code] || appError.message
  }

  return error.message || 'Ocorreu um erro inesperado'
}