// components/system-check.tsx
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react'

interface SystemStatus {
  supabaseConnected: boolean | null
  resendConfigured: boolean | null
  leadsTableExists: boolean | null
  apiWorking: boolean | null
}

export function SystemCheck() {
  const [status, setStatus] = useState<SystemStatus>({
    supabaseConnected: null,
    resendConfigured: null,
    leadsTableExists: null,
    apiWorking: null
  })
  const [checking, setChecking] = useState(true)
  
  useEffect(() => {
    checkSystem()
  }, [])
  
  const checkSystem = async () => {
    setChecking(true)
    
    // Verificar Supabase
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      setStatus(prev => ({ 
        ...prev, 
        supabaseConnected: !!(supabaseUrl && supabaseKey) 
      }))
    } catch (e) {
      setStatus(prev => ({ ...prev, supabaseConnected: false }))
    }
    
    // Verificar Resend
    try {
      // Verificar se as variáveis existem no frontend
      setStatus(prev => ({ 
        ...prev, 
        resendConfigured: true // Não podemos verificar do frontend
      }))
    } catch (e) {
      setStatus(prev => ({ ...prev, resendConfigured: false }))
    }
    
    // Verificar API
    try {
      const response = await fetch('/api/lead-capture', {
        method: 'GET'
      })
      setStatus(prev => ({ 
        ...prev, 
        apiWorking: response.ok || response.status === 400
      }))
    } catch (e) {
      setStatus(prev => ({ ...prev, apiWorking: false }))
    }
    
    setChecking(false)
  }
  
  const getIcon = (status: boolean | null) => {
    if (status === null) return <Loader2 className="w-4 h-4 animate-spin" />
    if (status) return <CheckCircle2 className="w-4 h-4 text-green-500" />
    return <XCircle className="w-4 h-4 text-red-500" />
  }
  
  const allGood = Object.values(status).every(s => s === true)
  
  if (allGood && !checking) return null
  
  return (
    <Card className="fixed top-4 right-4 w-80 z-50 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-500" />
          Verificação do Sistema
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span>Supabase Configurado</span>
          {getIcon(status.supabaseConnected)}
        </div>
        <div className="flex items-center justify-between">
          <span>API Respondendo</span>
          {getIcon(status.apiWorking)}
        </div>
        {!allGood && !checking && (
          <div className="pt-2 border-t">
            <p className="text-xs text-red-600">
              ⚠️ Execute o SQL de criação da tabela leads no Supabase!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
