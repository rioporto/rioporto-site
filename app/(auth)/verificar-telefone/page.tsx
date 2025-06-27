"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, Loader2, RefreshCw } from "lucide-react"
import toast from "react-hot-toast"

function VerificarTelefoneContent() {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const phone = searchParams.get("phone") || ""
  const userId = searchParams.get("userId") || ""
  const redirect = searchParams.get("redirect") || "/dashboard"

  useEffect(() => {
    // Countdown para reenvio
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (code.length !== 6) {
      toast.error("O código deve ter 6 dígitos")
      return
    }

    try {
      setLoading(true)
      
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code, userId }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Telefone verificado com sucesso!")
        router.push(redirect)
      } else {
        toast.error(data.error || "Código inválido")
      }
    } catch (error) {
      toast.error("Erro ao verificar código")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      setResending(true)
      
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, userId, email: sessionStorage.getItem('userEmail') }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Novo código enviado!")
        setCountdown(60) // 60 segundos para poder reenviar novamente
        setCode("")
        
        // Em desenvolvimento, mostrar o código
        if (data.otp) {
          toast.success(`[DEV] Código: ${data.otp}`, { duration: 10000 })
        }
      } else {
        toast.error(data.error || "Erro ao enviar código")
      }
    } catch (error) {
      toast.error("Erro ao reenviar código")
    } finally {
      setResending(false)
    }
  }

  const formatPhone = (phone: string) => {
    // Formatar para exibição
    const numbers = phone.replace(/\D/g, "")
    if (numbers.length === 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
    }
    return phone
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Phone className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl">Verificar WhatsApp</CardTitle>
        <CardDescription>
          Enviamos um código de verificação para seu <strong>email</strong><br />
          Para confirmar o WhatsApp: <strong>{formatPhone(phone)}</strong>
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Código de verificação</Label>
            <Input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              required
              disabled={loading}
              className="text-center text-2xl tracking-widest"
              autoComplete="one-time-code"
            />
            <p className="text-xs text-muted-foreground text-center">
              Digite o código de 6 dígitos enviado para seu email
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full"
            disabled={loading || code.length !== 6}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              "Verificar código"
            )}
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Não recebeu o código?
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResend}
              disabled={resending || countdown > 0}
            >
              {resending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Reenviando...
                </>
              ) : countdown > 0 ? (
                `Reenviar em ${countdown}s`
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reenviar código
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}

export default function VerificarTelefonePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <VerificarTelefoneContent />
    </Suspense>
  )
}