// lib/errors/index.ts

// Re-export types
export * from './types'

// Re-export logger
export * from './logger'

// Re-export handler
export * from './handler'

// Convenience exports
export { logger } from './logger'
export { 
  CustomError,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  DatabaseError,
  NetworkError,
  RateLimitError,
  BusinessError,
  ErrorCode
} from './types'