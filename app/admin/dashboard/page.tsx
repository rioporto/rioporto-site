// app/admin/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  Bitcoin,
  Phone,
  Mail,
  Calendar,
  Filter,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  Download
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import { QuotationsChart } from '@/components/admin/quotations-chart'

interface Quotation {
  id: string
  user_id: string | null
  type: 'buy' | 'sell'
  crypto: string
  amount: number
  brl_value: number
  fee: number
  total: number
  phone_number: string
  status: 'pending' | 'contacted' | 'completed' | 'cancelled'
  nome: string
  email: string
  telefone: string | null
  wallet: string | null
  observacoes: string | null
  metadata: any
  created_at: string
  updated_at: string
  contacted_at: string | null
  completed_at: string | null
}

interface DashboardStats {
  total: number
  pending: number
  contacted: number
  completed: number
  cancelled: number
  totalBRL: number
  totalBTC: number
}

export default function DashboardPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [filteredQuotations, setFilteredQuotations] = useState<Quotation[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    pending: 0,
    contacted: 0,
    completed: 0,
    cancelled: 0,
    totalBRL: 0,
    totalBTC: 0
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  // Filtros
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState<string>('all')
  
  const supabase = createClient()

  // Carregar cotações
  const loadQuotations = async () => {
    try {
      setRefreshing(true)
      
      const { data, error } = await supabase
        .from('quotations')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      setQuotations(data || [])
      calculateStats(data || [])
      applyFilters(data || [])
      
    } catch (error) {
      console.error('Erro ao carregar cotações:', error)
      toast.error('Erro ao carregar cotações')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Calcular estatísticas
  const calculateStats = (data: Quotation[]) => {
    const stats: DashboardStats = {
      total: data.length,
      pending: data.filter(q => q.status === 'pending').length,
      contacted: data.filter(q => q.status === 'contacted').length,
      completed: data.filter(q => q.status === 'completed').length,
      cancelled: data.filter(q => q.status === 'cancelled').length,
      totalBRL: data.reduce((sum, q) => sum + (q.total || 0), 0),
      totalBTC: data
        .filter(q => q.crypto === 'BTC' && q.status === 'completed')
        .reduce((sum, q) => sum + (q.amount || 0), 0)
    }
    setStats(stats)
  }

  // Aplicar filtros
  const applyFilters = (data: Quotation[]) => {
    let filtered = [...data]
    
    // Filtro de status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(q => q.status === statusFilter)
    }
    
    // Filtro de tipo
    if (typeFilter !== 'all') {
      filtered = filtered.filter(q => q.type === typeFilter)
    }
    
    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.telefone?.includes(searchTerm) ||
        q.phone_number?.includes(searchTerm)
      )
    }
    
    // Filtro de data
    if (dateFilter !== 'all') {
      const now = new Date()
      const filterDate = new Date()
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0)
          break
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          break
      }
      
      filtered = filtered.filter(q => 
        new Date(q.created_at) >= filterDate
      )
    }
    
    setFilteredQuotations(filtered)
  }

  // Atualizar status da cotação
  const updateQuotationStatus = async (id: string, status: string) => {
    try {
      const updates: any = { status, updated_at: new Date().toISOString() }
      
      // Adicionar timestamps específicos
      if (status === 'contacted') {
        updates.contacted_at = new Date().toISOString()
      } else if (status === 'completed') {
        updates.completed_at = new Date().toISOString()
      }
      
      const { error } = await supabase
        .from('quotations')
        .update(updates)
        .eq('id', id)
      
      if (error) throw error
      
      toast.success('Status atualizado com sucesso!')
      loadQuotations()
      
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast.error('Erro ao atualizar status')
    }
  }

  // Abrir WhatsApp
  // Exportar para CSV
  const exportToCSV = async () => {
    try {
      const params = new URLSearchParams()
      
      // Adicionar filtros atuais aos parâmetros
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (typeFilter !== 'all') params.append('type', typeFilter)
      // Adicionar outros filtros conforme necessário
      
      const response = await fetch(`/api/admin/export-quotations?${params}`)
      
      if (!response.ok) {
        throw new Error('Erro ao exportar')
      }
      
      // Criar blob e fazer download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cotacoes_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Cotações exportadas com sucesso!')
    } catch (error) {
      console.error('Erro ao exportar:', error)
      toast.error('Erro ao exportar cotações')
    }
  }

  const openWhatsApp = (quotation: Quotation) => {
    const phone = quotation.telefone || quotation.phone_number
    const cleanPhone = phone.replace(/\D/g, '')
    
    const message = encodeURIComponent(
      `Olá ${quotation.nome}!\n\n` +
      `Recebemos sua solicitação de cotação para ${quotation.type === 'buy' ? 'compra' : 'venda'} ` +
      `de ${quotation.amount} ${quotation.crypto}.\n\n` +
      `Valor: R$ ${quotation.brl_value.toFixed(2)}\n` +
      `Taxa: R$ ${quotation.fee.toFixed(2)}\n` +
      `Total: R$ ${quotation.total.toFixed(2)}\n\n` +
      `Como podemos prosseguir?`
    )
    
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank')
  }

  useEffect(() => {
    loadQuotations()
  }, [])

  useEffect(() => {
    applyFilters(quotations)
  }, [statusFilter, typeFilter, searchTerm, dateFilter])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; icon: any }> = {
      pending: { color: 'bg-yellow-500', icon: Clock },
      contacted: { color: 'bg-blue-500', icon: MessageSquare },
      completed: { color: 'bg-green-500', icon: CheckCircle2 },
      cancelled: { color: 'bg-red-500', icon: XCircle }
    }
    
    const variant = variants[status] || variants.pending
    const Icon = variant.icon
    
    return (
      <Badge className={`${variant.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Cotações</h1>
          <p className="text-muted-foreground">
            Gerencie todas as solicitações de cotação
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={loadQuotations} 
            disabled={refreshing}
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button
            onClick={exportToCSV}
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Gráficos */}
      <QuotationsChart quotations={quotations} />

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cotações</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Todas as solicitações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando contato
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats.totalBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Soma de todas cotações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BTC Negociado</CardTitle>
            <Bitcoin className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBTC.toFixed(8)}</div>
            <p className="text-xs text-muted-foreground">
              Total completado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Buscar</Label>
              <Input
                placeholder="Nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="contacted">Contactado</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Tipo</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="buy">Compra</SelectItem>
                  <SelectItem value="sell">Venda</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Período</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Última semana</SelectItem>
                  <SelectItem value="month">Último mês</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Cotações */}
      <Card>
        <CardHeader>
          <CardTitle>Cotações ({filteredQuotations.length})</CardTitle>
          <CardDescription>
            Lista completa de solicitações de cotação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cripto</TableHead>
                  <TableHead>Valor BRL</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotations.map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell>
                      {format(new Date(quotation.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{quotation.nome}</p>
                        <p className="text-sm text-muted-foreground">{quotation.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={quotation.type === 'buy' ? 'default' : 'secondary'}>
                        {quotation.type === 'buy' ? 'Compra' : 'Venda'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Bitcoin className="w-4 h-4 text-orange-500" />
                        {quotation.amount} {quotation.crypto}
                      </div>
                    </TableCell>
                    <TableCell>R$ {quotation.brl_value.toFixed(2)}</TableCell>
                    <TableCell>
                      <p className="font-medium">R$ {quotation.total.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Taxa: R$ {quotation.fee.toFixed(2)}</p>
                    </TableCell>
                    <TableCell>{getStatusBadge(quotation.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openWhatsApp(quotation)}
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                        
                        {quotation.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuotationStatus(quotation.id, 'contacted')}
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        )}
                        
                        {quotation.status === 'contacted' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600"
                              onClick={() => updateQuotationStatus(quotation.id, 'completed')}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600"
                              onClick={() => updateQuotationStatus(quotation.id, 'cancelled')}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredQuotations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma cotação encontrada com os filtros aplicados
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
