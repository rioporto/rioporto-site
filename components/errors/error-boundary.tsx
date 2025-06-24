// components/errors/error-boundary.tsx

'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import { logger } from '@/lib/errors/logger'
import Link from 'next/link'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorCount: number
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorCount: 0
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log do erro
    logger.error('React Error Boundary', error, {
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    })

    // Callback customizado
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Atualizar state com informações do erro
    this.setState(prevState => ({
      errorInfo,
      errorCount: prevState.errorCount + 1
    }))

    // Se muitos erros consecutivos, recarregar a página
    if (this.state.errorCount > 3) {
      window.location.reload()
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    })
  }

  render() {
    if (this.state.hasError) {
      // Se houver fallback customizado
      if (this.props.fallback) {
        return <>{this.props.fallback}</>
      }

      // Fallback padrão
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
          <div className="max-w-md w-full">
            <div className="bg-card border border-destructive/20 rounded-lg shadow-xl p-8">
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Ícone de erro */}
                <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-destructive" />
                </div>

                {/* Título e descrição */}
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-foreground">
                    Ops! Algo deu errado
                  </h1>
                  <p className="text-muted-foreground">
                    Encontramos um erro inesperado. Não se preocupe, já registramos
                    o problema e nossa equipe está trabalhando para resolvê-lo.
                  </p>
                </div>

                {/* Detalhes do erro (apenas em desenvolvimento) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="w-full mt-4">
                    <details className="text-left">
                      <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                        Detalhes técnicos
                      </summary>
                      <div className="mt-2 p-4 bg-muted/50 rounded-md">
                        <p className="text-xs font-mono text-destructive">
                          {this.state.error.name}: {this.state.error.message}
                        </p>
                        {this.state.errorInfo && (
                          <pre className="mt-2 text-xs overflow-auto max-h-40">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        )}
                      </div>
                    </details>
                  </div>
                )}

                {/* Ações */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button
                    onClick={this.resetError}
                    variant="default"
                    className="flex-1"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Tentar novamente
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1"
                  >
                    <Link href="/">
                      <Home className="w-4 h-4 mr-2" />
                      Página inicial
                    </Link>
                  </Button>
                </div>

                {/* Informação adicional */}
                <p className="text-xs text-muted-foreground">
                  Se o problema persistir, entre em contato com{' '}
                  <a
                    href="mailto:suporte@rioporto.com"
                    className="text-primary hover:underline"
                  >
                    suporte@rioporto.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook para usar ErrorBoundary
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return {
    throwError: (error: Error) => setError(error),
    resetError: () => setError(null)
  }
}