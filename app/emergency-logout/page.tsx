"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, LogOut } from "lucide-react"

export default function EmergencyLogoutPage() {
  const forceLogout = () => {
    // 1. Limpar TUDO do localStorage
    try {
      localStorage.clear()
      console.log('localStorage limpo')
    } catch (e) {
      console.error('Erro ao limpar localStorage:', e)
    }

    // 2. Limpar TUDO do sessionStorage
    try {
      sessionStorage.clear()
      console.log('sessionStorage limpo')
    } catch (e) {
      console.error('Erro ao limpar sessionStorage:', e)
    }

    // 3. Limpar TODOS os cookies
    try {
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/")
      })
      console.log('Cookies limpos')
    } catch (e) {
      console.error('Erro ao limpar cookies:', e)
    }

    // 4. Forçar redirecionamento completo
    window.location.replace('/')
  }

  const logoutViaAPI = () => {
    window.location.href = '/api/logout'
  }

  const logoutViaPage = () => {
    window.location.href = '/logout'
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card className="border-red-500">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <CardTitle className="text-red-500">Logout de Emergência</CardTitle>
          </div>
          <CardDescription>
            Se o logout normal não está funcionando, use estas opções
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Opção 1: Logout via API</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Usa a API route do servidor para fazer logout
            </p>
            <Button onClick={logoutViaAPI} variant="outline" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Logout via API
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Opção 2: Logout via Página</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Usa a página de logout dedicada
            </p>
            <Button onClick={logoutViaPage} variant="outline" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Logout via Página
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Opção 3: Força Bruta (Recomendado)</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Limpa TUDO manualmente e força redirecionamento
            </p>
            <Button onClick={forceLogout} variant="destructive" className="w-full">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Forçar Logout Completo
            </Button>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Instruções Manuais:</h4>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Abra o Console do navegador (F12)</li>
              <li>Cole e execute este código:</li>
            </ol>
            <pre className="mt-2 p-2 bg-background rounded text-xs overflow-auto">
{`localStorage.clear();
sessionStorage.clear();
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "")
    .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
});
window.location.replace('/');`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
