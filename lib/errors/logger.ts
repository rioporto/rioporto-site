// lib/errors/logger.ts

import { AppError, isAppError } from './types'

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

interface LogContext {
  userId?: string
  sessionId?: string
  requestId?: string
  url?: string
  method?: string
  userAgent?: string
  ip?: string
  [key: string]: any
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: Date
  error?: AppError | Error
  context?: LogContext
  stack?: string
}

class ErrorLogger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private logs: LogEntry[] = []
  private maxLogs = 1000

  private formatError(error: Error | AppError): object {
    if (isAppError(error)) {
      return {
        name: error.name,
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        details: error.details,
        stack: this.isDevelopment ? error.stack : undefined
      }
    }
    
    return {
      name: error.name,
      message: error.message,
      stack: this.isDevelopment ? error.stack : undefined
    }
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    error?: Error | AppError,
    context?: LogContext
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date(),
      error,
      context,
      stack: error?.stack
    }
  }

  private log(entry: LogEntry): void {
    // Adicionar ao histórico
    this.logs.push(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // Console log formatado
    const prefix = `[${entry.timestamp.toISOString()}] [${entry.level.toUpperCase()}]`
    const message = `${prefix} ${entry.message}`
    
    if (this.isDevelopment) {
      switch (entry.level) {
        case LogLevel.ERROR:
          console.error(message, entry.error, entry.context)
          break
        case LogLevel.WARN:
          console.warn(message, entry.context)
          break
        case LogLevel.INFO:
          console.info(message, entry.context)
          break
        case LogLevel.DEBUG:
          console.debug(message, entry.context)
          break
      }
    } else {
      // Em produção, enviar logs estruturados
      console.log(JSON.stringify({
        ...entry,
        error: entry.error ? this.formatError(entry.error) : undefined
      }))
    }
    
    // Em produção, você pode enviar para serviços como Sentry, LogRocket, etc
    if (!this.isDevelopment && entry.level === LogLevel.ERROR) {
      this.sendToExternalService(entry)
    }
  }

  private sendToExternalService(entry: LogEntry): void {
    // TODO: Implementar integração com Sentry ou similar
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(entry.error, {
    //     contexts: { custom: entry.context }
    //   })
    // }
  }

  error(message: string, error?: Error | AppError, context?: LogContext): void {
    const entry = this.createLogEntry(LogLevel.ERROR, message, error, context)
    this.log(entry)
  }

  warn(message: string, context?: LogContext): void {
    const entry = this.createLogEntry(LogLevel.WARN, message, undefined, context)
    this.log(entry)
  }

  info(message: string, context?: LogContext): void {
    const entry = this.createLogEntry(LogLevel.INFO, message, undefined, context)
    this.log(entry)
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      const entry = this.createLogEntry(LogLevel.DEBUG, message, undefined, context)
      this.log(entry)
    }
  }

  getLogs(level?: LogLevel, limit: number = 100): LogEntry[] {
    let filteredLogs = this.logs
    
    if (level) {
      filteredLogs = this.logs.filter(log => log.level === level)
    }
    
    return filteredLogs.slice(-limit)
  }

  clearLogs(): void {
    this.logs = []
  }
}

// Singleton instance
export const logger = new ErrorLogger()

// Helper functions
export function logError(error: Error | AppError, context?: LogContext): void {
  logger.error(error.message, error, context)
}

export function logApiError(
  endpoint: string,
  error: Error | AppError,
  requestData?: any
): void {
  logger.error(`API Error: ${endpoint}`, error, {
    url: endpoint,
    requestData: process.env.NODE_ENV === 'development' ? requestData : undefined,
    timestamp: new Date().toISOString()
  })
}

export function logDatabaseError(
  operation: string,
  error: Error | AppError,
  query?: any
): void {
  logger.error(`Database Error: ${operation}`, error, {
    operation,
    query: process.env.NODE_ENV === 'development' ? query : undefined,
    timestamp: new Date().toISOString()
  })
}

export function logAuthError(
  action: string,
  error: Error | AppError,
  userId?: string
): void {
  logger.error(`Auth Error: ${action}`, error, {
    action,
    userId,
    timestamp: new Date().toISOString()
  })
}