'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  MessageCircle, 
  Send, 
  Settings, 
  Users, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'
import { formatBRL } from '@/lib/utils'

interface WhatsAppMessage {
  id: string
  from: string
  to: string
  message: string
  type: 'inbound' | 'outbound'
  status: 'sent' | 'delivered' | 'read' | 'failed'
  created_at: string
}

interface QuotationHistory {
  id: string
  phone_number: string
  type: 'buy' | 'sell'
  crypto: string
  amount: number
  total: number
  status: 'pending' | 'sent' | 'confirmed' | 'expired'
  created_at: string
}

export default function WhatsAppAdminPage() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<WhatsAppMessage[]>([])
  const [quotations, setQuotations] = useState<QuotationHistory[]>([])
  const [activeTab, setActiveTab] = useState('send')
  
  // Form states
  const [phoneNumber, setPhoneNumber] = useState('')
  const [message, setMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)

  useEffect(() => {
    if (!user || profile?.level !== '3') {
      router.push('/dashboard')
    }
  }, [user, profile, router])

  // Enviar mensagem
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setSendingMessage(true)

    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: phoneNumber,
          message
        })
      })

      if (!response.ok) throw new Error('Falha ao enviar mensagem')

      toast.success('Mensagem enviada com sucesso!')
      setPhoneNumber('')
      setMessage('')
      
      // Recarregar mensagens
      await loadMessages()
      
    } catch (error) {
      toast.error('Erro ao enviar mensagem')
    } finally {
      setSendingMessage(false)
    }
  }

  // Carregar mensagens
  const loadMessages = async () => {
    setLoading(true)
    try {
      // TODO: Implementar endpoint para buscar mensagens
      // const response = await fetch('/api/whatsapp/messages')
      // const data = await response.json()
      // setMessages(data)
      
      // Dados mockados por enquanto
      setMessages([
        {
          id: '1',
          from: '+5521999999999',
          to: '+5521340003259',
          message: 'Olá, quero comprar Bitcoin',
          type: 'inbound',
          status: 'read',
          created_at: new Date().toISOString()
        }
      ])
    } catch (error) {
      toast.error('Erro ao carregar mensagens')
    } finally {
      setLoading(false)
    }
  }

  // Carregar cotações
  const loadQuotations = async () => {
    setLoading(true)
    try {
      // TODO: Implementar endpoint para buscar cotações
      // const response = await fetch('/api/whatsapp/quotations')
      // const data = await response.json()
      // setQuotations(data)
      
      // Dados mockados por enquanto
      setQuotations([
        {
          id: '1',
          phone_number: '+5521999999999',
          type: 'buy',
          crypto: 'BTC',
          amount: 0.001,
          total: 650,
          status: 'sent',
          created_at: new Date().toISOString()
        }
      ])
    } catch (error) {
      toast.error('Erro ao carregar cotações')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
    loadQuotations()
  }, [])

  // Formatar status
  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive", icon: any }> = {
      sent: { variant: 'default', icon: CheckCircle },
      delivered: { variant: 'secondary', icon: CheckCircle },
      read: { variant: 'default', icon: CheckCircle },
      failed: { variant: 'destructive', icon: XCircle },
      pending: { variant: 'secondary', icon: Clock },
      confirmed: { variant: 'default', icon: CheckCircle },
      expired: { variant: 'destructive', icon: XCircle }
    }

    const config = variants[status] || { variant: 'secondary', icon: AlertCircle }
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    )
  }

  if (!user || profile?.level !== '3') {
    return null
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">WhatsApp Business</h1>
        <p className="text-muted-foreground">
          Gerencie mensagens e cotações via WhatsApp
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="send">Enviar Mensagem</TabsTrigger>
          <TabsTrigger value="messages">Mensagens</TabsTrigger>
          <TabsTrigger value="quotations">Cotações</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        {/* Tab: Enviar Mensagem */}
        <TabsContent value="send">
          <Card>
            <CardHeader>
              <CardTitle>Enviar Mensagem</CardTitle>
              <CardDescription>
                Envie mensagens personalizadas via WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Número do WhatsApp</Label>
                  <Input
                    id="phone"
                    placeholder="+55 21 99999-9999"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    placeholder="Digite sua mensagem..."
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" disabled={sendingMessage}>
                  {sendingMessage ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Enviar Mensagem
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Mensagens */}
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Mensagens</CardTitle>
              <CardDescription>
                Todas as mensagens enviadas e recebidas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma mensagem encontrada
                </p>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="flex items-start justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          <span className="font-medium">
                            {msg.type === 'inbound' ? msg.from : msg.to}
                          </span>
                          {getStatusBadge(msg.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {msg.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(msg.created_at).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Cotações */}
        <TabsContent value="quotations">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Cotações</CardTitle>
              <CardDescription>
                Todas as cotações enviadas via WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : quotations.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma cotação encontrada
                </p>
              ) : (
                <div className="space-y-4">
                  {quotations.map((quote) => (
                    <div
                      key={quote.id}
                      className="flex items-start justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{quote.phone_number}</span>
                          <Badge variant={quote.type === 'buy' ? 'default' : 'secondary'}>
                            {quote.type === 'buy' ? 'Compra' : 'Venda'}
                          </Badge>
                          {getStatusBadge(quote.status)}
                        </div>
                        <p className="text-sm">
                          {quote.amount} {quote.crypto} = {formatBRL(quote.total)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(quote.created_at).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Configurações */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do WhatsApp</CardTitle>
              <CardDescription>
                Configure as integrações e webhooks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Webhook URL:</strong><br />
                  {`${process.env.NEXT_PUBLIC_APP_URL || 'https://rioporto-site.vercel.app'}/api/whatsapp/webhook`}
                  <br /><br />
                  Configure este URL no seu WhatsApp Business API.
                </AlertDescription>
              </Alert>

              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Número do WhatsApp Business</Label>
                  <Input value="+55 21 34000-3259" disabled />
                </div>

                <div className="space-y-2">
                  <Label>Status da Integração</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Conectado
                    </Badge>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Testar Conexão
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}