// hooks/use-error.ts

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  handleClientError, 
  handleFormError, 
  getUserFriendlyMessage,
  ErrorCode,
  CustomError,
  isAppError
} from '@/lib/errors'
import { toast } from 'sonner'

interface UseErrorOptions {
  showToast?: boolean
  redirectOnAuth?: boolean
  retryable?: boolean
}

interface UseErrorReturn {
  error: Error | null
  isError: boolean
  errorMessage: string | null
  handleError: (error: any, options?: UseErrorOptions) => void
  clearError: () => void
  retry: (() => Promise<void>) | null
}

export function useError(defaultOptions?: UseErrorOptions): UseErrorReturn {
  const [error, setError] = useState<Error | null>(null)
  const [retryFn, setRetryFn] = useState<(() => Promise<void>) | null>(null)
  const router = useRouter()

  const handleError = useCallback((err: any, options?: UseErrorOptions) => {
    const opts = { ...defaultOptions, ...options }
    const { showToast = true, redirectOnAuth = true, retryable = false } = opts

    setError(err)

    // Verificar se é erro de autenticação
    if (isAppError(err)) {
      const appError = err as CustomError
      
      if (redirectOnAuth && (
        appError.code === ErrorCode.UNAUTHORIZED ||
        appError.code === ErrorCode.SESSION_EXPIRED
      )) {
        // Salvar URL atual para redirecionar após login
        const currentPath = window.location.pathname
        sessionStorage.setItem('redirectAfterLogin', currentPath)
        
        toast.error('Sessão expirada', {
          description: 'Por favor, faça login novamente',
          duration: 3000
        })
        
        setTimeout(() => {
          router.push('/login')
        }, 1000)
        
        return
      }
    }

    // Handler padrão
    handleClientError(err, showToast)
  }, [router, defaultOptions])

  const clearError = useCallback(() => {
    setError(null)
    setRetryFn(null)
  }, [])

  const errorMessage = error ? getUserFriendlyMessage(error) : null

  return {
    error,
    isError: !!error,
    errorMessage,
    handleError,
    clearError,
    retry: retryFn
  }
}

// Hook específico para operações assíncronas
export function useAsyncError() {
  const { handleError } = useError()

  return useCallback((error: any) => {
    handleError(error)
  }, [handleError])
}

// Hook para formulários
export function useFormError() {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const { error, handleError: baseHandleError, clearError } = useError()

  const handleError = useCallback((err: any) => {
    if (isAppError(err) && err.code === ErrorCode.VALIDATION_ERROR) {
      const validationError = err as CustomError
      
      if (validationError.details && typeof validationError.details === 'object') {
        setFieldErrors(validationError.details)
      }
    }
    
    baseHandleError(err)
  }, [baseHandleError])

  const clearFieldError = useCallback((field: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  const clearAllErrors = useCallback(() => {
    setFieldErrors({})
    clearError()
  }, [clearError])

  return {
    error,
    fieldErrors,
    handleError,
    clearFieldError,
    clearAllErrors
  }
}