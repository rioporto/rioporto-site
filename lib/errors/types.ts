// lib/errors/types.ts

export enum ErrorCode {
  // Erros de Autenticação
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  
  // Erros de Validação
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // Erros de Banco de Dados
  DATABASE_ERROR = 'DATABASE_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  
  // Erros de Rede
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  
  // Erros de Negócio
  BUSINESS_ERROR = 'BUSINESS_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  
  // Erros Gerais
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR'
}

export interface AppError extends Error {
  code: ErrorCode
  statusCode?: number
  details?: any
  timestamp?: Date
  path?: string
  isOperational?: boolean
}

export class CustomError extends Error implements AppError {
  code: ErrorCode
  statusCode: number
  details?: any
  timestamp: Date
  path?: string
  isOperational: boolean

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number = 500,
    details?: any,
    isOperational: boolean = true
  ) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.statusCode = statusCode
    this.details = details
    this.timestamp = new Date()
    this.isOperational = isOperational
    
    Error.captureStackTrace(this, this.constructor)
  }
}

// Erros específicos
export class AuthenticationError extends CustomError {
  constructor(message: string = 'Erro de autenticação', details?: any) {
    super(ErrorCode.UNAUTHORIZED, message, 401, details)
  }
}

export class ValidationError extends CustomError {
  constructor(message: string = 'Erro de validação', details?: any) {
    super(ErrorCode.VALIDATION_ERROR, message, 400, details)
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = 'Recurso não encontrado', details?: any) {
    super(ErrorCode.NOT_FOUND, message, 404, details)
  }
}

export class DatabaseError extends CustomError {
  constructor(message: string = 'Erro no banco de dados', details?: any) {
    super(ErrorCode.DATABASE_ERROR, message, 500, details)
  }
}

export class NetworkError extends CustomError {
  constructor(message: string = 'Erro de rede', details?: any) {
    super(ErrorCode.NETWORK_ERROR, message, 503, details)
  }
}

export class RateLimitError extends CustomError {
  constructor(message: string = 'Limite de requisições excedido', details?: any) {
    super(ErrorCode.RATE_LIMIT_EXCEEDED, message, 429, details)
  }
}

export class BusinessError extends CustomError {
  constructor(message: string, details?: any) {
    super(ErrorCode.BUSINESS_ERROR, message, 400, details)
  }
}

// Type guards
export function isAppError(error: any): error is AppError {
  return error instanceof CustomError || (error && 'code' in error && 'message' in error)
}

export function isOperationalError(error: any): boolean {
  if (isAppError(error)) {
    return error.isOperational !== false
  }
  return false
}

// Mapeamento de erros do Supabase para nossos erros customizados
export function mapSupabaseError(error: any): CustomError {
  if (!error) return new CustomError(ErrorCode.UNKNOWN_ERROR, 'Erro desconhecido')
  
  const code = error.code || error.error?.code
  const message = error.message || error.error?.message || 'Erro no Supabase'
  
  switch (code) {
    case 'PGRST301':
    case '42P01':
      return new NotFoundError('Recurso não encontrado no banco de dados')
    
    case '23505':
      return new ValidationError('Registro duplicado', { field: error.details })
    
    case '23503':
      return new ValidationError('Violação de chave estrangeira', { field: error.details })
    
    case '42501':
      return new AuthenticationError('Permissão negada')
    
    case 'invalid_grant':
    case 'invalid_token':
      return new AuthenticationError('Token inválido ou expirado')
    
    default:
      return new DatabaseError(message, { originalError: error })
  }
}