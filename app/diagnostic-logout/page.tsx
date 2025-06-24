"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, XCircle } from "lucide-react"

export default function DiagnosticLogoutPage() {
  const [diagnostics, setDiagnostics] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    runDiagnostics()
  }, [])

  const runDiagnostics = async () => {
    setLoading(true)
    const results: any = {}

    // 1. Verificar localStorage
    try {
      const localStorageKeys = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) localStorageKeys.push(key)
      }
      results.localStorage = {
        status: localStorageKeys.length > 0 ? 'warning' : 'success',
        count: localStorageKeys.length,
        keys: localStorageKeys,
        supabaseKeys: localStorageKeys.filter(k => k.includes('supabase'))
      }
    } catch (e) {
      results.localStorage = { status: 'error', error: e }
    }

    // 2. Verificar sessionStorage
    try {
      const sessionStorageKeys = []
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key) sessionStorageKeys.push(key)
      }
      results.sessionStorage = {
        status: sessionStorageKeys.length > 0 ? 'warning' : 'success',
        count: sessionStorageKeys.length,
        keys: sessionStorageKeys
      }
    } catch (e) {
      results.sessionStorage = { status: 'error', error: e }
    }

    // 3. Verificar cookies
    try {
      const cookies = document.cookie.split('; ')
      const cookieData = cookies.map(c => {
        const [name, value] = c.split('=')
        return { name, value: value?.substring(0, 20) + '...' }
      })
      results.cookies = {
        status: cookies.length > 1 ? 'warning' : 'success',
        count: cookies.length,
        data: cookieData,
        supabaseCookies: cookieData.filter(c => c.name?.includes('supabase'))
      }
    } catch (e) {
      results.cookies = { status: 'error', error: e }
    }

    // 4. Verificar Supabase
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      results.supabase = {
        status: session ? 'warning' : 'success',
        hasSession: !!session,
        userId: session?.user?.id,
        email: session?.user?.email
      }
    } catch (e) {
      results.supabase = { status: 'error', error: e }
    }

    setDiagnostics(results)
    setLoading(false)
  }

  const clearEverything = async () => {
    // 1. localStorage
    try {
      localStorage.clear()
      console.log('✓ localStorage limpo')
    } catch (e) {
      console.error('✗ Erro ao limpar localStorage:', e)
    }

    // 2. sessionStorage
    try {
      sessionStorage.clear()
      console.log('✓ sessionStorage limpo')
    } catch (e) {
      console.error('✗ Erro ao limpar sessionStorage:', e)
    }

    // 3. Cookies
    try {
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=")
        const name = eqPos > -1 ? c.substring(0, eqPos).trim() : c.trim()
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`
      })
      console.log('✓ Cookies limpos')
    } catch (e) {
      console.error('✗ Erro ao limpar cookies:', e)
    }

    // 4. IndexedDB
    try {
      if ('indexedDB' in window) {
        const databases = await indexedDB.databases()
        for (const db of databases) {
          if (db.name) {
            indexedDB.deleteDatabase(db.name)
            console.log(`✓ IndexedDB ${db.name} deletado`)
          }
        }
      }
    } catch (e) {
      console.error('✗ Erro ao limpar IndexedDB:', e)
    }

    // 5. Aguardar e redirecionar
    setTimeout(() => {
      window.location.replace('/')
    }, 500)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Diagnóstico de Logout</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Executando diagnóstico...</p>
          ) : (
            <Tabs defaultValue="diagnostics">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="diagnostics">Diagnóstico</TabsTrigger>
                <TabsTrigger value="actions">Ações</TabsTrigger>
              </TabsList>
              
              <TabsContent value="diagnostics" className="space-y-4">
                {/* localStorage */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(diagnostics.localStorage?.status)}
                      <h3 className="font-semibold">localStorage</h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Items: {diagnostics.localStorage?.count || 0}
                    </p>
                    {diagnostics.localStorage?.supabaseKeys?.length > 0 && (
                      <p className="text-sm text-yellow-600">
                        Supabase keys encontradas: {diagnostics.localStorage.supabaseKeys.length}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* sessionStorage */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(diagnostics.sessionStorage?.status)}
                      <h3 className="font-semibold">sessionStorage</h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Items: {diagnostics.sessionStorage?.count || 0}
                    </p>
                  </CardContent>
                </Card>

                {/* Cookies */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(diagnostics.cookies?.status)}
                      <h3 className="font-semibold">Cookies</h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Total: {diagnostics.cookies?.count || 0}
                    </p>
                    {diagnostics.cookies?.supabaseCookies?.length > 0 && (
                      <p className="text-sm text-yellow-600">
                        Cookies Supabase: {diagnostics.cookies.supabaseCookies.length}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Supabase Session */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(diagnostics.supabase?.status)}
                      <h3 className="font-semibold">Sessão Supabase</h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {diagnostics.supabase?.hasSession ? (
                        <>Sessão ativa: {diagnostics.supabase.email}</>
                      ) : (
                        'Nenhuma sessão ativa'
                      )}
                    </p>
                  </CardContent>
                </Card>

                <Button onClick={runDiagnostics} variant="outline" className="w-full">
                  Executar Diagnóstico Novamente
                </Button>
              </TabsContent>
              
              <TabsContent value="actions" className="space-y-4">
                <Card className="border-red-500">
                  <CardHeader>
                    <CardTitle className="text-red-500">Limpar Tudo e Fazer Logout</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Esta ação irá:
                    </p>
                    <ul className="text-sm list-disc list-inside space-y-1">
                      <li>Limpar localStorage</li>
                      <li>Limpar sessionStorage</li>
                      <li>Limpar todos os cookies</li>
                      <li>Limpar IndexedDB</li>
                      <li>Redirecionar para home</li>
                    </ul>
                    <Button 
                      onClick={clearEverything} 
                      variant="destructive" 
                      className="w-full"
                    >
                      Executar Limpeza Completa
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
