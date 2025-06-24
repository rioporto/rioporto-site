"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getBlogPosts } from "@/lib/blog/api"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function BlogDebugPage() {
  const [tests, setTests] = useState({
    browser: { status: 'pending', message: '' },
    supabase: { status: 'pending', message: '' },
    api: { status: 'pending', message: '' },
    fetch: { status: 'pending', message: '' }
  })

  useEffect(() => {
    runDiagnostics()
  }, [])

  async function runDiagnostics() {
    // Test 1: Browser Detection
    const userAgent = window.navigator.userAgent
    const isEdge = userAgent.includes('Edg/')
    const isChrome = userAgent.includes('Chrome/')
    const isSafari = userAgent.includes('Safari/') && !userAgent.includes('Chrome')
    
    setTests(prev => ({
      ...prev,
      browser: {
        status: 'success',
        message: `Browser: ${isEdge ? 'Microsoft Edge' : isChrome ? 'Google Chrome' : isSafari ? 'Safari' : 'Other'} - ${userAgent}`
      }
    }))

    // Test 2: Supabase Connection
    try {
      const { posts } = await getBlogPosts({ limit: 1 })
      setTests(prev => ({
        ...prev,
        supabase: {
          status: 'success',
          message: `Conexão com Supabase OK - ${posts.length} post(s) encontrado(s)`
        }
      }))
    } catch (error) {
      setTests(prev => ({
        ...prev,
        supabase: {
          status: 'error',
          message: `Erro Supabase: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
        }
      }))
    }

    // Test 3: API Route
    try {
      const response = await fetch('/api/blog/rss')
      const text = await response.text()
      setTests(prev => ({
        ...prev,
        api: {
          status: response.ok ? 'success' : 'error',
          message: `API Route: ${response.status} - ${response.ok ? 'OK' : text.substring(0, 100)}`
        }
      }))
    } catch (error) {
      setTests(prev => ({
        ...prev,
        api: {
          status: 'error',
          message: `Erro API: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
        }
      }))
    }

    // Test 4: Fetch Polyfill
    try {
      const testUUID = crypto.randomUUID ? crypto.randomUUID() : 'not-supported'
      setTests(prev => ({
        ...prev,
        fetch: {
          status: crypto.randomUUID ? 'success' : 'warning',
          message: `Crypto.randomUUID: ${testUUID}`
        }
      }))
    } catch (error) {
      setTests(prev => ({
        ...prev,
        fetch: {
          status: 'error',
          message: `Erro Crypto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
        }
      }))
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'pending':
        return <Loader2 className="h-5 w-5 animate-spin" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'default'
      case 'error':
        return 'destructive'
      case 'warning':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <main className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Diagnóstico do Blog - Edge Browser</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(tests).map(([key, test]) => (
            <div key={key} className="flex items-start gap-4 p-4 border rounded-lg">
              {getStatusIcon(test.status)}
              <div className="flex-1">
                <h3 className="font-semibold capitalize">{key}</h3>
                <p className="text-sm text-muted-foreground mt-1">{test.message}</p>
              </div>
              <Badge variant={getStatusColor(test.status) as any}>
                {test.status}
              </Badge>
            </div>
          ))}
          
          <div className="mt-6 pt-6 border-t">
            <Button onClick={() => window.location.reload()}>
              Executar Novamente
            </Button>
            <Button variant="outline" className="ml-2" asChild>
              <a href="/blog">Voltar ao Blog</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}